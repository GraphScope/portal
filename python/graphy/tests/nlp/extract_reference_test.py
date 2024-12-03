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

from utils.paper_expansion import PaperExpansion


@pytest.mark.skipif(True, reason="slow")
class TestExtractReference:
    @pytest.mark.parametrize(
        "paper_path, test_dir",
        [
            (["inputs/samples/graphrag.pdf"], "test1"),
            (
                [
                    "inputs/samples/graphrag.pdf",
                    "inputs/samples/huge-sigmod21.pdf",
                ],
                "test2",
            ),
        ],
    )
    def test_reference_extractor(self, paper_path, test_dir):
        if os.path.exists(test_dir) and os.path.isdir(test_dir):
            shutil.rmtree(test_dir)
        os.makedirs(test_dir)

        for paper in paper_path:
            shutil.copyfile(paper, os.path.join(test_dir, os.path.basename(paper)))

        llm_model = ChatOllama(
            model="llama3",
            temperature=0,
            base_url="http://localhost:11434",
            stop=["<|eot_id|>"],
        )

        embeddings_model = MyEmbedding()

        paper_expansion = PaperExpansion(
            llm_model=llm_model,
            embedding_model=embeddings_model,
            extract_concurrency=2,
            arxiv_download_concurrency=8,
            scholar_download_concurrency=2,
            max_paper_num=5,
            max_hop=-1,
        )

        paper_expansion.execute(test_dir)

        output_path = os.path.join(test_dir, paper_expansion.output_dir)
        pdf_files = glob.glob(os.path.join(output_path, "*.pdf"))
        pdf_count = len(pdf_files)

        assert pdf_count == 5

        if os.path.exists(test_dir) and os.path.isdir(test_dir):
            shutil.rmtree(test_dir)
