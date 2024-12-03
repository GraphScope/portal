"""
Tests for the Paper Extraction.
"""

import pytest
import os
import shutil
import glob

from langchain_community.chat_models import ChatOllama
from chromadb.utils import embedding_functions
from models import MyEmbedding

from memory.llm_memory import PaperReadingMemoryManager
from extractor.paper_extractor import PaperExtractor
from graph.nodes.pdf_extract_node import PDFExtractNode


@pytest.mark.skipif(True, reason="slow")
class TestGetBib:
    @pytest.mark.parametrize(
        "paper_path",
        [
            ("inputs/samples/graphrag.pdf"),
            ("inputs/samples/huge-sigmod21.pdf"),
        ],
    )
    def test_get_bib(self, paper_path):
        llm_model = ChatOllama(
            model="llama3",
            temperature=0,
            base_url="http://localhost:11434",
            stop=["<|eot_id|>"],
        )

        embeddings_model = MyEmbedding()

        pdf_extractor = PaperExtractor(paper_path)
        pdf_extractor.set_img_path("img_store")

        node = PDFExtractNode(
            embeddings=embeddings_model,
            memory_manager=PaperReadingMemoryManager(
                llm_model,
                embeddings_model,
                None,
                vectordb=None,
            ),
            pdf_extractor=pdf_extractor,
            name="extract",
            arxiv_fetch_paper=True,
            scholar_fetch_paper=True,
        )

        for output in node.execute({}):
            last_output = output

        assert last_output.get("data", {}).get("bib", None) != None
        assert len(last_output.get("data", {}).get("bib", None)) > 0
