from typing import List, Dict
from datetime import datetime, timedelta
from arxiv import Result

from utils.cryptography import id_generator

import copy
import logging
import re
import os
import unicodedata

logger = logging.getLogger()


class Paper:
    @staticmethod
    def header() -> List[str]:
        return [
            "id",
            "title",
            "author",
            "authors",
            "year",
            "month",
            "published",
            "summary",
            "primary_category",
            "categories",
            "doi",
            "eprint",
            "journal_ref",
            "url",
            "bib",
            "reference",
            "cited_by",
            "cited_by_count",
            "publication",
            "vol",
            "issue",
            "page",
        ]

    @staticmethod
    def str_header() -> List[str]:
        return [
            "id",
            "title",
            "author",
            "published",
            "summary",
            "primary_category",
            "doi",
            "eprint",
            "journal_ref",
            "url",
            "bib",
            "publication",
            "page",
        ]

    @staticmethod
    def int_header() -> List[str]:
        return ["year", "month", "cited_by_count", "vol", "issue"]

    @staticmethod
    def list_header() -> List[str]:
        return ["authors", "categories", "reference", "cited_by"]

    @staticmethod
    def parse_creation_date(date_str: str) -> datetime:
        date_str = date_str[2:]  # Remove leading "D:"
        date_formats = [
            "%Y%m%d%H%M%S%z",
            "%Y%m%d%H%M%S",
            "%Y%m%d%H%M%S%z00'00'",
            "%Y%m%d%H%M%SZ",
            "%Y%m%d%H%M%SZ00'00'",
        ]
        # Attempt to match specific format with explicit offset
        match = re.match(r"(\d{14})([+-]\d{2})'(\d{2})'", date_str)
        if match:
            date_part, hour_offset, minute_offset = match.groups()
            date_obj = datetime.strptime(date_part, "%Y%m%d%H%M%S")
            # Create timezone offset
            offset = int(hour_offset) * 60 + int(minute_offset)
            if int(hour_offset) < 0:
                offset = -offset
            return date_obj - timedelta(minutes=offset)
        for date_format in date_formats:
            try:
                return datetime.strptime(date_str, date_format)
            except ValueError:
                continue
        raise ValueError(f"Unknown date format: {date_str}")

    @staticmethod
    def clean_author_name(name: str) -> str:
        # Define the allowed characters: alphabets, hyphens, apostrophes, spaces, and special characters
        allowed_characters = re.compile(r"[^a-zA-Z\s\-'À-ÖØ-öø-ÿĀ-žḀ-ỿ]")
        return allowed_characters.sub("", name)

    @staticmethod
    def parse_dict(meta: dict):
        meta = {key.lower(): value for key, value in meta.items()}
        parsed_meta = {}

        for key in Paper.header():
            if key not in meta:
                if key in Paper.list_header():
                    parsed_meta.setdefault(key, [])
                elif key in Paper.int_header():
                    parsed_meta.setdefault(key, None)
                elif key in Paper.str_header():
                    parsed_meta.setdefault(key, "")
            else:
                if meta[key]:
                    parsed_meta[key] = copy.deepcopy(meta[key])
                else:
                    if key in Paper.list_header():
                        parsed_meta[key] = []
                    elif key in Paper.int_header():
                        parsed_meta[key] = None
                    elif key in Paper.str_header():
                        parsed_meta[key] = ""

        paper_title = parsed_meta.get("title", "")
        if not paper_title:
            raise ValueError("Title is not found in the Paper's metadata.")

        if not parsed_meta["summary"] and "abstract" in meta:
            parsed_meta["summary"] = meta["abstract"]
        if not parsed_meta["primary_category"] and "primary_class" in meta:
            parsed_meta["primary_category"] = meta["primary_class"]
        if not parsed_meta["categories"] and parsed_meta["primary_category"]:
            parsed_meta["categories"] = [parsed_meta["primary_category"]]

        paper_id = parsed_meta.get("id", "")
        if not paper_id:
            parsed_meta["id"] = id_generator(paper_title)

        if not parsed_meta.get("published", ""):
            try:
                published_date = Paper.parse_creation_date(meta["creationdate"])
            except ValueError as e:
                try:
                    published_date = Paper.parse_creation_date(meta["moddate"])
                except ValueError as e:
                    published_date = datetime.now()
            parsed_meta["published"] = published_date.isoformat()

        if not parsed_meta.get("year", None):
            parsed_meta["year"] = published_date.year
            parsed_meta["month"] = published_date.month

        # logger.error(parsed_meta)

        if not parsed_meta["authors"] and "and" in parsed_meta["author"]:
            parsed_meta["authors"] = parsed_meta["author"].split(" and ")
            parsed_meta["author"] = parsed_meta["authors"][0]

        parsed_meta["author"] = Paper.clean_author_name(parsed_meta["author"].strip())
        parsed_meta["authors"] = [
            Paper.clean_author_name(author.strip())
            for author in parsed_meta["authors"]
            if author
        ]

        if not parsed_meta.get("bib", ""):
            parsed_meta["bib"] = Paper._format_bib(parsed_meta=parsed_meta)

        return parsed_meta

    def _format_bib(parsed_meta):
        lines = ["@article{" + parsed_meta["id"]]
        for k, v in [
            (
                "author",
                (
                    " and ".join([str(author) for author in parsed_meta["authors"]])
                    if parsed_meta["authors"]
                    else parsed_meta["author"]
                ),
            ),
            ("title", parsed_meta["title"]),
            ("doi", parsed_meta["doi"]),
            ("year", parsed_meta["year"]),
            ("month", parsed_meta["month"]),
            ("publication", parsed_meta["publication"].split("v")[0]),
            ("vol", parsed_meta["vol"]),
            ("issue", parsed_meta["issue"]),
            ("page", parsed_meta["page"]),
        ]:
            if v:
                lines.append("%-13s = {%s}" % (k, v))

        return ("," + os.linesep).join(lines) + os.linesep + "}"
