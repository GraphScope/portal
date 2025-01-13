from typing import List, Dict
from datetime import datetime, timedelta
from arxiv import Result

from utils.cryptography import id_generator

import copy
import logging
import re

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

        paper_id = parsed_meta.get("id", "")
        if paper_id == "":
            parsed_meta["id"] = id_generator(parsed_meta.get("title", "").lower())

        if not parsed_meta.get("published", ""):
            try:
                published_date = Paper.parse_creation_date(meta["creationDate"])
            except ValueError as e:
                try:
                    published_date = Paper.parse_creation_date(meta["modDate"])
                except ValueError as e:
                    published_date = datetime.now()
            parsed_meta["published"] = published_date.isoformat()

        if not parsed_meta.get("year", None):
            parsed_meta["year"] = published_date.year
            parsed_meta["month"] = published_date.month

        # logger.error(parsed_meta)
        parsed_meta["author"] = Paper.clean_author_name(parsed_meta["author"])
        parsed_meta["authors"] = [
            Paper.clean_author_name(author.strip())
            for author in parsed_meta["authors"]
            if author
        ]

        return parsed_meta
