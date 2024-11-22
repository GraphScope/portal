from config import WF_DOWNLOADS_DIR, WF_WEBDATA_DIR
from typing import List, Dict, Any

import concurrent.futures
import difflib
import re
import os
import logging
import time
import unicodedata

from .bib_search import BibSearchGoogleScholar
from .arxiv_fetcher import ResultFormer

logger = logging.getLogger(__name__)


class ScholarFetcher:
    def __init__(
        self,
        download_folder: str = WF_DOWNLOADS_DIR,
        web_data_folder: str = WF_WEBDATA_DIR,
    ):
        self.download_folder = download_folder
        self.bib_search_google = BibSearchGoogleScholar(web_data_folder)

        self.result_former = ResultFormer()

    def set_web_data_folder(self, folder_path: str):
        self.bib_search_google.web_data_folder = folder_path

    def download_paper(self, name: str, mode="vague"):
        logger.info(
            f"******************** Scholar Searching for paper: {name} *******************"
        )

        name = unicodedata.normalize("NFKC", name)

        try:
            download_list = self.bib_search_google.download_by_name(
                name, download_path=self.download_folder, mode=mode
            )
            return download_list
        except Exception as e:
            logger.error(f"Error downloading google scholar: {str(e)} {name}")
            return []

    def fetch_paper(self, name: str, mode="vague"):
        try:
            paper_info = self.bib_search_google.search_by_name(name, mode=mode)
        except Exception as e:
            logger.error(f"Error searching google scholar: {e}")
            paper_info = None

        # logger.debug(paper_info)
        if paper_info is None:
            return None, None

        fetch_result = self.result_former.init_from_google_scholar(paper_info)
        paper_bib = paper_info.get("bib", None)

        return fetch_result, paper_bib
