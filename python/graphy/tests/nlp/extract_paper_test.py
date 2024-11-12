"""
Tests for the Paper Extraction.
"""

import pytest


from extractor.paper_extractor import PaperExtractor
from extractor.p4l_paper_extractor import P4LPaperExtractor
from memory.llm_memory import VectorDBHierarchy


class TestExtractPaper:
    @pytest.mark.parametrize(
        "paper_path",
        [
            ("inputs/samples/graphrag.pdf"),
            ("inputs/samples/huge-sigmod21.pdf"),
        ],
    )
    def test_paper_extractor(self, paper_path):
        paper_extractor = PaperExtractor(paper_path)
        paper_extractor.set_img_path("img_store")
        extract_list = paper_extractor.extract_all()

        assert len(extract_list) > 0
        assert any(
            d.get("metadata", {}).get("type", None)
            == VectorDBHierarchy.FirstLayer.value
            for d in extract_list
        )
        assert any(
            d.get("metadata", {}).get("type", None)
            == VectorDBHierarchy.SecondLayer.value
            for d in extract_list
        )

    @pytest.mark.parametrize(
        "paper_path",
        [
            ("inputs/samples/graphrag.pdf"),
            ("inputs/samples/huge-sigmod21.pdf"),
        ],
    )
    def test_p4l_paper_extractor(self, paper_path):
        paper_extractor = P4LPaperExtractor(paper_path)
        paper_extractor.set_img_path("img_store")
        extract_list = paper_extractor.extract_all()

        assert len(extract_list) > 0
        assert any(
            d.get("metadata", {}).get("type", None)
            == VectorDBHierarchy.FirstLayer.value
            for d in extract_list
        )
        assert any(
            d.get("metadata", {}).get("type", None)
            == VectorDBHierarchy.SecondLayer.value
            for d in extract_list
        )
