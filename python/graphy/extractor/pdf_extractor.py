from typing import Iterable, Dict, Any, Optional, List
from utils.timer import Timer
from extractor.pdf_content_index import RectangleInfo, PDFRectangle

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


class SegmentedLineInfo:
    def __init__(
        self,
        line_text,
        page_num=-1,
        left=-1,
        top=-1,
        right=-1,
        itemize=False,
        left_inside=-1,
        bottom=-1,
        tag=None,
    ) -> None:
        self.text = line_text
        self.left = left
        self.right = right
        self.top = top
        self.bottom = bottom
        self.page_num = page_num
        self.itemize = itemize
        self.left_inside = left_inside
        self.tag = tag

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

        self._read_pages()

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
        self.timer = Timer()

    def _load_pdf(self):
        pass

    def _read_pages(self):
        pass

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
        self.single_number = r"^\d+(\.\d+)?$"
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

    def _split_sections(self, section_order):
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

    def link_and_build(self, section_order, segmented_info, get_rich_info, get_tables):
        pass

    def extract_text(self, get_rich_info=False, get_tables=False):
        # print("############# START EXTRACT ###############")
        self.timer.start("extract text")
        self.timer.start("get section title info")
        section_order = self._get_section_title_info()
        self.timer.stop("get section title info")

        self.timer.start("split sections")
        section_order, segmented_info = self._split_sections(section_order)
        self.timer.stop("split sections")

        for meta_block in self._formulate_meta(section_order):
            yield meta_block

        # print("########### IMAGE_INFO #######")
        # print(table_info)
        ########### IMAGE_INFO #######
        # {3: {'img_store/page3_pos1.png': Rect(53.798004150390625, 86.25930786132812, 558.7017211914062, 243.87918090820312)}, 9: {'img_store/page9_pos1.png': Rect(317.62298583984375, 84.25891876220703, 559.717529296875, 709.7498779296875)}}

        self.timer.start("extract link")
        for document in self.link_and_build(
            section_order, segmented_info, get_rich_info, get_tables
        ):
            yield document

        self.timer.stop("extract link")
        self.timer.stop("extract text")
        self.timer.print()

        # print("############# FINISH EXTRACT ###############")
