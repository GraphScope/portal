from .base_node import BaseNode, DataGenerator
from utils import Paper, ArxivFetcher, ScholarFetcher
from extractor import PDFExtractor
from config import WF_IMAGE_DIR, WF_STATE_EXTRACTOR_KEY, WF_STATE_MEMORY_KEY
from memory import BaseRuntimeMemoryManager

from langchain_core.embeddings import Embeddings
from langchain_chroma import Chroma

from typing import Any, Dict, Generator
import logging
from utils.profiler import profiler
import copy
import os

logger = logging.getLogger(__name__)


class PDFExtractNode(BaseNode):
    def __init__(
        self,
        embeddings: Embeddings,
        name: str,
        arxiv_fetch_paper: bool = True,
        scholar_fetch_paper: bool = True,
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
        pdf_extractor = state.get(WF_STATE_EXTRACTOR_KEY, None)
        if not pdf_extractor:
            raise ValueError("PDF extractor is not provided in the state.")
        vectordb = memory_manager.retrieved_memory
        paper_metadata = pdf_extractor.get_meta_data()
        paper_references = []
        if vectordb.is_db_valid() and vectordb.is_db_empty():
            docs = pdf_extractor.extract_all()
            paper_references = list(pdf_extractor.linked_contents)
            vectordb.init_memory_parallel(docs, ["page_index", "section", "part_index"])
            pdf_extractor.clear()

        paper = Paper.from_pdf_metadata(paper_metadata)
        paper_dict = paper.to_dict()
        paper_dict["reference"] = paper_references

        if self.arxiv_fetch_paper:
            result, bib_text = self.arxiv_fetcher.fetch_paper(paper.title, 5)
            if result is None and bib_text is None:
                if self.scholar_fetch_paper:
                    result, bib_text = self.scholar_fetcher.fetch_paper(
                        paper.title, mode="exact"
                    )
            if result:
                paper_dict.update(result)
            if bib_text is not None:
                paper_dict["bib"] = bib_text.replace("\n", "\\n")
        logger.debug("=========== PAPER INFO ===============")
        logger.debug(paper_dict)

        yield {"data": paper_dict}
