from .base_node import BaseNode, DataGenerator
from utils import Paper, ArxivFetcher, ScholarFetcher
from utils.profiler import profiler
from config import (
    WF_STATE_EXTRACTOR_KEY,
    WF_STATE_MEMORY_KEY,
    WF_WEBDATA_DIR,
)

from langchain_core.embeddings import Embeddings
from typing import Any, Dict

import os
import logging

logger = logging.getLogger(__name__)


class PDFExtractNode(BaseNode):
    def __init__(
        self,
        embeddings: Embeddings,
        name: str,
        arxiv_fetch_paper: bool = True,
        scholar_fetch_paper: bool = False,
    ):
        super().__init__(name)
        self.embeddings = embeddings
        self.arxiv_fetch_paper = arxiv_fetch_paper
        self.scholar_fetch_paper = scholar_fetch_paper

        if arxiv_fetch_paper:
            self.arxiv_fetcher = ArxivFetcher()
        else:
            self.arxiv_fetcher = None
        if scholar_fetch_paper:
            self.scholar_fetcher = ScholarFetcher()
        else:
            self.scholar_fetcher = None

    def get_memory(self) -> str:
        return ""

    def get_query(self) -> str:
        return ""

    @profiler.profile(name="PDFExtractNodeExecution")
    def execute(
        self, state: Dict[str, Any], _input: DataGenerator = None
    ) -> DataGenerator:
        memory_manager = state.get(WF_STATE_MEMORY_KEY, None)
        if not memory_manager:
            raise ValueError("Memory manager is not provided in the state.")
        data_id = memory_manager.collection_name
        pdf_extractor = state.get(WF_STATE_EXTRACTOR_KEY, None)
        filename = os.path.basename(pdf_extractor.file_path)
        if not pdf_extractor:
            raise ValueError("PDF extractor is not provided in the state.")

        vectordb = memory_manager.retrieved_memory
        paper_metadata = pdf_extractor.get_meta_data()

        if len(pdf_extractor.input_meta_data) <= 0:
            if self.arxiv_fetch_paper:
                paper_title = paper_metadata.get("title", "")
                if len(paper_title) > 0:
                    result = self.arxiv_fetcher.fetch_paper(paper_title, 3)
                    if result:
                        paper_metadata.update(result)

        paper_metadata = Paper.parse_dict(paper_metadata)

        pdf_paper_references = []

        if not pdf_extractor.fake_extractor:
            if vectordb.is_db_valid() and vectordb.is_db_empty():
                docs = pdf_extractor.extract_all()
                pdf_paper_references = list(pdf_extractor.linked_contents)
                logger.debug("========= START TO INIT MEMORY ======")
                vectordb.init_memory_parallel(
                    docs, ["page_index", "section", "part_index"]
                )
                logger.debug(
                    f"========= FINISH TO INIT MEMORY {pdf_extractor.file_path} ======"
                )
            else:
                pdf_extractor.compute_links()
                pdf_paper_references = list(pdf_extractor.linked_contents)

        if not paper_metadata["reference"]:
            paper_metadata["reference"].extend(pdf_paper_references)
        paper_metadata["data_id"] = data_id
        paper_metadata["filename"] = filename

        pdf_extractor.clear()

        logger.debug("=========== PAPER INFO ===============")
        logger.debug(paper_metadata)

        yield {"data": paper_metadata}
