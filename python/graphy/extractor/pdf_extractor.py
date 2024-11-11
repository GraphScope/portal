from typing import Iterable, Dict, Any, Optional, List
from memory.llm_memory import VectorDBHierarchy
from utils.timer import Timer
from extractor.pdf_content_index import RectangleInfo, PDFRectangle, PDFContentIndex

from langchain_core.documents import Document
from langchain_community.document_loaders import Blob
from langchain_community.document_loaders.pdf import BasePDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter


import fitz
import os
import re
import json
import logging
import math
import concurrent.futures

logger = logging.getLogger(__name__)


def make_rect(*args: Any) -> Optional[fitz.Rect]:
    rect = None
    try:
        rect = fitz.Rect(args[0])
    except ValueError:
        logger.error(f"{args}")
    return rect


class SegmentedLineInfo:
    def __init__(
        self,
        line_text,
        page_num,
        left=-1,
        top=-1,
        right=-1,
        itemize=False,
        left_inside=-1,
        bottom=-1,
    ) -> None:
        self.text = line_text
        self.left = left
        self.right = right
        self.top = top
        self.bottom = bottom
        self.page_num = page_num
        self.itemize = itemize
        self.left_inside = left_inside

    def get_attr(self, attribute_name):
        return getattr(self, attribute_name, None)

    def set_attr(self, attribute_name, value):
        return setattr(self, attribute_name, value)

    def get_text(self):
        return self.text

    def get_page_num(self):
        return self.page_num

    def set_text(self, text):
        self.text = text

    def update(self, attr: Dict):
        for key, value in attr.items():
            self.set_attr(key, value)


