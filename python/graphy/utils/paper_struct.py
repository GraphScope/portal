import re
from typing import List, Dict
from datetime import datetime, timedelta
from arxiv import Result


class Paper:
    @staticmethod
    def header(cls) -> List[str]:
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
            "references",
            "cited_by",
            "cited_by_count",
        ]

    @staticmethod
    def parse_creation_date(cls, date_str: str) -> datetime:
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
