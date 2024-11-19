import torchtext

torchtext.disable_torchtext_deprecation_warning()

import pytest
from unittest.mock import MagicMock, create_autospec
from graph import BaseGraph, BaseEdge
from graph.nodes import PaperInspector, BaseNode
from graph.nodes.paper_reading_nodes import (
    ProgressInfo,
    ExtractNode,
    create_inspector_graph,
)
from graph.types import DataGenerator
from models import LLM, set_llm_model, DEFAULT_LLM_MODEL_CONFIG, DefaultEmbedding
from db import PersistentStore, JsonFileStore
from config import (
    WF_STATE_CACHE_KEY,
    WF_STATE_MEMORY_KEY,
    WF_STATE_EXTRACTOR_KEY,
    WF_OUTPUT_DIR,
)

from langchain_core.embeddings import Embeddings

import os


@pytest.fixture
def mock_graph():
    graph = BaseGraph()
    mock_node = create_autospec(ExtractNode, instance=True)
    mock_node.name = "Paper"
    mock_node.get_query.return_value = ""
    mock_node.get_memory.return_value = ""
    mock_node.execute.return_value = iter([{"result": "node_output"}])

    mock_node2 = create_autospec(ExtractNode, instance=True)
    mock_node2.name = "Extract"
    mock_node2.get_query.return_value = ""
    mock_node2.get_memory.return_value = ""
    mock_node2.execute.return_value = iter([{"result": "node_output2"}])
    graph.add_node(mock_node)
    graph.add_node(mock_node2)
    graph.add_edge(BaseEdge(source="Paper", target="Extract"))
    return graph


@pytest.fixture
def mock_paper_inspector(mock_graph):
    mock_llm = MagicMock(spec=LLM)
    mock_llm.model = MagicMock()  # Add the `model` attribute
    mock_llm.context_size = 8192
    mock_llm.enable_streaming = True

    mock_embeddings = MagicMock(spec=Embeddings)
    mock_persist_store = MagicMock(spec=PersistentStore)
    return PaperInspector(
        name="TestInspector",
        llm_model=mock_llm,
        embeddings_model=mock_embeddings,
        graph=mock_graph,
        persist_store=mock_persist_store,
    )


def test_initialization(mock_paper_inspector, mock_graph):
    """
    Test initialization of PaperInspector.
    """
    assert mock_paper_inspector.name == "TestInspector"
    assert mock_paper_inspector.graph == mock_graph
    assert isinstance(mock_paper_inspector.progress["total"], ProgressInfo)
    assert mock_paper_inspector.persist_store is not None


def test_execute(mock_paper_inspector):
    """
    Test the execute method for processing input generator.
    """
    input_data = [{"paper_file_path": "inputs/samples/graphrag.pdf"}]
    state = {}
    input_gen = (item for item in input_data)  # Create a generator from input_data

    output_gen = mock_paper_inspector.execute(state, input_gen)
    # Fully consume the generator
    outputs = list(output_gen)

    data_id = list(state.keys())[0]
    assert WF_STATE_CACHE_KEY in state[data_id]
    assert WF_STATE_EXTRACTOR_KEY in state[data_id]
    assert WF_STATE_MEMORY_KEY in state[data_id]
    assert mock_paper_inspector.progress["Paper"].completed == 1
    assert mock_paper_inspector.progress["Extract"].completed == 1
    assert mock_paper_inspector.progress["total"].completed == 2
    cached_response = state[data_id][WF_STATE_CACHE_KEY]["Paper"].get_response()
    assert cached_response == {"result": "node_output"}

    assert len(outputs) == 1
    assert outputs[0] == {"result": "node_output"}


@pytest.mark.skip(reason="The LLM model must be set to run this.")
def test_inspector_execute():
    llm_model = set_llm_model(DEFAULT_LLM_MODEL_CONFIG)
    embeddings_model = DefaultEmbedding()

    workflow = {
        "nodes": [
            {"name": "Paper"},
            {
                "name": "Contribution",
                "query": "**Question**:\nList all contributions of the paper...",
                "extract_from": ["1"],
                "output_schema": {
                    "type": "array",
                    "description": "A list of contributions.",
                    "item": [
                        {
                            "name": "original",
                            "type": "string",
                            "description": "The original contribution sentences.",
                        },
                        {
                            "name": "summary",
                            "type": "string",
                            "description": "The summary of the contribution.",
                        },
                    ],
                },
            },
            {
                "name": "Challenge",
                "query": "**Question**:\nPlease summarize some challenges in this paper...",
                "extract_from": [],
                "output_schema": {
                    "type": "array",
                    "description": "A list of challenges...",
                    "item": [
                        {
                            "name": "name",
                            "type": "string",
                            "description": "The summarized name of the challenge.",
                        },
                        {
                            "name": "description",
                            "type": "string",
                            "description": "The description of the challenge.",
                        },
                        {
                            "name": "solution",
                            "type": "string",
                            "description": "The solution of the challenge.",
                        },
                    ],
                },
            },
        ],
        "edges": [
            {"source": "Paper", "target": "Contribution"},
            {"source": "Contribution", "target": "Challenge"},
        ],
    }

    graph = create_inspector_graph(
        workflow, llm_model, llm_model, embeddings_model.chroma_embedding_model()
    )

    persist_store = JsonFileStore(WF_OUTPUT_DIR)

    inspector = PaperInspector(
        "PaperInspector",
        llm_model,
        embeddings_model.chroma_embedding_model(),
        graph,
        persist_store,
    )

    state = {}
    inputs = [
        {"paper_file_path": "inputs/samples/graphrag.pdf"},
        {"paper_file_path": "inputs/samples/huge-sigmod21.pdf"},
    ]

    for output in inspector.execute(state, iter(inputs)):
        print(output)