import re
from typing import List, Dict
from datetime import datetime, timedelta
from arxiv import Result


class Paper:
    """
    An object that defines common paper structure
    """

    def __init__(
        self,
        id: str,
        published: datetime,
        year: str,
        month: str,
        title: str,
        authors: List[str],
        summary: str,
        journal_ref: str,
        doi: str,
        primary_category: str,
        categories: List[str],
        bib: str,
    ):
        self.id = id
        self.published = published
        self.year = year
        self.month = month
        self.title = title
        self.authors = authors
        self.summary = summary
        self.journal_ref = journal_ref
        self.doi = doi
        self.primary_category = primary_category
        self.categories = categories
        self.bib = bib

    def to_dict(self) -> Dict:
        return {
            "id": self.id,
            "published": self.published.isoformat(),
            "year": self.year,
            "month": self.month,
            "title": self.title,
            "authors": self.authors,
            "summary": self.summary,
            "journal_ref": self.journal_ref,
            "doi": self.doi,
            "primary_category": self.primary_category,
            "categories": self.categories,
            "bib": self.bib,
        }

    @classmethod
    def from_dict(cls, data: Dict):
        return cls(
            id=data["id"],
            published=datetime.fromisoformat(data["published"]),
            year=data["year"],
            month=data["month"],
            title=data["title"],
            authors=data["authors"],
            summary=data["summary"],
            journal_ref=data["journal_ref"],
            doi=data["doi"],
            primary_category=data["primary_category"],
            categories=data["categories"],
            bib=data["bib"],
        )

    @classmethod
    def from_pdf_metadata(cls, metadata: Dict):
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

        def clean_author_name(name: str) -> str:
            # Define the allowed characters: alphabets, hyphens, apostrophes, spaces, and special characters
            allowed_characters = re.compile(r"[^a-zA-Z\s\-'À-ÖØ-öø-ÿĀ-žḀ-ỿ]")
            return allowed_characters.sub("", name)

        try:
            published_date = parse_creation_date(metadata["creationDate"])
        except ValueError as e:
            try:
                published_date = parse_creation_date(metadata["modDate"])
            except ValueError as e:
                published_date = datetime.now()

        authors_str = metadata.get("author", "")
        authors_list = [
            clean_author_name(author.strip())
            for author in authors_str.replace(" and ", ", ").split(",")
            if author
        ]

        return cls(
            id=str(hash(metadata.get("title", "").lower())),
            published=published_date,
            year=published_date.year,
            month=published_date.month,
            title=metadata.get("title", ""),
            authors=authors_list,
            summary="",
            journal_ref="",
            doi="",
            primary_category="",
            categories=[],
            bib="",
        )
