from typing import Iterable, Dict, Any, Optional, List
from memory.llm_memory import VectorDBHierarchy
from utils.timer import Timer
from extractor.pdf_content_index import PDFContentIndex

from langchain_core.documents import Document
from langchain_community.document_loaders import Blob
from langchain_community.document_loaders.pdf import BasePDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
import urllib.parse

from extractor.pdf_extractor import PDFExtractor, SegmentedLineInfo
from .pdf_extractor import CitationInfo

import fitz
import os
import re
import json
import logging
import pymupdf4llm
import markdown
from bs4 import BeautifulSoup

logger = logging.getLogger(__name__)


def make_rect(*args: Any) -> Optional[fitz.Rect]:
    rect = None
    try:
        rect = fitz.Rect(args[0])
    except ValueError:
        logger.error(f"{args}")
    return rect


class P4LPaperExtractor(PDFExtractor):
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

        self.image_caption_under_item = True
        self.table_caption_under_item = True

        self.section_ids = [str(i) for i in list(range(1, 15))]
        self.section_ids.extend([self.int_to_roman(i) for i in list(range(1, 15))])
        self.special_titles = ["abstract", "reference", "acknowledgements"]
        self.section_signal_unheaded = ["abstract", "acknowledgements"]

        self._define_re_templates()

        self.linked_contents = set()
        self.initialize_page_text = False

    def _define_re_templates(self):
        self.figure_template_str = [r"Figure \d+:", r"Fig. \d+:"]
        self.figure_templates = []
        for template in self.figure_template_str:
            self.figure_templates.append(re.compile(template, re.IGNORECASE))

        self.image_caption_checker = r"^Figure \d+:"
        self.image_caption_checker_template = re.compile(
            self.image_caption_checker, re.IGNORECASE
        )

        self.table_caption_checker = r"^Table \d+:"
        self.table_caption_checker_template = re.compile(
            self.table_caption_checker, re.IGNORECASE
        )

    def _load_pdf(self):
        self.md_text = pymupdf4llm.to_markdown(
            self.file_path, page_chunks=True, write_images=True
        )
        self.doc = [markdown.markdown(text["text"]) for text in self.md_text]
        self.soup = [BeautifulSoup(doc, "html.parser") for doc in self.doc]

        self.pure_md_text = ""
        for text in self.md_text:
            self.pure_md_text += text["text"]

        print(self.md_text)

        self.page_count = self.md_text[0].get("metadata", {}).get("page_count", -1)

    def _read_pages(self):
        return

    def compute_links(self):
        self._initialize()
        self.linked_contents = set()
        for page_num, page in enumerate(self.doc):
            self._extract_link(page, page_num)

    def get_meta_data(self):
        if len(self.md_text) > 0:
            meta = self.md_text[0].get("metadata", {})
        else:
            meta = {}
        if len(meta) != 0 and "title" in meta and len(meta["title"]) != 0:
            return meta

        title_pattern = re.compile(r"^(#{1,6})\s*(.+)", re.MULTILINE)
        titles = []

        for match in title_pattern.finditer(self.pure_md_text):
            level = len(match.group(1))
            title = match.group(2).strip()
            titles.append((level, title))

        if titles:
            main_title = min(titles, key=lambda x: x[0])
            meta["title"] = main_title[1]
            print(f"Found Title: {main_title[1]}")
        else:
            print("No titles found.")

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
        return table_info

    def _extract_images(self, page, page_num, page_text, image_info):
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
        page_num,
        line_content,
        tag,
        tag_name,
        last_tag_name,
        section_height_dict,
        content_list,
        last_index,
        standard_format,
    ):
        line_content_lower = line_content.lower()

        if not line_content:
            return False, last_index

        if line_content_lower in self.section_gt:
            if last_index:
                section_height_dict[tag_name] = (
                    section_height_dict.get(tag_name, 0) + 100
                )
                if not self.contains_digit(content_list[-1]["content"]):
                    standard_format["is_roman_index"] = True
                standard_format["tag_name"] = tag_name
            last_index = False
        elif line_content_lower in self.section_signal_unheaded:
            section_height_dict[tag_name] = section_height_dict.get(tag_name, 0) + 100
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
                            "tag": tag,
                            "tag_name": tag_name,
                            "page_num": page_num,
                        }
                    )
                if title_list[-1].lower() in self.section_gt:
                    section_height_dict[tag_name] = (
                        section_height_dict.get(tag_name, 0) + 100
                    )
                    if not self.contains_digit(title_list[0]):
                        standard_format["is_roman_index"] = True
                    standard_format["tag_name"] = tag_name
                else:
                    section_height_dict[tag_name] = (
                        section_height_dict.get(tag_name, 0) + 1
                    )
                last_index = False
                return True, last_index
            elif is_possible_title == 0:
                if last_index:
                    content_list.append(
                        {
                            "content": line_content.lower(),
                            "tag": tag,
                            "tag_name": tag_name,
                            "page_num": page_num,
                        }
                    )
                    section_height_dict[tag_name] = (
                        section_height_dict.get(tag_name, 0) + 1
                    )
                    last_index = False
                    return True, last_index
            elif last_tag_name is not None and last_tag_name == tag_name:
                content_list.append(
                    {
                        "content": line_content.lower(),
                        "tag": tag,
                        "tag_name": tag_name,
                        "page_num": page_num,
                    }
                )
                section_height_dict[tag_name] = section_height_dict.get(tag_name, 0) + 1
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
                "tag": tag,
                "tag_name": tag_name,
                "page_num": page_num,
            }
        )

        return True, last_index

    def _get_section_standard(self):
        section_height_dict = dict()
        content_list = []
        last_index = False
        standard_format = {"is_roman_index": False}

        last_tag_name = None
        succeed = False

        for page_num, soup in enumerate(self.soup):
            for tag in soup.find_all():
                if not list(tag.find_all(recursive=False)) and tag.name:
                    text_content = tag.get_text(strip=True)
                    tag_name = tag.name

                    if (
                        succeed
                        and last_tag_name is not None
                        and tag_name != last_tag_name
                    ):
                        succeed = False
                        last_tag_name = None
                        continue

                    words = text_content.split()
                    word_count = len(words)

                    if word_count >= 8:
                        succeed = False
                        last_tag_name = None
                        continue

                    succeed, last_index = self._check_possible_section_title(
                        page_num,
                        text_content,
                        tag,
                        tag_name,
                        last_tag_name,
                        section_height_dict,
                        content_list,
                        last_index,
                        standard_format,
                    )

                    # print(
                    #     f"tag: {tag}, \ntag_name: {tag_name}, \nsucceed: {succeed},\n last_tag_name: {last_tag_name}"
                    # )

                    if succeed:
                        last_tag_name = tag_name
                    else:
                        last_tag_name = None

        return standard_format, section_height_dict, content_list

    def _get_section_title_info(self):
        standard_format, section_height_dict, content_list = (
            self._get_section_standard()
        )

        logger.debug(f"STANDARD_FORMAT: {standard_format}")
        logger.debug(f"SECTION_HEIGHT_DICT: {section_height_dict}")

        # print(f"STANDARD_FORMAT: {standard_format}")
        # print(f"SECTION_HEIGHT_DICT: {section_height_dict}")
        # print(f"CONTENT_LIST: {content_list}")

        if len(section_height_dict) == 0:
            logger.info("Section Title Not Found !")
            return [{"sec_name": "all text", "section_id": "0", "tag": None}]

        section_order = [
            {"sec_name": "title and authors", "section_id": "paper_meta", "tag": None}
        ]

        cur_sec = -1
        cur_rect = None
        fetch_more = False
        get_title = False
        last_sec = -1
        record_sec = -1

        for item in content_list:
            if section_height_dict.get(item["tag_name"], 0) <= 2:
                continue
            item_content = item["content"]
            if item_content in self.special_titles:
                if fetch_more and not get_title:
                    section_order.pop()
                    last_sec = record_sec
                    fetch_more = False
                    get_title = False

                cur_sec = item_content
                cur_rect = item["tag"]

                section_order.append(
                    {
                        "sec_name": item_content.lower(),
                        "section_id": cur_sec,
                        "tag": item["tag"],
                        "page_num": item["page_num"],
                    }
                )
                fetch_more = False
                get_title = False
            elif item_content.upper() in self.section_ids:
                if fetch_more:
                    if not get_title:
                        section_order.pop()
                        last_sec = record_sec
                    fetch_more = False
                    get_title = False

                if standard_format["is_roman_index"] and self.contains_digit(
                    item_content
                ):
                    continue
                elif not standard_format["is_roman_index"] and self.contains_roman(
                    item_content
                ):
                    continue

                if (
                    standard_format["tag_name"]
                    and item["tag_name"] != standard_format["tag_name"]
                ):
                    continue

                cur_sec = self.roman_to_int(item_content)
                cur_rect = item["tag"]

                if int(cur_sec) <= last_sec:
                    logger.warn(f"SECTION NUMBER CONFLICTS")
                    continue

                section_order.append(
                    {
                        "sec_name": "",
                        "section_id": cur_sec,
                        "tag": item["tag"],
                        "page_num": item["page_num"],
                    }
                )
                fetch_more = True
                get_title = False

                record_sec = last_sec
                last_sec = int(cur_sec)
            else:
                if fetch_more:
                    if cur_rect is None:
                        cur_rect = item["tag"]
                        section_order[-1]["sec_name"] += item_content.lower()
                        get_title = True
                    else:
                        print(f"{cur_rect} v.s. {item['tag']}")
                        if (
                            cur_rect.find_next_sibling() == item["tag"]
                            or cur_rect is item["tag"]
                        ):
                            cur_rect = item["tag"]
                            if len(section_order[-1]["sec_name"]) == 0:
                                section_order[-1]["sec_name"] += item_content.lower()
                            else:
                                section_order[-1]["sec_name"] += (
                                    " " + item_content.lower()
                                )
                            get_title = True
                        else:
                            if not get_title:
                                section_order.pop()
                                last_sec = record_sec
                            fetch_more = False
                            get_title = False

        # logger.debug(f"SECTION TITLE INFO: {section_title_info}")
        logger.debug(f"SECTION ORDER: {section_order}")
        print(f"SECTION ORDER: {section_order}")

        return section_order

    def _split_sections(self, section_order):
        cur_section_index = 0
        next_section_index = cur_section_index + 1

        segmented_info = {}

        for page_num, soup in enumerate(self.soup):
            for tag in soup.find_all():
                if not list(tag.find_all(recursive=False)) and tag.name:
                    text = tag.get_text(strip=True)
                    if (
                        next_section_index < len(section_order)
                        and page_num == section_order[next_section_index]["page_num"]
                        and section_order[next_section_index]["tag"]
                        and tag is section_order[next_section_index]["tag"]
                    ):
                        cur_section_index = next_section_index
                        next_section_index += 1

                        segmented_info[cur_section_index] = [
                            SegmentedLineInfo(text, page_num, tag=tag)
                        ]
                    else:
                        if cur_section_index in segmented_info:
                            segmented_info[cur_section_index].append(
                                SegmentedLineInfo(text, page_num, tag=tag)
                            )
                        else:
                            segmented_info[cur_section_index] = [
                                SegmentedLineInfo(text, page_num, tag=tag)
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
            "source": "",  # type: ignore[attr-defined]
            "file_path": "",  # type: ignore[attr-defined]
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
            "paper_len": self.page_count,
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

    def link_and_build(self, section_order, segmented_info, get_rich_info, get_tables):
        section_order_index = 0
        cur_line_index = 0

        for page_num in range(self.page_count):
            while section_order_index < len(section_order):
                if section_order_index not in segmented_info:
                    break
                content_in_current_page = ""
                while cur_line_index < len(segmented_info[section_order_index]):
                    cur_line = segmented_info[section_order_index][cur_line_index]
                    if cur_line.get_page_num() == page_num:
                        content_in_current_page += cur_line.get_text()
                        cur_line_index += 1
                    else:
                        break

                part_texts = self.text_splitter.split_text(content_in_current_page)
                for part_index, part_content in enumerate(part_texts):
                    # related_links = []
                    # related_images = []
                    # related_tables = []

                    document = self._formulate_memory_block(
                        page_num,
                        section_order_index,
                        part_content,
                        part_index,
                        section_order,
                    )

                    # print("================= DOCUMENT ===================")
                    # print(document)
                    yield document

                if cur_line_index == len(segmented_info[section_order_index]):
                    section_order_index += 1
                    cur_line_index = 0
                else:
                    break

    def extract_all(self) -> Iterable[Document]:
        print(self.get_meta_data())
        return list(self.extract_text(get_rich_info=True, get_tables=False))

    def cleanup(self):
        self.doc.close()
