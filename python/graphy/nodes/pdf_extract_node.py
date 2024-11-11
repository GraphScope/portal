from nodes import BaseNode
from utils import Paper, ArxivFetcher, ScholarFetcher
from extractor import PDFExtractor
from config import WF_IMAGE_DIR
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
        memory_manager: BaseRuntimeMemoryManager,
        pdf_extractor: PDFExtractor,
        name: str,
        arxiv_fetch_paper: bool = True,
        scholar_fetch_paper: bool = True,
    ):
        super().__init__(name)
        self.embeddings = embeddings
        self.memory_manager = memory_manager
        self.pdf_extractor = pdf_extractor
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

    @profiler.profile(name="PDFExtractNodeExecution")
    def execute(self, state: Dict[str, Any]) -> Generator[Dict[str, Any], None, None]:
        vectordb = self.memory_manager.retrieved_memory
        paper_metadata = self.pdf_extractor.get_meta_data()
        if vectordb.is_db_valid() and vectordb.is_db_empty():
            docs = self.pdf_extractor.extract_all()
            vectordb.init_memory_parallel(docs, ["page_index", "section", "part_index"])
            self.pdf_extractor.cleanup()

        paper = Paper.from_pdf_metadata(paper_metadata)
        paper_dict = paper.to_dict()

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
