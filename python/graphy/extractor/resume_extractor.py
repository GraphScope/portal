from typing import Iterable, Dict, Any, Optional, List
from memory.llm_memory import VectorDBHierarchy

from langchain_core.documents import Document
from langchain_community.document_loaders import Blob
from langchain_community.document_loaders.pdf import BasePDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from .pdf_extractor import PDFExtractor, SegmentedLineInfo


import fitz
import os
import re
import json
import logging
import copy
import spacy
from spacy.matcher import Matcher
from datetime import datetime

logger = logging.getLogger(__name__)


class TextCleaning(object):
    def __init__(self):
        self.key_value_pair_regex = r"^.+[:：]"
        self.key_value_pair_template = re.compile(
            self.key_value_pair_regex, re.IGNORECASE
        )

        self.ending_regex = r"[.。;]$"
        self.ending_template = re.compile(self.ending_regex, re.IGNORECASE)

    def Trim(self, line: SegmentedLineInfo):
        line.set_attr("text", " ".join(re.split(r" +", line.get_attr("text"))))
        return line

    def Merge(self, line: SegmentedLineInfo, output_text: str):
        line_text = line.get_attr("text")
        if len(line_text) == 0:
            return line, output_text

        if line_text[0] == ",":
            if len(output_text) > 0 and output_text[-1] == "\n":
                output_text = output_text[:-1]

        if (
            line_text[-1] == "\n"
            and len(line_text) >= 2
            and (line_text[-2] == "," or line_text[-2] == "，")
        ):
            line.set("text", line.get("text")[:-1])

        return line, output_text

    def MergeItem(self, text_list: List[SegmentedLineInfo]):
        new_text_list = []
        in_itemize_part = False
        skip_size = -1
        cur_text = ""
        for i in range(len(text_list)):
            line_text = text_list[i].get_attr("text")
            is_itemize = text_list[i].get_attr("itemize")
            left_inside = text_list[i].get_attr("left-inside")
            if is_itemize:
                if in_itemize_part:
                    new_text_list.append(
                        {
                            "text": cur_text,
                        }
                    )
                    cur_text = line_text
                    skip_size = left_inside
                else:
                    cur_text = line_text
                    skip_size = left_inside
                    in_itemize_part = True
            else:
                if in_itemize_part and skip_size <= left_inside:
                    if cur_text[-1] == "\n":
                        cur_text = cur_text[:-1]
                    cur_text += line_text
                else:
                    in_itemize_part = False
                    if len(cur_text) > 0:
                        new_text_list.append(
                            SegmentedLineInfo(line_text=cur_text, page_num=-1)
                        )
                        cur_text = ""
                    new_text_list.append(
                        SegmentedLineInfo(line_text=line_text, page_num=-1)
                    )

        if len(cur_text) > 0:
            new_text_list.append(SegmentedLineInfo(line_text=cur_text, page_num=-1))

        return new_text_list

    def Split(self, line: Dict, output_text: str):
        line_text = line.get_attr("text")
        if len(line_text) == 0:
            return line, output_text

        if len(output_text) > 0 and output_text[-1] != "\n":
            if self.key_value_pair_template.match(line_text):
                line.set_attr("text", "\n" + line.get_attr("text"))
            elif self.ending_template.match(output_text):
                line.set_attr("text", "\n" + line.get_attr("text"))

        return line, output_text

    def run(self, text_list: List[SegmentedLineInfo], caption=None):
        output_text = ""
        text_list = self.MergeItem(text_list)
        for line in text_list:
            line = self.Trim(line)
            line, output_text = self.Merge(line, output_text)
            line, output_text = self.Split(line, output_text)

            output_text += line.get_attr("text")

        return output_text