class PDFExtractor(BasePDFLoader):
    def __init__(
        self,
        file_path: str,
        section_gt_paths: List[str] = [],
        block_id_str: List[str] = [],
        chunk_size=500,
        chunk_overlap=0,
        # chunk_overlap=50,
    ):
        super().__init__(file_path)
        logger.info(f"Extract pdf file: {file_path}")

        if self.web_path:
            self.blob = Blob.from_data(open(self.file_path, "rb").read(), path=self.web_path)  # type: ignore[attr-defined]
        else:
            self.blob = Blob.from_path(self.file_path)

        self._load_pdf()

        # with concurrent.futures.ThreadPoolExecutor() as executor:
        #     future = executor.submit(self._load_pdf)
        # try:
        #     future.result(timeout=60)
        # except concurrent.futures.TimeoutError:
        #     raise ValueError(
        #         "The function call took longer than 60 seconds and was terminated."
        #     )

        if len(section_gt_paths) > 0:
            self.section_gt = self._read_file_gt(section_gt_paths)
        else:
            self.section_gt = []

        self.pages = dict()
        self.page_texts = dict()

        for page_num, page in enumerate(self.doc):
            if page_num == 0:
                self.pages[page_num] = page
                self.page_texts[page_num] = page.get_text("dict")

        if len(self.pages) == 0:
            raise ValueError(f"Loaded PDF has 0 pages")

        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            separators=["\n\n", "\n", ".", "!", "?"],  # Add more separators as needed
            length_function=len,
            is_separator_regex=False,
        )

        self.image_caption_under_item = True
        self.table_caption_under_item = False

        self._define_general_re_template()

        self._id_attribute = block_id_str

        self.initialize_page_text = False

    def _initialize(self):
        if not self.initialize_page_text:
            for page_num, page in enumerate(self.doc):
                if page_num != 0:
                    self.pages[page_num] = page
                    self.page_texts[page_num] = page.get_text("dict")
            self.initialize_page_text = True

            self.column_number = {}
            for page_num, page in enumerate(self.doc):
                self.column_number[page_num] = self._get_number_of_columns(
                    at_page=page_num
                )
            self.language = self._get_language_of_pdf()

            logger.info(f"COLUMN_NUMBER: {self.column_number}")
            logger.info(f"LANGUAGE: {self.language}")

            self.timer = Timer()
            self.pdf_content_index = PDFContentIndex()
            self.timer.start("build rtree index")
            self.max_page_height = self._get_maximal_page_height()
            self._build_pdf_index()
            self.timer.stop("build rtree index")

    def _load_pdf(self):
        if self.blob.data is None:  # type: ignore[attr-defined]
            self.doc = fitz.open(self.file_path)
        else:
            self.doc = fitz.open(stream=self.file_path, filetype="pdf")

    def _get_maximal_page_height(self):
        max_page_height = -1
        for page_num, page in enumerate(self.doc):
            max_page_height = max(max_page_height, page.rect.height)
        return max_page_height

    def _build_pdf_index(self):
        max_page_height = self._get_maximal_page_height()
        counter_id = 0
        for page_num, page in enumerate(self.doc):
            page_text = self.page_texts[page_num]

            for block in page_text["blocks"]:
                if block["type"] == 1 or "lines" not in block:
                    continue
                for line in block["lines"]:
                    if "spans" not in line:
                        continue
                    for span in line["spans"]:
                        succ, span_text = self._get_span_text(span)
                        if not succ:
                            continue
                        if "bbox" in span:
                            counter_id += 1
                            span_bbox = fitz.Rect(span["bbox"])
                            span_rect = PDFRectangle(
                                counter_id,
                                span_bbox.x0,
                                span_bbox.y0 + max_page_height * page_num,
                                span_bbox.x1,
                                span_bbox.y1 + max_page_height * page_num,
                                RectangleInfo(span_text),
                            )
                            self.pdf_content_index.add_rectangle(span_rect)
                            # if counter_id >= 2800 and counter_id <= 2840:
                            #     print("=========== RTREE ===========")
                            #     print(span_rect.bounds(), span_text)

    def _shrink_rect(self, rect, d):
        if d[0] < 0 or d[1] < 0:
            refined_rect = rect - d
        else:
            refined_rect = rect + d
        if refined_rect.x0 >= refined_rect.x1 or refined_rect.y0 >= refined_rect.y1:
            return rect
        else:
            return refined_rect

    def _define_general_re_template(self):
        self.single_number = "^\d+(\.\d+)?$"
        self.single_number_template = re.compile(self.single_number, re.IGNORECASE)

    def set_img_path(self, img_path: str):
        self.img_path = img_path
        os.makedirs(img_path, exist_ok=True)

    def get_meta_data(self):
        pass

    def _get_span_text(self, span) -> str:
        if "text" not in span:
            return False, ""

        return True, span["text"]

    def _get_line_text(self, line) -> str:
        if "spans" not in line:
            return False, ""

        line_text = ""
        for span in line["spans"]:
            succ, get_text = self._get_span_text(span)
            if succ:
                line_text += get_text

        return True, line_text

    def _read_file_gt(self, file_paths: List[str]):
        gt_file_list = []
        for file_path in file_paths:
            with open(file_path, "r") as f:
                lines = f.readlines()
                for line in lines:
                    gt_file_list.append(line.strip())

        return gt_file_list

    def _is_possible_section_title(self, line_text):
        pass

    def _define_re_templates(self):
        pass

    def _get_language_of_pdf(self, at_page=-1):
        if at_page == -1:
            page_list = [min(1, len(self.pages) - 1)]
            # page_list = [0, 1, ..., len(self.pages) - 1]
        else:
            page_list = [at_page]

        num_of_chn = 0
        num_of_en = 0

        for page_number in page_list:
            page_text = self.page_texts[page_number]
            if "blocks" not in page_text:
                continue
            for block in page_text["blocks"]:
                if block["type"] == 1 or "lines" not in block:
                    continue
                for line in block["lines"]:
                    if "spans" not in line:
                        continue
                    for span in line["spans"]:
                        succ, span_text = self._get_span_text(span)
                        if not succ:
                            continue
                        for char in span_text:
                            if "\u4e00" <= char <= "\u9fff":  # is chn
                                num_of_chn += 1
                                if num_of_chn >= 20:
                                    return "chn"
                            elif char.isalpha() and char.isascii():
                                num_of_en += 1

        if num_of_en + num_of_chn != 0 and num_of_chn / (num_of_chn + num_of_en) >= 0.3:
            return "chn"
        else:
            return "en"

    def _get_number_of_columns(self, at_page=-1):
        if at_page == -1:
            page_list = [min(2, len(self.pages) - 1)]
            # page_list = [0, 1, ..., len(self.pages) - 1]
        else:
            page_list = [at_page]

        vote2 = 0
        vote1 = 0
        for page_number in page_list:
            page_text = self.page_texts[page_number]
            if "blocks" not in page_text:
                continue
            for block in page_text["blocks"]:
                if block["type"] == 1 or "bbox" not in block:
                    continue
                block_width = block["bbox"][2] - block["bbox"][0]
                cur_num_of_cols = self.pages[page_number].rect.width / block_width
                if cur_num_of_cols > 3 or cur_num_of_cols < 1:
                    continue
                if cur_num_of_cols >= 2:
                    vote2 += 1
                else:
                    vote1 += 1

        if vote2 >= vote1:
            return 2
        else:
            return 1

    def _get_section_standard(self):
        pass

    def _get_section_title_info(self):
        pass

    def _split_sections(self, section_order, line_texts=[]):
        pass

    def _formulate_meta(self, section_order=[]):
        pass

    def _get_block_id_str(self, attr_dict: Dict):
        block_id = ""
        for attr in self._id_attribute:
            if attr not in attr_dict:
                continue
            block_id = block_id + "_" + str(attr) + str(attr_dict[attr])

        return block_id

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
        pass

    def _extract_tables(self, page, page_num, table_info, image_info):
        pass

    def _extract_images(self, page, page_num, page_text, image_info):
        pass

    def _extract_link(self, page, page_num):
        pass

    def _get_line_with_point(self, page, page_num, point):
        offset = (-3, -3, 3, 3)
        page_text = self.page_texts[page_num]
        # page_text = page.get_text("dict")
        for block in page_text["blocks"]:
            if block["type"] == 1:
                continue
            rb = fitz.Rect(block["bbox"]) + offset
            if not rb.contains(point):
                continue
            for line in block["lines"]:
                r = fitz.Rect(line["bbox"]) + offset
                if r.contains(fitz.Point(point)):
                    return line

    # link_info: dest_text => CitationInfo
    # image_rects: image_file_name => (image_page, image_rect)
    # past_lines: record the already processed texts
    def _connect_link_to_text_and_image_and_table(
        self,
        page,
        page_num,
        text,
        textpage,
        link_info,
        image_info,
        table_info,
        past_lines,
    ):
        # split the part of text into lines
        lines = text.replace("-\n", "\n").split("\n")

        # search for each line of text and get the corrsponding rectangle
        related_links = set()
        related_image_captions = set()
        related_table_captions = set()
        related_images = set()
        related_tables = set()

        for line in lines:
            if not self.single_number_template.match(line.strip()):
                text_rects = page.search_for(line, textpage=textpage)
                order_n = past_lines.count(line)

                if text_rects and len(text_rects) > order_n:
                    text_rect = text_rects[order_n]
                    text_point = fitz.Point(
                        (text_rect.x0 + text_rect.x1) / 2,
                        (text_rect.y0 + text_rect.y1) / 2,
                    )

                    text_line = self._get_line_with_point(page, page_num, text_point)
                    text_rect = fitz.Rect(text_line["bbox"])

                    # for text_rect in text_rects:
                    for link_text in link_info:
                        if (
                            not link_info[link_text].is_figure
                            and not link_info[link_text].is_table
                            and link_text not in related_links
                        ):
                            for link_rect in link_info[link_text].from_rect:
                                if text_rect.intersects(link_rect):
                                    related_links.add(link_text)
                                    break
                        elif link_info[link_text].is_figure:
                            for link_rect in link_info[link_text].from_rect:
                                if text_rect.intersects(link_rect):
                                    related_image_captions.add(
                                        (
                                            link_info[link_text].to_page_num,
                                            link_info[link_text].to_point,
                                        )
                                    )
                                    break
                        elif link_info[link_text].is_table:
                            for link_rect in link_info[link_text].from_rect:
                                if text_rect.intersects(link_rect):
                                    related_table_captions.add(
                                        (
                                            link_info[link_text].to_page_num,
                                            link_info[link_text].to_point,
                                        )
                                    )
            past_lines += line

        for caption_page_num, point in related_image_captions:
            img_maxy = -1
            nearest_imgs = set()
            closest_img = None
            closest_dist = -1

            if caption_page_num in image_info:
                for img_path in image_info[caption_page_num]:
                    img_rect = image_info[caption_page_num][img_path]
                    if self.image_caption_under_item and img_rect.y1 < point.y:
                        if img_maxy == -1 or img_rect.y1 > img_maxy:
                            nearest_imgs = set([img_path])
                            img_maxy = img_rect.y1
                        elif img_rect.y1 == img_maxy:
                            nearest_imgs.add(img_path)
                    elif not self.image_caption_under_item and img_rect.y1 > point.y:
                        if img_maxy == -1 or img_rect.y1 < img_maxy:
                            nearest_imgs = set([img_path])
                            img_maxy = img_rect.y1
                        elif img_rect.y1 == img_maxy:
                            nearest_imgs.add(img_path)
                    if self.image_caption_under_item:
                        if (
                            closest_dist == -1
                            or abs(img_rect.y1 - point.y) < closest_dist
                        ):
                            closest_img = img_path
                            closest_dist = abs(img_rect.y1 - point.y)
                    else:
                        if (
                            closest_dist == -1
                            or abs(img_rect.y0 - point.y) < closest_dist
                        ):
                            closest_img = img_path
                            closest_dist = abs(img_rect.y0 - point.y)

                if len(nearest_imgs) > 0:
                    related_images = related_images.union(nearest_imgs)
                elif closest_dist != -1:
                    related_images.add(closest_img)

        for caption_page_num, point in related_table_captions:
            table_maxy = -1
            nearest_tables = set()
            closest_table = None
            closest_dist = -1

            if caption_page_num in table_info:
                for table_path in table_info[caption_page_num]:
                    table_rect = table_info[caption_page_num][table_path]
                    if self.table_caption_under_item and table_rect.y1 < point.y:
                        if table_maxy == -1 or table_rect.y1 > table_maxy:
                            nearest_tables = set([table_path])
                            table_maxy = table_rect.y1
                        elif table_rect.y1 == table_maxy:
                            nearest_tables.add(table_path)
                    elif not self.table_caption_under_item and table_rect.y1 > point.y:
                        if table_maxy == -1 or table_rect.y1 < table_maxy:
                            nearest_tables = set([table_path])
                            table_maxy = table_rect.y1
                        elif table_rect.y1 == table_maxy:
                            nearest_tables.add(table_path)
                    if self.table_caption_under_item:
                        if (
                            closest_dist == -1
                            or abs(table_rect.y1 - point.y) < closest_dist
                        ):
                            closest_table = table_path
                            closest_dist = abs(table_rect.y1 - point.y)
                    else:
                        if (
                            closest_dist == -1
                            or abs(table_rect.y0 - point.y) < closest_dist
                        ):
                            closest_table = table_path
                            closest_dist = abs(table_rect.y0 - point.y)

                if len(nearest_tables) > 0:
                    related_tables = related_tables.union(nearest_tables)
                elif closest_dist != -1:
                    related_tables.add(closest_table)

        return (related_links, related_images, related_tables, past_lines)

    def _connect_all(
        self,
        text,
        segmented_info,
        related_links_all,
        related_images_all,
        related_tables_all,
        section_order_index,
        first_line_index,
        start_line_index,
        end_line_index,
    ):
        related_links = set()
        related_images = set()
        related_tables = set()

        lines = text.replace("-\n", "\n").split("\n")
        line_index_record = start_line_index
        for cur_line_index in range(start_line_index, end_line_index):
            line_index_record = cur_line_index
            valid = True
            for i in range(len(lines)):
                cur_line = segmented_info[section_order_index][cur_line_index + i]
                if lines[i] not in cur_line.get_text():
                    valid = False
                    break
            if not valid:
                continue
            else:
                for j in range(len(lines)):
                    related_links = related_links.union(
                        related_links_all[j + cur_line_index - first_line_index]
                    )
                    related_images = related_images.union(
                        related_images_all[j + cur_line_index - first_line_index]
                    )
                    related_tables = related_tables.union(
                        related_tables_all[j + cur_line_index - first_line_index]
                    )
                break

        # print(cur_line_index, first_line_index, len(lines), related_links_all)
        # print("======== TEXT ============")
        # print(text)
        # print("******** LINK ***********")
        # print(related_links)
        # print("******** IMAGE ***********")
        # print(related_images)
        # print("******** TABLE ***********")
        # print(related_tables)
        # print("LINE INDEX RECORD")
        # print(line_index_record)
        return related_links, related_images, related_tables, line_index_record

    def _connect_links(
        self,
        text,
        segmented_info,
        related_links_all,
        section_order_index,
        first_line_index,
        start_line_index,
        end_line_index,
    ):
        related_links = set()

        lines = text.replace("-\n", "\n").split("\n")
        line_index_record = start_line_index
        for cur_line_index in range(start_line_index, end_line_index):
            line_index_record = cur_line_index
            valid = True
            for i in range(len(lines)):
                cur_line = segmented_info[section_order_index][cur_line_index + i]
                if lines[i] not in cur_line.get_text():
                    valid = False
                    break
            if not valid:
                continue
            else:
                for j in range(len(lines)):
                    related_links = related_links.union(
                        related_links_all[j + cur_line_index - first_line_index]
                    )
                break

        return related_links, line_index_record

    def _connect_link_to_line(
        self,
        segmented_info,
        link_info,
        image_info,
        table_info,
        section_order_index,
        start_line_index,
        end_line_index,
    ):
        related_links_all = []
        related_images_all = []
        related_tables_all = []

        for cur_line_index in range(start_line_index, end_line_index):
            related_links = set()
            related_images = set()
            related_tables = set()
            related_image_captions = set()
            related_table_captions = set()

            cur_line = segmented_info[section_order_index][cur_line_index]
            text_rect = fitz.Rect(
                cur_line.left, cur_line.top, cur_line.right, cur_line.bottom
            )
            text_rect = self._shrink_rect(text_rect, (0, 1, 0, -1))

            for link_text in link_info:
                if (
                    not link_info[link_text].is_figure
                    and not link_info[link_text].is_table
                    and link_text not in related_links
                ):
                    for link_rect in link_info[link_text].from_rect:
                        if text_rect.intersects(link_rect):
                            related_links.add(link_text)
                            break
                elif link_info[link_text].is_figure:
                    for link_rect in link_info[link_text].from_rect:
                        if text_rect.intersects(link_rect):
                            related_image_captions.add(
                                (
                                    link_info[link_text].to_page_num,
                                    link_info[link_text].to_point,
                                )
                            )
                            break
                elif link_info[link_text].is_table:
                    for link_rect in link_info[link_text].from_rect:
                        if text_rect.intersects(link_rect):
                            related_table_captions.add(
                                (
                                    link_info[link_text].to_page_num,
                                    link_info[link_text].to_point,
                                )
                            )
                            break

            for caption_page_num, point in related_image_captions:
                img_maxy = -1
                nearest_imgs = set()
                closest_img = None
                closest_dist = -1

                if caption_page_num in image_info:
                    for img_path in image_info[caption_page_num]:
                        img_rect = image_info[caption_page_num][img_path]
                        if self.image_caption_under_item and img_rect.y1 < point.y:
                            if img_maxy == -1 or img_rect.y1 > img_maxy:
                                nearest_imgs = set([img_path])
                                img_maxy = img_rect.y1
                            elif img_rect.y1 == img_maxy:
                                nearest_imgs.add(img_path)
                        elif (
                            not self.image_caption_under_item and img_rect.y1 > point.y
                        ):
                            if img_maxy == -1 or img_rect.y1 < img_maxy:
                                nearest_imgs = set([img_path])
                                img_maxy = img_rect.y1
                            elif img_rect.y1 == img_maxy:
                                nearest_imgs.add(img_path)
                        if self.image_caption_under_item:
                            if (
                                closest_dist == -1
                                or abs(img_rect.y1 - point.y) < closest_dist
                            ):
                                closest_img = img_path
                                closest_dist = abs(img_rect.y1 - point.y)
                        else:
                            if (
                                closest_dist == -1
                                or abs(img_rect.y0 - point.y) < closest_dist
                            ):
                                closest_img = img_path
                                closest_dist = abs(img_rect.y0 - point.y)

                    if len(nearest_imgs) > 0:
                        related_images = related_images.union(nearest_imgs)
                    elif closest_dist != -1:
                        related_images.add(closest_img)

            for caption_page_num, point in related_table_captions:
                table_maxy = -1
                nearest_tables = set()
                closest_table = None
                closest_dist = -1

                if caption_page_num in table_info:
                    for table_path in table_info[caption_page_num]:
                        table_rect = table_info[caption_page_num][table_path]
                        if self.table_caption_under_item and table_rect.y1 < point.y:
                            if table_maxy == -1 or table_rect.y1 > table_maxy:
                                nearest_tables = set([table_path])
                                table_maxy = table_rect.y1
                            elif table_rect.y1 == table_maxy:
                                nearest_tables.add(table_path)
                        elif (
                            not self.table_caption_under_item
                            and table_rect.y1 > point.y
                        ):
                            if table_maxy == -1 or table_rect.y1 < table_maxy:
                                nearest_tables = set([table_path])
                                table_maxy = table_rect.y1
                            elif table_rect.y1 == table_maxy:
                                nearest_tables.add(table_path)
                        if self.table_caption_under_item:
                            if (
                                closest_dist == -1
                                or abs(table_rect.y1 - point.y) < closest_dist
                            ):
                                closest_table = table_path
                                closest_dist = abs(table_rect.y1 - point.y)
                        else:
                            if (
                                closest_dist == -1
                                or abs(table_rect.y0 - point.y) < closest_dist
                            ):
                                closest_table = table_path
                                closest_dist = abs(table_rect.y0 - point.y)

                    if len(nearest_tables) > 0:
                        related_tables = related_tables.union(nearest_tables)
                    elif closest_dist != -1:
                        related_tables.add(closest_table)

            # print("======== TEXT ============")
            # print(cur_line.get_text())
            # print("******** LINK ***********")
            # print(related_links)
            # print("******** IMAGE ***********")
            # print(related_images)
            # print("******** TABLE ***********")
            # print(related_tables)
            related_links_all.append(related_links)
            related_images_all.append(related_images)
            related_tables_all.append(related_tables)

        return related_links_all, related_images_all, related_tables_all

    def _process_page(
        self,
        page,
        page_num,
        section_order,
        segmented_info,
        get_rich_info,
        image_info,
        table_info,
        index_list,
    ):
        # self.timer.start("deal with page " + str(page_num))
        # logger.info("start page " + str(page_num))
        textpage = page.get_textpage()
        # self.timer.start("extract link in page " + str(page_num))
        link_info = self._extract_link(page, page_num)

        # print("******* LINK INFO *********")
        # print(link_info)
        # self.timer.stop("extract link in page " + str(page_num))
        section_order_index = index_list[0]
        cur_line_index = index_list[1]

        first_line_index = -1
        # if page_num == 3:
        # print("************ LINK INFO *************")
        # for key, value in link_info.items():
        #    if "2" in value.from_content[0]:
        #        print(key, value)
        past_lines = ""
        self.timer.start("extract link in page " + str(page_num))
        while section_order_index < len(section_order):
            if section_order_index not in segmented_info:
                break
            content_in_current_page = ""
            while cur_line_index < len(segmented_info[section_order_index]):
                cur_line = segmented_info[section_order_index][cur_line_index]
                if cur_line.get_page_num() == page_num:
                    if first_line_index == -1:
                        first_line_index = cur_line_index
                    content_in_current_page += cur_line.get_text()
                    cur_line_index += 1
                else:
                    break

            part_texts = self.text_splitter.split_text(content_in_current_page)
            related_links_line, related_images_line, related_tables_line = (
                self._connect_link_to_line(
                    segmented_info,
                    link_info,
                    image_info,
                    table_info,
                    section_order_index,
                    first_line_index,
                    cur_line_index,
                )
            )

            start_line_index = first_line_index

            for part_index, part_content in enumerate(part_texts):
                # related_links = []
                # related_images = []
                # related_tables = []
                if link_info is None:
                    document = self._formulate_memory_block(
                        page_num,
                        section_order_index,
                        part_content,
                        part_index,
                        section_order,
                    )
                elif get_rich_info and link_info is not None:
                    related_links, related_images, related_tables, start_line_index = (
                        self._connect_all(
                            part_content,
                            segmented_info,
                            related_links_line,
                            related_images_line,
                            related_tables_line,
                            section_order_index,
                            first_line_index,
                            start_line_index,
                            cur_line_index,
                        )
                    )

                    document = self._formulate_memory_block(
                        page_num,
                        section_order_index,
                        part_content,
                        part_index,
                        section_order,
                        related_links,
                        related_images,
                        related_tables,
                    )
                else:
                    related_links, start_line_index = self._connect_links(
                        part_content,
                        segmented_info,
                        related_links_line,
                        section_order_index,
                        first_line_index,
                        start_line_index,
                        cur_line_index,
                    )

                    document = self._formulate_memory_block(
                        page_num,
                        section_order_index,
                        part_content,
                        part_index,
                        section_order,
                        related_links,
                    )

                # print("================= DOCUMENT ===================")
                # print(document)
                yield document

            if cur_line_index == len(segmented_info[section_order_index]):
                section_order_index += 1
                cur_line_index = 0
            else:
                break

        self.timer.stop("extract link in page " + str(page_num))

        # print("finish page " + str(page_num))
        # self.timer.stop("deal with page " + str(page_num))

        index_list[0] = section_order_index
        index_list[1] = cur_line_index

    def extract_text(self, get_rich_info=False, get_tables=False):
        if not self.initialize_page_text:
            self._initialize()
        # print("############# START EXTRACT ###############")
        self.timer.start("extract text")
        self.timer.start("get section title info")
        section_order, line_texts = self._get_section_title_info()
        self.timer.stop("get section title info")

        self.timer.start("split sections")
        section_order, segmented_info = self._split_sections(section_order, line_texts)
        self.timer.stop("split sections")

        for meta_block in self._formulate_meta(section_order):
            yield meta_block

        image_info = dict()
        table_info = dict()

        if get_rich_info:
            self.timer.start("extract images and table")
            for page_num, page in enumerate(self.doc):
                page_text = self.page_texts[page_num]
                image_info = self._extract_images(page, page_num, page_text, image_info)
                if get_tables:
                    table_info = self._extract_tables(
                        page, page_num, table_info, image_info
                    )
            self.timer.stop("extract images and table")

        # print("########### IMAGE_INFO #######")
        # print(table_info)
        ########### IMAGE_INFO #######
        # {3: {'img_store/page3_pos1.png': Rect(53.798004150390625, 86.25930786132812, 558.7017211914062, 243.87918090820312)}, 9: {'img_store/page9_pos1.png': Rect(317.62298583984375, 84.25891876220703, 559.717529296875, 709.7498779296875)}}

        index_list = [0, 0]

        self.timer.start("extract link")
        for page_num, page in enumerate(self.doc):
            for document in self._process_page(
                page,
                page_num,
                section_order,
                segmented_info,
                get_rich_info,
                image_info,
                table_info,
                index_list,
            ):
                yield document

        self.timer.stop("extract link")
        self.timer.stop("extract text")
        self.timer.print()

        # print("############# FINISH EXTRACT ###############")
