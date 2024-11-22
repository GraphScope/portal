from typing import Iterable, Dict, Any, Optional, List
from memory.llm_memory import VectorDBHierarchy

from langchain_core.documents import Document
from langchain_community.document_loaders import Blob
from langchain_community.document_loaders.pdf import BasePDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
import urllib.parse

from extractor.pdf_extractor import PDFExtractor, SegmentedLineInfo

import fitz
import os
import re
import json
import logging

logger = logging.getLogger(__name__)


def make_rect(*args: Any) -> Optional[fitz.Rect]:
    rect = None
    try:
        rect = fitz.Rect(args[0])
    except ValueError:
        logger.error(f"{args}")
    return rect


class CitationInfo:
    """
    A class to represent citation information within a PDF.

    Attributes:
        from_rect (List[fitz.Rect]): The rectangles representing the locations of the citations in the source document (one page).
        from_content (List[str]): The text contents within the from_rect rectangles.
        to_point (fitz.Point): The point representing the destination of the citation.
        to_content (str): The text content at the destination point.
    """

    def __init__(
        self,
        from_rect: list[fitz.Rect],
        from_content: list[str],
        to_page_num: int,
        to_point: fitz.Point,
        to_content: str,
        is_figure: bool,
        is_table: bool,
    ):
        self.from_rect = from_rect
        self.from_content = from_content
        self.to_page_num = to_page_num
        self.to_point = to_point
        self.to_content = to_content
        self.is_figure = is_figure
        self.is_table = is_table

    def __str__(self) -> str:
        """
        Returns a string representation of the citation information.

        Returns:
            str: A string representation of the citation information.
        """
        return json.dumps(self.to_dict(), indent=2)

    def add_from_rect(self, new_rect):
        self.from_rect.append(new_rect)

    def add_from_content(self, new_content):
        self.from_content.append(new_content)

    def to_dict(self) -> Dict[str, Any]:
        """
        Converts the CitationInfo object to a dictionary.

        Returns:
            dict: The dictionary representation of the CitationInfo object.
        """
        return {
            # "from_rect": [
            #    self.from_rect.x0,
            #    self.from_rect.y0,
            #    self.from_rect.x1,
            #    self.from_rect.y1,
            # ],
            "from_rect": [
                [rect.x0, rect.y0, rect.x1, rect.y1] for rect in self.from_rect
            ],
            "from_content": self.from_content,
            "to_page_num": self.to_page_num,
            "to_point": [self.to_point.x, self.to_point.y],
            "to_content": self.to_content,
            "is_figure": self.is_figure,
            "is_table": self.is_table,
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "CitationInfo":
        """
        Parses a dictionary to create a CitationInfo object.

        Args:
            data (dict): The dictionary representation of a CitationInfo object.

        Returns:
            CitationInfo: The parsed CitationInfo object.
        """
        from_rect = [fitz.Rect(r) for r in data["from_rect"]]
        from_content = data["from_content"]
        to_page_num = int(data["to_page_num"])
        to_point = fitz.Point(data["to_point"])
        to_content = data["to_content"]
        is_figure = bool(data["is_figure"])
        is_table = bool(data["is_table"])
        return cls(
            from_rect,
            from_content,
            to_page_num,
            to_point,
            to_content,
            is_figure,
            is_table,
        )

    def to_str(self) -> str:
        """
        Converts the CitationInfo object to a JSON string.

        Returns:
            str: The JSON string representation of the CitationInfo object.
        """
        return json.dumps(self.to_dict())

    @classmethod
    def from_str(cls, data: str) -> "CitationInfo":
        """
        Parses a JSON string to create a CitationInfo object.

        Args:
            data (str): The JSON string representation of a CitationInfo object.

        Returns:
            CitationInfo: The parsed CitationInfo object.
        """
        data_dict = json.loads(data)
        return cls.from_dict(data_dict)


class PaperExtractor(PDFExtractor):
    def __init__(
        self,
        file_path: str,
        gt_file_path: str = ["inputs/gt_files/section_title_gt.txt"],
        block_id_str: List[str] = ["page_index", "section", "part_index"],
        inline_img_width: int = 8,
        zoom=1.0,
        chunk_size=500,
        chunk_overlap=0,
        # chunk_overlap=50,
    ):
        try:
            super().__init__(
                file_path, gt_file_path, block_id_str, chunk_size, chunk_overlap
            )
        except Exception as e:
            raise ValueError(f"{e}")

        logger.info(f"Extract pdf file: {file_path}")

        self.inline_img_width = inline_img_width
        self.zoom = zoom

        self.default_line_height = 15
        self.minimum_rect_intersect = 50

        self.dest_dict = self.doc.resolve_names()

        self.image_caption_under_item = True
        self.table_caption_under_item = True

        self.section_ids = [str(i) for i in list(range(1, 15))]
        self.section_ids.extend([self.int_to_roman(i) for i in list(range(1, 15))])
        self.special_titles = ["abstract", "reference", "acknowledgements"]
        self.section_signal_unheaded = ["abstract", "acknowledgements"]

        self._define_re_templates()

        self.linked_contents = set()

    def _define_re_templates(self):
        self.figure_template_str = ["Figure \d+:", "Fig. \d+:"]
        self.figure_templates = []
        for template in self.figure_template_str:
            self.figure_templates.append(re.compile(template, re.IGNORECASE))

        self.image_caption_checker = "^Figure \d+:"
        self.image_caption_checker_template = re.compile(
            self.image_caption_checker, re.IGNORECASE
        )

        self.table_caption_checker = "^Table \d+:"
        self.table_caption_checker_template = re.compile(
            self.table_caption_checker, re.IGNORECASE
        )

    def compute_links(self):
        self._initialize()
        self.linked_contents = set()
        for page_num, page in enumerate(self.doc):
            self._extract_link(page, page_num)

    def get_largest_sentence_in_page_one(self):
        max_font_size = -1
        max_font_size_content = None

        for block in self.page_texts[0]["blocks"]:
            if "bbox" not in block or "lines" not in block:
                continue
            try:
                line = block["lines"][0]
                if line["dir"] != (1.0, 0.0):
                    continue

                span_first = line["spans"][0]

                if span_first["size"] >= max_font_size:
                    title_candidate = ""
                    for line in block["lines"]:
                        for span in line["spans"]:
                            title_candidate += span["text"]

                    # if len(title_candidate.split()) <= 2:
                    #    continue

                    replace_max = False
                    if title_candidate[0] not in ["."]:
                        if span_first["size"] > max_font_size:
                            replace_max = True
                        elif span_first["size"] == max_font_size:
                            if max_font_size_content[0] > block["bbox"][1]:
                                replace_max = True

                    if replace_max:
                        max_font_size = span["size"]
                        max_font_size_content = (block["bbox"][1], title_candidate)
            except:
                continue

        return max_font_size_content[1]

    def get_meta_data(self):
        meta = self.doc.metadata

        try:
            meta_title_len = len(meta["title"].split())
        except:
            meta_title_len = 0

        if meta_title_len <= 2:
            largest_sentence = self.get_largest_sentence_in_page_one()

            # print("====== THREE VERSIONS TITLE ======")
            # print("META: " + str(meta["title"]))
            # print("EXTRACT: " + str(record_title))
            # print("LARGEST: " + str(largest_sentence))

            if (
                # extract_title_len <= meta_title_len
                # and
                len(largest_sentence.split())
                < meta_title_len
            ):
                return meta
            else:
                meta["title"] = largest_sentence
            # elif extract_title_len <= largest_sentence:
            #    meta["title"] = largest_sentence
            # else:
            #    meta["title"] = record_title

        return meta

    def _get_span_with_point(self, page, page_num, point):
        offset = (-3, -3, 3, 3)
        page_text = self.page_texts[page_num]
        # page_text = page.get_text("dict")
        for block in page_text["blocks"]:
            if block["type"] == 1:
                continue
            rb = fitz.Rect(block["bbox"]) + offset
            if rb.y0 > point.y or rb.y1 < point.y:
                continue
            for line in block["lines"]:
                for span in line["spans"]:
                    r = fitz.Rect(span["bbox"]) + offset
                    if r.contains(fitz.Point((r.x0 + r.x1) / 2, point.y)):
                        return span

        return -1

    def _get_line_height_of_point(self, page, page_num, point):
        span = self._get_span_with_point(page, page_num, point)
        if span == -1:
            return self.default_line_height
        else:
            return span["bbox"][3] - span["bbox"][1]

    def _is_image_line(self, line):
        # Concatenate text spans in a line
        concat_str = " ".join(span["text"] for span in line["spans"])

        # Check if the number of words is less than the threshold
        return len(concat_str.split()) < self.inline_img_width

    def _is_image_block(self, block):
        total_lines = len(block["lines"])
        if total_lines == 0:
            return False

        image_lines = sum(1 for line in block["lines"] if self._is_image_line(line))

        # Check if more than 50% of the lines in the block are image lines
        return (image_lines / total_lines) > 0.5

    def _extract_inline_images(self, page, page_num, page_text, image_info):
        if not self.img_path:
            raise ValueError("Image path not set")
        expansion_coef = (-5, -5, 5, 5)
        image_list = []
        # inline_image_rects = dict()
        for img_info in page.get_image_info():
            image_list.append(fitz.Rect(img_info["bbox"]))

        # text = page.get_text("dict")

        text_positions = []
        # image_positions = []

        start_posx = -1
        start_posy = -1

        # Iterate over blocks
        for block in page_text["blocks"]:
            if block["type"] == 1:
                start_posx = -1
                start_posy = -1
                continue
            elif block["type"] == 0:  # text block
                if not self._is_image_block(block):
                    if start_posx != -1 and start_posy != -1:
                        finished = False
                        for line in block["lines"]:
                            for span in line["spans"]:
                                for template in self.figure_templates:
                                    if template.search(span["text"]):
                                        x1 = min(start_posx, block["bbox"][0])
                                        y1 = start_posy
                                        x2 = block["bbox"][2]
                                        y2 = block["bbox"][3]
                                        rect = fitz.Rect(x1, y1, x2, y2)

                                        img_exist = False
                                        for image_rect in image_list:
                                            if image_rect.intersects(
                                                rect + expansion_coef
                                            ):
                                                img_exist = True
                                                break

                                        if not img_exist:
                                            text_positions.append(rect)

                                        finished = True
                                        break
                                if finished:
                                    break
                            if finished:
                                break

                    start_posx = -1
                    start_posy = -1
                else:
                    if start_posx == -1 or start_posy == -1:
                        start_posx = block["bbox"][0]
                        start_posy = block["bbox"][1]
                    else:
                        start_posx = min(start_posx, block["bbox"][0])
                        start_posy = min(start_posy, block["bbox"][1])

        # Iterate over each identified position
        for pos_index, rect in enumerate(text_positions):

            # Define the zoom factor (2.0 for high resolution)
            mat = fitz.Matrix(self.zoom, self.zoom)

            # Render the area to a pixmap (image)
            pix = page.get_pixmap(matrix=mat, clip=rect)

            # Define the output image path
            image_path = os.path.join(
                self.img_path, f"page{page_num}_pos{pos_index+1}.png"
            )

            # Save the rendered image
            # pix.save(image_path)

            # image_positions.append(image_path)
            if page_num not in image_info:
                image_info[page_num] = dict()
            image_info[page_num][image_path] = rect

        return image_info

    def int_to_roman(self, num):
        # 定义罗马数字符号和相应的值
        val = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1]
        syms = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"]

        roman_num = ""
        i = 0
        while num > 0:
            for _ in range(num // val[i]):
                roman_num += syms[i]
                num -= val[i]
            i += 1
        return roman_num

    def roman_to_int(self, s):
        if not self.contains_roman(s):
            return s

        roman_values = {"i": 1, "v": 5, "x": 10}

        total = 0
        prev_value = 0

        for char in reversed(s):
            if char not in roman_values:
                return -1
            value = roman_values[char]
            if value < prev_value:
                total -= value
            else:
                total += value
            prev_value = value

        return str(total)

    def _extract_tables(self, page, page_num, table_info, image_info):
        expansion_coef = (-5, -5, 5, 5)

        for table_index, table in enumerate(page.find_tables().tables):
            table_position = table.bbox
            table_rect = fitz.Rect(table_position)

            table_in_image = False
            if page_num in image_info:
                for image_path in image_info[page_num]:
                    image_rect = image_info[page_num][image_path]
                    if image_rect.intersects(table_rect - expansion_coef):
                        table_in_image = True
                        break

            if not table_in_image:
                mat = fitz.Matrix(self.zoom, self.zoom)

                pix = page.get_pixmap(matrix=mat, clip=table_rect)

                table_path = os.path.join(
                    self.img_path, f"page{page_num}_table{table_index+1}.png"
                )
                pix.save(table_path)

                if page_num not in table_info:
                    table_info[page_num] = dict()
                table_info[page_num][table_path] = table_rect

        return table_info

    def _extract_images(self, page, page_num, page_text, image_info):
        if not self.img_path:
            raise ValueError("Image path not set")

        img_index = 0
        inf_rect = fitz.Rect(1, 1, -1, -1)

        for img_index, img in enumerate(page.get_images(full=True)):
            xref = img[0]
            base_image = self.doc.extract_image(xref)
            image_filename = f"page{page_num}_img{img_index}.png"
            image_path = os.path.join(self.img_path, image_filename)

            try:
                image_bbox = page.get_image_bbox(img)
                if image_bbox == inf_rect:
                    continue
            except:
                continue

            with open(image_path, "wb") as f:
                f.write(base_image["image"])
            # image_paths.append(image_path)

            if page_num not in image_info:
                image_info[page_num] = dict()
            image_info[page_num][image_path] = fitz.Rect(image_bbox)

        self._extract_inline_images(page, page_num, page_text, image_info)
        # image_paths.extend(inline_image_paths)
        # image_info.update(inline_image_info)

        # logger.debug(f"Extracted {len(image_info)} images")

        return image_info

    def _match_figure(self, figure_string, findex):
        if re.search(rf"Figure\s+{re.escape(findex)}", figure_string):
            return True

        if re.search(rf"Fig.\s+{re.escape(findex)}", figure_string):
            return True

        return False

    def _match_table(self, table_string, tindex):
        if re.search(rf"Table\s+{re.escape(tindex)}", table_string):
            return True

        return False

    def _match_section(self, section_string, sindex):
        if re.search(rf"Section\s+{re.escape(sindex)}", section_string):
            return True

        if re.search(rf"Sec.\s+{re.escape(sindex)}", section_string):
            return True

        if re.search(rf"§{re.escape(sindex)}", section_string):
            return True

        return False

    def _match_appendix(self, appendix_string, aindex):
        if re.search(rf"Appendix\s+{re.escape(aindex)}", appendix_string):
            return True

        return False

    def _match_algorithm(self, algorithm_string, algindex):
        if re.search(rf"Algorithm\s+{re.escape(algindex)}", algorithm_string):
            return True

        if re.search(rf"Alg.\s+{re.escape(algindex)}", algorithm_string):
            return True

        return False

    def _match_equation(self, equation_string, eindex):
        if re.search(rf"Equation\s+{re.escape(eindex)}", equation_string):
            return True

        if re.search(rf"Eq.\s+{re.escape(eindex)}", equation_string):
            return True

        return False

    def _match_type(self, keywords: List[str], string: str, index: str):
        if len(keywords) == 0:
            return False
        for keyword in keywords:
            if re.search(rf"{keyword}\s+{re.escape(index)}", string):
                return True
        return False

    def _extract_link(self, page, page_num):
        """Extract links from a given PDF page and retrieve the associated text."""
        page_width = page.rect.width
        page_height = page.rect.height
        d = (-3, -3, 3, 3)  # Small margin around the destination rectangle

        link_info = dict()

        # Iterate over all links in the page
        for link in page.get_links():
            # Only process GOTO and NAMED links
            if link["kind"] not in [fitz.LINK_GOTO, fitz.LINK_NAMED]:
                continue

            # Get the source rectangle and the text within it
            start_rect = link["from"]
            start_rect_refined = self._shrink_rect(start_rect, d)
            # link_content = page.get_textbox(start_rect).split("\n")[0]
            # print("BEFORE SOURCE ++++++++++++++")
            # print(link_content)
            source_content_list = self.pdf_content_index.query_intersecting_rectangles(
                start_rect_refined.x0,
                start_rect_refined.y0 + self.max_page_height * page_num,
                start_rect_refined.x1,
                start_rect_refined.y1 + self.max_page_height * page_num,
            )
            # link_content = link_content_list[0].object.info.line_content
            source_list = [(source.id, source.object) for source in source_content_list]
            sorted_source_list = sorted(source_list, key=lambda x: x[0])
            link_content = " ".join(
                [source[1].info.line_content.strip() for source in sorted_source_list]
            )

            # print("AFTER SOURCE ++++++++++++++")
            # print(link_content)

            # link_content = source_text

            type_keys = [
                ["Fig.", "Figure"],
                ["Table"],
                ["Sec.", "Section", "§"],
                ["Alg.", "Algorithm"],
                ["Appendix"],
                ["Eq.", "Equation"],
                ["Theorem"],
                [],
                [],
            ]
            type_names = [
                "is_figure_link",
                "is_table_link",
                "is_section_link",
                "is_algorithm_link",
                "is_appendix_link",
                "is_equation_link",
                "is_theorem_link",
                "is_footnote_link",
                "is_other_link",
            ]
            type_dict = {}
            for type_name in type_names:
                type_dict[type_name] = False

            for index, type_name in enumerate(type_names):
                for type_key in type_keys[index]:
                    if type_key in link_content:
                        type_dict[type_name] = True
                        break

            from_point = fitz.Point(
                (start_rect.x0 + start_rect.x1) / 2,
                (start_rect.y0 + start_rect.y1) / 2,
            )
            point_line = self._get_line_with_point(page, page_num, from_point)

            if point_line is not None and "spans" in point_line:
                last_span = None
                for span in point_line["spans"]:
                    if fitz.Rect(span["bbox"]).contains(from_point):
                        break
                    last_span = span

                for index, type_name in enumerate(type_names):
                    if len(type_keys[index]) == 0:
                        continue
                    if "text" in span and self._match_type(
                        type_keys[index], span["text"], link_content.strip()
                    ):
                        type_dict[type_name] = True
                    elif last_span is not None:
                        if "text" in span and "text" in last_span:
                            if span["text"].strip().startswith(link_content.strip()):
                                for type_key in type_keys[index]:
                                    if last_span["text"].strip().endswith(type_key):
                                        type_dict[type_name] = True
                                        break

            # if 'Fig.' in link_content or 'Figure' in link_content:
            #    continue

            # Get the destination point and load the destination page

            # Ensure the link has a destination

            if "to" not in link:
                if "nameddest" not in link:
                    continue
                else:
                    # named_dest = (
                    #     link["nameddest"].replace("%3A", ":").replace("%40", "@")
                    # )
                    named_dest = urllib.parse.unquote(link["nameddest"])
                    if (
                        named_dest not in self.dest_dict
                        or "to" not in self.dest_dict[named_dest]
                        or self.dest_dict[named_dest]["to"] is None
                    ):
                        continue
                    dest_point = fitz.Point(self.dest_dict[named_dest]["to"])
                    dest_page_num = self.dest_dict[named_dest]["page"]
            else:
                dest_point = link["to"]
                dest_page_num = link["page"]

            # if is_figure_link or is_table_link:
            #     dest_point = fitz.Point(dest_point.x, page_height - dest_point.y)

            # print("****************** CATCH ***********")
            # print(is_figure_link or is_table_link)
            # print(dest_page_num)
            # print(dest_point)

            dest_page = self.pages[dest_page_num]
            # dest_page = self.doc.load_page(dest_page_num)

            line_height_unit = self._get_line_height_of_point(
                dest_page,
                dest_page_num,
                fitz.Point(dest_point.x, page_height - dest_point.y),
            )

            if page_num == dest_page_num:
                to_point = fitz.Point(
                    dest_point.x,
                    page_height - dest_point.y + line_height_unit / 2,
                )
                point_line = self._get_line_with_point(page, page_num, to_point)
                if (
                    point_line is not None
                    and "spans" in point_line
                    and len(point_line["spans"]) >= 2
                ):
                    first_span = point_line["spans"][0]
                    second_span = point_line["spans"][1]

                    if (
                        second_span["size"] - first_span["size"] > 0.5
                        and first_span["bbox"][1] < second_span["bbox"][1]
                        and first_span["bbox"][3] < second_span["bbox"][3]
                    ):
                        type_dict["is_footnote_link"] = True

            cur_height = 2
            while cur_height <= 5:
                # Define a rectangle around the destination point to extract the text
                line_height = cur_height * line_height_unit

                # line_height = 15  # Assume a line height of 15 for the destination text
                if self.column_number.get(dest_page_num, 1) == 1:
                    dest_rect = fitz.Rect(
                        0,
                        page_height - dest_point.y,
                        page_width,
                        page_height - (dest_point.y - line_height),
                    )
                elif (
                    self.column_number.get(dest_page_num, 1) == 2
                    and dest_point.x >= page_width / 2
                ):
                    dest_rect = fitz.Rect(
                        page_width / 2,
                        page_height - dest_point.y,
                        page_width,
                        page_height - (dest_point.y - line_height),
                    )
                else:
                    dest_rect = fitz.Rect(
                        # dest_point.x,
                        0,
                        page_height - dest_point.y,
                        page_width / 2,
                        page_height - (dest_point.y - line_height),
                    )

                dest_rect_refined = dest_rect + (-3, 2, 0, -2)
                # self._shrink_rect(dest_rect, d)
                # print("====== AFTER COR -=======")
                # print(page_height, dest_point.y, line_height)
                # print(dest_rect_refined)

                # Extract text from the destination rectangle
                # dest_text = (
                #     dest_page.get_textbox(dest_rect + d)
                #     .replace("-\n", "")  # Remove hyphenated line breaks
                #     .replace("\n", "")  # Remove new lines
                # )

                # print("BEFORE DEST ===============")
                # print(dest_text)
                dest_content_list = (
                    self.pdf_content_index.query_intersecting_rectangles(
                        dest_rect_refined.x0,
                        dest_rect_refined.y0 + self.max_page_height * dest_page_num,
                        dest_rect_refined.x1,
                        dest_rect_refined.y1 + self.max_page_height * dest_page_num,
                    )
                )

                dest_list = [(dest.id, dest.object) for dest in dest_content_list]
                sorted_dest_list = sorted(dest_list, key=lambda x: x[0])
                dest_text = (
                    " ".join(
                        [dest[1].info.line_content.strip() for dest in sorted_dest_list]
                    )
                    .replace("-\n", "")
                    .replace("\n", " ")
                )

                if dest_text.strip().endswith("."):
                    break
                else:
                    cur_height += 1
            # print("AFTER DEST ===============")
            # print(dest_point)
            # print(
            #     (
            #         dest_rect_refined.x0,
            #         dest_rect_refined.y0 + self.max_page_height * dest_page_num,
            #         dest_rect_refined.x1,
            #         dest_rect_refined.y1 + self.max_page_height * dest_page_num,
            #     )
            # )
            # print(dest_list)
            # print(point_line)
            # print(span)
            # print(dest_text)
            # print(is_section_link)

            # From xxxxx to Figure 1: xxxxx or Table 1: xxxxx
            # line = self._get_line_with_point(
            #    dest_page,
            #    dest_page_num,
            #    fitz.Point(dest_point.x, page_height - dest_point.y),
            # )
            # if line:
            #    line_text = dest_page.get_textbox(fitz.Rect(line["bbox"]) + d)
            #    if self.image_caption_checker_template.match(line_text):
            #        is_figure_link = True
            #    elif self.table_caption_checker_template.match(line_text):
            #        is_table_link = True

            if dest_list and len(dest_list) >= 10:
                type_dict["type_names"] = True

            # Add the destination text to the set to avoid duplicates
            if dest_text not in link_info:
                link_info[dest_text] = CitationInfo(
                    from_rect=[start_rect],
                    from_content=[link_content],
                    to_page_num=dest_page_num,
                    to_point=dest_point,
                    to_content=dest_text,
                    is_figure=type_dict.get("is_figure_link", False),
                    is_table=type_dict.get("is_table_link", False),
                )
            else:
                link_info[dest_text].add_from_rect(start_rect)
                link_info[dest_text].add_from_content(link_content)

            if not any(type_dict.values()):
                self.linked_contents.add(dest_text)

            logger.debug(f"Extracted {len(link_info)} links")

        return link_info

    def _check_possible_section_title(
        self,
        line,
        page_num,
        section_height_dict,
        content_list,
        last_index,
        standard_format,
    ):
        line_height = round(line["spans"][0]["size"], 3)  # round(y1 - y0, 3)
        line_font = line["spans"][0]["font"]

        succ, line_content = self._get_line_text(line)
        line_content_lower = line_content.lower()

        if not line_content:
            return False, last_index

        if line_content_lower in self.section_gt:
            if last_index:
                section_height_dict[line_height] = (
                    section_height_dict.get(line_height, 0) + 100
                )
                if not self.contains_digit(content_list[-1]["content"]):
                    standard_format["is_roman_index"] = True
                standard_format["standard_font"] = line_font
            last_index = False
        elif line_content_lower in self.section_signal_unheaded:
            section_height_dict[line_height] = (
                section_height_dict.get(line_height, 0) + 100
            )
            last_index = False
        elif line_content in self.section_ids:
            if last_index:
                content_list.pop()
            last_index = True
        elif line_content[-1] == "." and line_content[:-1] in self.section_ids:  # I.
            if last_index:
                content_list.pop()
            line_content = line_content[:-1]
            last_index = True
        else:
            is_possible_title, title_list = self._is_possible_section_title(
                line_content
            )

            if is_possible_title == 1:
                for title in title_list:
                    content_list.append(
                        {
                            "content": title.lower(),
                            "page_num": page_num,
                            "location": line["bbox"],
                            "height": line_height,
                            "font": line_font,
                        }
                    )
                if title_list[-1].lower() in self.section_gt:
                    section_height_dict[line_height] = (
                        section_height_dict.get(line_height, 0) + 100
                    )
                    if not self.contains_digit(title_list[0]):
                        standard_format["is_roman_index"] = True
                    standard_format["standard_font"] = line_font
                else:
                    section_height_dict[line_height] = (
                        section_height_dict.get(line_height, 0) + 1
                    )
                last_index = False
                return True, last_index
            elif is_possible_title == 0:
                if last_index:
                    content_list.append(
                        {
                            "content": line_content.lower(),
                            "page_num": page_num,
                            "location": line["bbox"],
                            "height": line_height,
                            "font": line_font,
                        }
                    )
                    section_height_dict[line_height] = (
                        section_height_dict.get(line_height, 0) + 1
                    )
                    last_index = False
                    return True, last_index
            else:
                if last_index:
                    content_list.pop()

            last_index = False
            return False, last_index

        content_list.append(
            {
                "content": line_content.lower(),
                "page_num": page_num,
                "location": line["bbox"],
                "height": line_height,
                "font": line_font,
            }
        )

        return True, last_index

    def _double_check_possible_section_title(
        self,
        span,
        next_span_font,
        page_num,
        section_height_dict,
        content_list,
        last_index,
        standard_format,
    ):
        span_height = round(span["size"], 3)  # round(y1 - y0, 3)
        span_font = span["font"]
        succ, span_content = self._get_span_text(span)
        span_content_lower = span_content.lower()

        if not span_content or last_index or span_font == next_span_font:
            return False, last_index

        if span_content_lower in self.section_signal_unheaded:
            section_height_dict[span_height] = (
                section_height_dict.get(span_height, 0) + 100
            )
            last_index = False
        else:
            is_possible_title, title_list = self._is_possible_section_title(
                span_content
            )

            if is_possible_title == 1:
                for title in title_list:
                    content_list.append(
                        {
                            "content": title.lower(),
                            "page_num": page_num,
                            "location": span["bbox"],
                            "height": span_height,
                            "font": span_font,
                        }
                    )
                if title_list[-1].lower() in self.section_gt:
                    section_height_dict[span_height] = (
                        section_height_dict.get(span_height, 0) + 100
                    )
                    if not self.contains_digit(title_list[0]):
                        standard_format["is_roman_index"] = True
                    standard_format["standard_font"] = span_font
                else:
                    section_height_dict[span_height] = (
                        section_height_dict.get(span_height, 0) + 1
                    )
                last_index = False
                return True, last_index
            else:
                if last_index:
                    content_list.pop()

            last_index = False

            return False, last_index

        content_list.append(
            {
                "content": span_content.lower(),
                "page_num": page_num,
                "location": span["bbox"],
                "height": span_height,
                "font": span_font,
            }
        )

        return True, last_index

    def _get_section_standard(self):
        section_height_dict = dict()
        content_list = []
        last_index = False
        standard_format = {"is_roman_index": False, "standard_font": None}
        fitz.TOOLS.set_small_glyph_heights(True)

        for page_num, page in enumerate(self.doc):
            page_text = self.page_texts[page_num]

            for block in page_text["blocks"]:
                if block["type"] == 1:
                    continue

                for line in block["lines"]:
                    succeed, last_index = self._check_possible_section_title(
                        line,
                        page_num,
                        section_height_dict,
                        content_list,
                        last_index,
                        standard_format,
                    )

                    if not succeed:
                        if "spans" in line and len(line["spans"]) >= 2:
                            first_span = line["spans"][0]
                            second_span_font = line["spans"][1]["font"]
                            succeed, last_index = (
                                self._double_check_possible_section_title(
                                    first_span,
                                    second_span_font,
                                    page_num,
                                    section_height_dict,
                                    content_list,
                                    last_index,
                                    standard_format,
                                )
                            )

        return standard_format, section_height_dict, content_list

    def _get_section_title_info(self):
        standard_format, section_height_dict, content_list = (
            self._get_section_standard()
        )

        logger.debug(f"STANDARD_FORMAT: {standard_format}")
        logger.debug(f"SECTION_HEIGHT_DICT: {section_height_dict}")

        if len(section_height_dict) == 0:
            logger.info("Section Title Not Found !")
            return [{"sec_name": "all text", "section_id": "0"}], []

        section_order = [{"sec_name": "title and authors", "section_id": "paper_meta"}]

        cur_sec = -1
        cur_rect = None
        cur_page_num = 0
        last_page_num = 0
        fetch_more = False
        max_height = max(section_height_dict, key=lambda k: section_height_dict[k])
        last_sec = -1

        for item in content_list:
            if (
                section_height_dict.get(item["height"], 0) <= 2
                or abs(max_height - item["height"])
                >= 0.2  # if the height is quite different from section_height
            ):
                continue
            item_content = item["content"]
            if item_content in self.special_titles and not fetch_more:
                if cur_rect is not None:
                    if section_order[-1]["section_id"] == cur_sec:
                        section_order[-1].update(
                            {
                                "page_num": cur_page_num,
                                "location": fitz.Rect(cur_rect),
                            }
                        )
                    cur_rect = None
                cur_sec = item_content
                cur_rect = fitz.Rect(item["location"])
                cur_page_num = int(item["page_num"])
                # section_order.append(cur_sec)
                section_order.append(
                    {
                        "sec_name": item_content.lower(),
                        "section_id": cur_sec,
                    }
                )
                fetch_more = False
            elif item_content.upper() in self.section_ids:
                if fetch_more:
                    section_order.pop()
                    cur_rect = None
                    fetch_more = False
                else:
                    if cur_rect is not None:
                        location = make_rect(cur_rect)
                        if section_order[-1]["section_id"] == cur_sec:
                            section_order[-1].update(
                                {
                                    "page_num": cur_page_num,
                                    "location": location,
                                }
                            )
                        cur_rect = None

                if standard_format["is_roman_index"] and self.contains_digit(
                    item_content
                ):
                    continue
                elif not standard_format["is_roman_index"] and self.contains_roman(
                    item_content
                ):
                    continue

                if (
                    standard_format["standard_font"]
                    and item["font"] != standard_format["standard_font"]
                ):
                    continue

                cur_sec = self.roman_to_int(item_content)
                cur_rect = fitz.Rect(item["location"])
                cur_page_num = int(item["page_num"])

                if cur_page_num >= last_page_num and int(cur_sec) <= last_sec:
                    logger.warn(f"SECTION NUMBER CONFLICTS")
                    continue

                section_order.append({"sec_name": "", "section_id": cur_sec})
                fetch_more = True

                last_sec = int(cur_sec)
                last_page_num = cur_page_num
            else:
                if fetch_more:
                    if cur_rect is None:
                        cur_rect = fitz.Rect(item["location"])
                    else:
                        cur_rect.include_rect(fitz.Rect(item["location"]))
                    section_order[-1]["sec_name"] = item_content.lower()
                    fetch_more = False

        if cur_rect is not None:
            if section_order[-1]["section_id"] == cur_sec:
                section_order[-1].update(
                    {
                        "page_num": cur_page_num,
                        "location": fitz.Rect(cur_rect),
                    }
                )

        # logger.debug(f"SECTION TITLE INFO: {section_title_info}")
        logger.debug(f"SECTION ORDER: {section_order}")

        return section_order, []

    def _split_sections(self, section_order, line_texts=[]):
        cur_section_index = 0
        next_section_index = cur_section_index + 1

        segmented_info = {}

        for page_num, page in enumerate(self.doc):
            page_text = self.page_texts[page_num]
            if "blocks" not in page_text:
                continue

            for block in page_text["blocks"]:
                if block["type"] == 1:
                    continue
                for line in block["lines"]:
                    succ, line_text = self._get_line_text(line)
                    if not line_text.endswith("\n"):
                        line_text += "\n"
                    line_rect = fitz.Rect(line["bbox"])

                    if (
                        next_section_index < len(section_order)
                        and page_num == section_order[next_section_index]["page_num"]
                        and section_order[next_section_index]["location"]
                        and line_rect.intersects(
                            section_order[next_section_index]["location"]
                        )
                    ):
                        cur_section_index = next_section_index
                        next_section_index += 1

                        segmented_info[cur_section_index] = [
                            SegmentedLineInfo(
                                line_text,
                                page_num,
                                left=line_rect.x0,
                                top=line_rect.y0,
                                right=line_rect.x1,
                                bottom=line_rect.y1,
                            )
                        ]
                    else:
                        if cur_section_index in segmented_info:
                            segmented_info[cur_section_index].append(
                                SegmentedLineInfo(
                                    line_text,
                                    page_num,
                                    left=line_rect.x0,
                                    top=line_rect.y0,
                                    right=line_rect.x1,
                                    bottom=line_rect.y1,
                                )
                            )
                        else:
                            segmented_info[cur_section_index] = [
                                SegmentedLineInfo(
                                    line_text,
                                    page_num,
                                    left=line_rect.x0,
                                    top=line_rect.y0,
                                    right=line_rect.x1,
                                    bottom=line_rect.y1,
                                )
                            ]

        return section_order, segmented_info

    def _is_possible_section_title(self, line_content):
        if (
            len(line_content.split()) >= 7
            or not any(char.isupper() for char in line_content)
            or "\n" in line_content
        ):
            return -1, []

        flag = False
        # Heuristic checks for possible section titles
        if re.match(
            r"^[0-9]{1,2}(\. [A-Za-z]{3,}| [A-Za-z]{3,})", line_content
        ):  # "1. Introduction", "2. Methodology", etc.
            flag = True
        elif re.match(
            r"^[IVX]{1,4}(\. [A-Za-z]{3,}| [A-Za-z]{3,})", line_content
        ):  # "I. Introduction", "II. Background", etc.
            flag = True

        if flag:
            indexer = line_content.split()[0].strip()
            title_content = " ".join(line_content.split()[1:]).strip()
            if indexer[-1] == ".":
                indexer = indexer[:-1]

            if len(indexer) > 4 or len(title_content) <= 2:
                return -1, []

            title_list = [indexer, title_content]

            return 1, title_list

        return 0, [line_content]

    def contains_digit(self, s):
        return any(char.isdigit() for char in s)

    def contains_roman(self, s):
        return any(not char.isdigit() for char in s)

    def _formulate_meta(self, section_order=[]):
        metas = []
        for sec in section_order:
            layer1_doc = {
                "page_content": sec["sec_name"],
                "metadata": {
                    "type": VectorDBHierarchy.FirstLayer.value,
                },
            }

            metas.append(layer1_doc)

        return metas

    def _formulate_memory_block(
        self,
        page_num,
        cur_section_index,
        part_content,
        part_index,
        section_order=[],
        related_links=[],
        related_images=[],
        related_tables=[],
    ):
        if len(related_images) != 0:
            image_paths_str = "|".join(list(related_images))
        else:
            image_paths_str = ""

        if len(related_links) != 0:
            link_info_str = "|".join(list(related_links))
        else:
            link_info_str = ""

        if len(related_tables) != 0:
            table_paths_str = "|".join(list(related_tables))
        else:
            table_paths_str = ""

        metadata = {
            "type": VectorDBHierarchy.SecondLayer.value,
            "source": self.blob.source,  # type: ignore[attr-defined]
            "file_path": self.blob.source,  # type: ignore[attr-defined]
            "page_index": page_num,
            "part_index": part_index,
            "section": (
                -1
                if not section_order
                else section_order[cur_section_index]["section_id"]
            ),
            "sec_name": (
                ""
                if not section_order
                else section_order[cur_section_index]["sec_name"]
            ),
            "image_paths": image_paths_str,
            "table_paths": table_paths_str,
            "link_info": link_info_str,
            "paper_len": len(self.pages),
        }

        metadata.update({"id": self._get_block_id_str(metadata)})

        # Filtering metadata to include only str and int types
        filtered_metadata = {
            k: v for k, v in metadata.items() if isinstance(v, (str, int))
        }

        document = {
            "page_content": part_content.replace("-\n", ""),
            "metadata": filtered_metadata,
        }

        return document

    # def lazy_extract_all(self) -> Iterable[Document]:
    #    """Extract text and images from each page and store images on disk lazily."""
    #    print(self.get_meta_data())
    #    return list(self.extract_text(get_rich_info=True))

    def extract_all(self) -> Iterable[Document]:
        return list(self.extract_text(get_rich_info=True, get_tables=False))

    def clear(self):
        self.doc.close()