class ResumeExtractor(PDFExtractor):
    def __init__(
        self,
        file_path: str,
        gt_file_path: str,
        block_id_str: List[str] = ["page_index", "part_index", "section_name"],
        chunk_size=500,
        chunk_overlap=0,
        # chunk_overlap=50,
    ):
        self._define_re_templates()

        super().__init__(
            file_path,
            gt_file_path,
            block_id_str=block_id_str,
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
        )
        logger.info(f"Extract pdf file: {file_path}")

        self._itemize_start = ["+", "-", "*", "•", "➢", "◆"]

        self._educational_background = self._read_file_gt(
            ["gt_files/educational_background.txt"]
        )

        self._last_names = self._read_file_gt(["gt_files/last_name.txt"])

        self.maximal_line_width = -1
        self.first_page_text = self.pages[0].get_text()

    def _define_re_templates(self):
        self.unicode_checker_regex = r"^'\\u[0-9a-fA-F]{4}'$"
        self.unicode_checker_template = re.compile(
            self.unicode_checker_regex, re.IGNORECASE
        )

        self.emoji_checker_regex = (
            r"[\U0001F600-\U0001F64F"
            r"\U0001F300-\U0001F5FF"
            r"\U0001F680-\U0001F6FF"
            r"\U0001F700-\U0001F77F"
            r"\U0001F800-\U0001F8FF"
            r"\U0001F900-\U0001F9FF"
            r"\U0001FA00-\U0001FAFF"
            r"\u2600-\u26FF" + r"\U00002B50]+"  # 常见符号
        )
        self.emoji_checker_template = re.compile(
            self.emoji_checker_regex, re.IGNORECASE
        )

        self.chinese_punctuation_regex = r"[，。：]"
        self.chinese_punctuation_template = re.compile(
            self.chinese_punctuation_regex, re.IGNORECASE
        )

        self.english_punctuation_regex = r"[,:]"
        self.english_punctuation_template = re.compile(
            self.english_punctuation_regex, re.IGNORECASE
        )

        self.english_sentence_regex = r'^[A-Za-z0-9\s.,!?;"\'()-]*$'
        self.english_sentence_template = re.compile(
            self.english_sentence_regex, re.IGNORECASE
        )

    def _get_span_text(self, span) -> str:
        if (
            "text" not in span
            or self.unicode_checker_template.search(repr(span["text"]))
            or len(span["text"].strip()) == 0
        ):
            return False, ""

        if self.emoji_checker_template.search(span["text"]):
            after_text = self.emoji_checker_template.sub("", span["text"]).replace(
                "\u200B", ""
            )
            return True, after_text.strip()
        return True, span["text"]

    def _is_segment_title(self, line_text):
        return line_text.lower() in self.section_gt

    def _get_background_color(self, line, page):
        back_pix = page.get_pixmap(
            clip=fitz.Rect(
                line["bbox"][0],
                line["bbox"][1],
                line["bbox"][0] + 1,
                line["bbox"][1] + 1,
            )
        )
        try:
            top_color = back_pix.color_topusage()
        except:
            top_color = (0, 0)
        return top_color

    def _get_section_standard(self):
        standard_format = {}
        for page_num, page in enumerate(self.doc):
            page_text = page.get_text("dict")
            for block in page_text["blocks"]:
                if block["type"] == 1:
                    continue
                for line in block["lines"]:
                    line_text = ""
                    skip_unicode = 0
                    fix_skip = False
                    if "spans" in line:
                        for span in line["spans"]:
                            succ, get_text = self._get_span_text(span)
                            if succ:
                                line_text += get_text
                                fix_skip = True
                            else:
                                if not fix_skip:
                                    skip_unicode += 1
                    else:
                        continue

                    line_text = line_text.strip()
                    if self._is_segment_title(line_text):
                        standard_format = {
                            "size": line["spans"][skip_unicode]["size"],
                            "font": line["spans"][skip_unicode]["font"],
                            "color": line["spans"][skip_unicode]["color"],
                            "left-top-x": line["spans"][skip_unicode]["bbox"][0],
                            "background_color": self._get_background_color(line, page),
                        }
                        return standard_format
        standard_format = {
            "size": 0,
            "font": 0,
            "color": 0,
            "left-top-x": 0,
            "background_color": (0, 0),
        }

        return standard_format

    def _check_itemize(self, line, line_info, skip_unicode=0):
        if "spans" not in line or skip_unicode >= len(line["spans"]):
            line_info.update({"itemize": False, "left-inside": 0})
            return line_info
        span = line["spans"][skip_unicode]
        succ, span_text = self._get_span_text(span)
        if span_text and span_text[0] in self._itemize_start:
            line_info.update(
                {"itemize": True, "left-inside": span["bbox"][0] + span["size"]}
            )
            return line_info
        else:
            line_info.update({"itemize": False, "left-inside": span["bbox"][0]})
            return line_info

    def _steal_section_texts(self, seg_names, segmented_info):
        sorted_seg_names = sorted(seg_names, key=lambda x: x["sec_y"])
        new_segmented_info = copy.deepcopy(segmented_info)
        # print(sorted_seg_names)

        for seg_item in seg_names:
            sec_name = seg_item["sec_name"]
            sec_y = seg_item["sec_y"]

            if sec_name not in segmented_info:
                continue
            to_remove_index = []
            for line_index, line_text in enumerate(segmented_info[sec_name]):
                target_sec_name = None
                for i in range(len(sorted_seg_names) - 1):
                    if (
                        sorted_seg_names[i]["sec_y"]
                        <= line_text.get_attr("top")
                        < sorted_seg_names[i + 1]["sec_y"]
                    ):
                        if sec_y == sorted_seg_names[i]["sec_y"]:
                            target_sec_name = sec_name
                        else:
                            target_sec_name = sorted_seg_names[i]["sec_name"]
                        break

                if target_sec_name is None and sorted_seg_names[-1][
                    "sec_y"
                ] <= line_text.get_attr("top"):
                    target_sec_name = sorted_seg_names[-1]["sec_name"]

                if target_sec_name is not None and target_sec_name != sec_name:
                    new_segmented_info[target_sec_name].append(line_text)
                    to_remove_index.append(line_index)

                    # print(line_text)
                    # print("STEAL FROM " + str(sec_name) + " TO " + str(target_sec_name))

            if len(to_remove_index) > 0:
                new_segmented_info[sec_name] = [
                    s
                    for index, s in enumerate(new_segmented_info[sec_name])
                    if index not in to_remove_index
                ]

            if len(new_segmented_info[sec_name]) == 0:
                new_segmented_info.pop(sec_name)

        return seg_names, new_segmented_info

    def _merge_unknown_sections(self, seg_names, segmented_info):
        new_seg_names = []

        for seg_item in seg_names:
            sec_name = seg_item["sec_name"]
            sec_y = seg_item["sec_y"]

            if sec_name.startswith("UNKNOWN"):
                closest_upper_sec_y = -1
                closest_upper_sec_name = None
                for other_seg_item in seg_names:
                    if (
                        not other_seg_item["sec_name"].startswith("UNKNOWN")
                        and other_seg_item["sec_y"] < sec_y
                        and other_seg_item["sec_y"] > closest_upper_sec_y
                    ):
                        closest_upper_sec_y = other_seg_item["sec_y"]
                        closest_upper_sec_name = other_seg_item["sec_name"]

                if closest_upper_sec_y != -1:
                    sec_texts = segmented_info.pop(sec_name)
                    segmented_info[closest_upper_sec_name].extend(sec_texts)
                else:
                    new_seg_names.append(seg_item)
            else:
                new_seg_names.append(seg_item)

        return new_seg_names, segmented_info

    def _check_segmentation_title_format(
        self, standard_format, line, line_text, page, skip_unicode
    ):
        if (
            "spans" not in line
            or skip_unicode >= len(line["spans"])
            or line_text[0] in self._itemize_start
        ):
            return -1
        if (
            not self.english_sentence_template.match(line_text)
            and len(line_text.strip()) >= 20
        ):
            return -1
        if self.language == "chn" and any(
            sub in line_text for sub in self._educational_background
        ):
            return -1

        if re.search(self.chinese_punctuation_template, line_text) or re.search(
            self.english_punctuation_template, line_text
        ):
            return -1
        if (
            line["spans"][skip_unicode]["size"] != standard_format["size"]
            or line["spans"][skip_unicode]["font"] != standard_format["font"]
            or line["spans"][skip_unicode]["color"] != standard_format["color"]
            or abs(
                line["spans"][skip_unicode]["bbox"][0] - standard_format["left-top-x"]
            )
            > 3
        ):
            if (
                self._is_segment_title(line_text)
                and line["spans"][skip_unicode]["size"] >= standard_format["size"]
            ):
                return 1
            elif (
                line["spans"][skip_unicode]["size"] == standard_format["size"]
                and line["spans"][skip_unicode]["font"] == standard_format["font"]
                and line["spans"][skip_unicode]["color"] == standard_format["color"]
                and skip_unicode >= 1
            ):
                return 1
            background_color = self._get_background_color(line, page)
            if (
                abs(
                    line["spans"][skip_unicode]["bbox"][0]
                    - standard_format["left-top-x"]
                )
                > 3
            ):
                if (
                    background_color[0] == 0
                    or background_color[1] != standard_format["background_color"][1]
                ):
                    return -1
            if (
                abs(
                    line["spans"][skip_unicode]["bbox"][0]
                    - standard_format["left-top-x"]
                )
                < line["spans"][skip_unicode]["size"]
            ):
                if line["spans"][skip_unicode]["size"] > standard_format["size"]:
                    return 1
                else:
                    return -1

            return -1

        return 1

    def _get_section_title_info(self):
        section_order = []
        line_texts = []

        standard_segment_title = self._get_section_standard()
        print(standard_segment_title)

        counter = 0
        unknown_index = 0
        last_y = -1
        duplicate_seg_names = []
        for page_num, page in enumerate(self.doc):
            page_text = self.page_texts[page_num]
            first_line_in_this_page = True
            for block in page_text["blocks"]:
                if block["type"] == 1:
                    continue
                for line in block["lines"]:
                    line_text = ""
                    line_info = SegmentedLineInfo("", page_num)
                    skip_unicode = 0
                    fix_skip = False
                    if "spans" in line:
                        for span in line["spans"]:
                            succ, get_text = self._get_span_text(span)
                            if succ:
                                line_text += get_text
                                fix_skip = True
                            else:
                                if not fix_skip:
                                    skip_unicode += 1
                        line_info = self._check_itemize(line, line_info, skip_unicode)
                    else:
                        continue

                    self.maximal_line_width = max(
                        self.maximal_line_width, line["bbox"][2]
                    )

                    line_text = line_text.lstrip().rstrip()
                    line_info.update(
                        {
                            "text": line_text,
                            "left": line["bbox"][0],
                            "top": line["bbox"][1]
                            + page_num * page.rect.height,  # in one large paper
                            "right": line["bbox"][2],
                        }
                    )
                    line_texts.append(line_info)

                    check_flag = self._check_segmentation_title_format(
                        standard_segment_title, line, line_text, page, skip_unicode
                    )

                    if check_flag == 1:
                        if (
                            any(item["sec_name"] == line_text for item in section_order)
                            or line_text in duplicate_seg_names
                        ):
                            check_flag = 0

                            if line_text not in duplicate_seg_names:
                                duplicate_seg_names.append(line_text)
                                for i in range(len(section_order)):
                                    if section_order[i]["sec_name"] == line_text:
                                        section_order[i]["sec_name"] = "UNKNOWN_" + str(
                                            unknown_index
                                        )
                                        unknown_index += 1
                                        break

                    if check_flag == 1:
                        section_order.append(
                            {
                                "sec_name": line_text,
                                "start": counter,
                                "sec_y": line["bbox"][1] + page_num * page.rect.height,
                            }
                        )
                    elif (
                        check_flag == 0
                        or (last_y != -1 and abs(last_y - line["bbox"][1]) >= 100)
                        or first_line_in_this_page
                    ):
                        section_order.append(
                            {
                                "sec_name": "UNKNOWN_" + str(unknown_index),
                                "start": counter,
                                "sec_y": line["bbox"][1] + page_num * page.rect.height,
                            }
                        )
                        unknown_index += 1

                    last_y = line["bbox"][1]
                    counter += 1
                    first_line_in_this_page = False

        return section_order, line_texts

    def _split_sections(self, section_order, line_texts=[]):
        segmented_info = {}

        for seg_counter in range(len(section_order)):
            counter_start = section_order[seg_counter]["start"]
            if seg_counter == len(section_order) - 1:
                segmented_info[section_order[seg_counter]["sec_name"]] = []
                for i in range(counter_start, len(line_texts)):
                    if line_texts[i].get_attr("right") != self.maximal_line_width:
                        line_texts[i].set_attr(
                            "text", line_texts[i].get_attr("text") + "\n"
                        )
                    segmented_info[section_order[seg_counter]["sec_name"]].append(
                        line_texts[i]
                    )
            else:
                counter_end = section_order[seg_counter + 1]["start"]
                segmented_info[section_order[seg_counter]["sec_name"]] = []
                for i in range(counter_start, counter_end):
                    if line_texts[i].get_attr("right") != self.maximal_line_width:
                        line_texts[i].set_attr(
                            "text", line_texts[i].get_attr("text") + "\n"
                        )
                    segmented_info[section_order[seg_counter]["sec_name"]].append(
                        line_texts[i]
                    )

        section_order, segmented_info = self._merge_unknown_sections(
            section_order, segmented_info
        )

        # print(seg_names)
        section_order, segmented_info = self._steal_section_texts(
            section_order, segmented_info
        )

        # tc = TextCleaning()
        # for key, value in segmented_info.items():
        #    segmented_info[key] = tc.run(value, key)

        section_order, segmented_info = self._refine_segmented_info(
            section_order, segmented_info
        )

        return section_order, segmented_info

    def _refine_segmented_info(self, section_order, segmented_info):
        new_segmented_info = {}
        new_section_order = []
        for so_index, so_item in enumerate(section_order):
            so_name = so_item["sec_name"]
            if so_name in segmented_info:
                new_segmented_info[len(new_section_order)] = segmented_info[so_name]
                new_section_order.append(so_item)

        return new_section_order, new_segmented_info

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
        metadata = {
            "type": VectorDBHierarchy.SecondLayer.value,
            "source": self.blob.source,  # type: ignore[attr-defined]
            "file_path": self.blob.source,  # type: ignore[attr-defined]
            "page_index": page_num,
            "part_index": part_index,
            "section_name": (
                ""
                if not section_order
                else section_order[cur_section_index]["sec_name"]
            ),
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

    def _extract_email(self):
        email = re.findall(r"([^@|\s]+@[^@]+\.[^@|\s]+)", self.first_page_text)
        if email:
            try:
                return email[0].split()[0].strip(";")
            except IndexError:
                return None

    def get_meta_data(self):
        meta = self.doc.metadata
        meta.update({"email": self._extract_email()})

        if self.language == "chn":
            self._nlp = spacy.load("zh_core_web_sm")
        else:
            self._nlp = spacy.load("en_core_web_sm")

        self._matcher = Matcher(self._nlp.vocab)
        name_list = []

        for ent in self._nlp(self.first_page_text).ents:
            if ent.label_ == "PERSON":
                name_list.append(ent.text.strip())

        if len(name_list) == 0:
            meta["title"] = meta["email"]
        elif len(name_list) == 1:
            meta["title"] = name_list[0]
        else:
            textpage = self.pages[0].get_textpage()
            max_size = -1
            max_name = -1
            for name in name_list:
                text_rect = self.pages[0].search_for(name, textpage=textpage)[0]
                size = abs(text_rect.y1 - text_rect.y0)

                if size > max_size:
                    max_size = size
                    max_name = name

            if max_size != -1:
                meta["title"] = max_name + "_" + meta["email"]
            else:
                meta["title"] = meta["email"]

            return meta

    def extract_all(self) -> Iterable[Document]:
        return list(self.extract_text(get_rich_info=False, get_tables=False))

    def cleanup(self):
        self.doc.close()
