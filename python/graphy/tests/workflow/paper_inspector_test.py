import torchtext

torchtext.disable_torchtext_deprecation_warning()

import pytest
from unittest.mock import MagicMock, create_autospec
from graph import BaseGraph
from graph.nodes import PaperInspector, BaseNode
from graph.nodes.paper_reading_nodes import ProgressInfo, ExtractNode
from graph.types import DataGenerator
from models import LLM
from db import PersistentStore
from config import WF_STATE_CACHE_KEY, WF_STATE_MEMORY_KEY, WF_STATE_EXTRACTOR_KEY

from langchain_core.embeddings import Embeddings


@pytest.fixture
def mock_graph():
    graph = BaseGraph()
    mock_node = create_autospec(ExtractNode, instance=True)
    mock_node.name = "Paper"
    mock_node.get_query.return_value = ""
    mock_node.get_memory.return_value = ""
    mock_node.get_node_key.return_value = "Paper"
    mock_node.execute.return_value = iter([{"result": "node_output"}])
    graph.add_node(mock_node)
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


def test_run_through(mock_paper_inspector):
    """
    Test the run_through method for processing a simple workflow.
    """
    input_data = {"paper_file_path": "inputs/samples/graphrag.pdf"}
    state = {}
    output = list(mock_paper_inspector.run_through(input_data, state))

    # Ensure the expected results are returned
    assert len(output) == 1
    assert output[0] == {"result": "node_output"}

    # Verify state and progress updates
    data_id = list(state.keys())[0]
    assert WF_STATE_CACHE_KEY in state[data_id]
    assert WF_STATE_EXTRACTOR_KEY in state[data_id]
    assert WF_STATE_MEMORY_KEY in state[data_id]
    assert mock_paper_inspector.progress["Paper"].completed == 1
    assert mock_paper_inspector.progress["total"].completed == 1
    cached_response = state[data_id][WF_STATE_CACHE_KEY]["Paper"].get_response()
    assert cached_response == {"result": "node_output"}


def test_execute(mock_paper_inspector):
    """
    Test the execute method for processing input generator.
    """
    input_data = [{"paper_file_path": "inputs/samples/graphrag.pdf"}]
    state = {}
    input_gen = (item for item in input_data)  # Create a generator from input_data

    output_gen = mock_paper_inspector.execute(state, input_gen)
    # Fully consume the generator
    outputs = [list(inner_gen) for inner_gen in output_gen]

    assert len(outputs) == 1
    assert len(outputs[0]) == 1  # `run_through` yields single outputs
    assert outputs[0][0] == {"result": "node_output"}


def test_run_through_with_error(mock_paper_inspector):
    """
    Test the run_through method for error handling.
    """
    mock_paper_inspector.graph.get_node("Paper").execute.side_effect = Exception(
        "Test error"
    )

    input_data = {"paper_file_path": "inputs/samples/graphrag.pdf"}
    state = {}

    # Test with continue_on_error=False
    with pytest.raises(ValueError, match="Error executing node 'Paper': Test error"):
        output_gen = mock_paper_inspector.run_through(
            input_data, state, continue_on_error=False
        )
        [list(inner_gen) for inner_gen in output_gen]
