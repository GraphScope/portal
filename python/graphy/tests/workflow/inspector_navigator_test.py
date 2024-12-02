import pytest
from models import DEFAULT_LLM_MODEL_CONFIG
from workflow import ThreadPoolWorkflowExecutor

from unittest.mock import MagicMock, create_autospec
from graph.types import DataType
from graph.nodes import BaseNode, NodeType
from graph.edges import BaseEdge
from workflow.executor import ThreadPoolWorkflowExecutor
from workflow import SurveyPaperReading
from queue import Queue


@pytest.fixture
def mock_graph():
    """
    Create a mock graph with two nodes and one edge.
    """

    def mock_execute(state, inputs):
        for input in inputs:
            if input["data"] < 3:
                yield {"data": input["data"] + 1}
                yield {"data": input["data"] + 2}
            else:
                yield {}

    # Mock nodes
    mock_node = create_autospec(BaseNode, instance=True)
    mock_node.name = "Node1"
    mock_node.node_type = NodeType.INSPECTOR
    mock_node.execute.side_effect = mock_execute
    # Mock edge
    mock_edge = create_autospec(BaseEdge, instance=True)
    mock_edge.name = "Edge1"
    mock_edge.source = "Node1"
    mock_edge.target = "Node1"
    mock_edge.execute.side_effect = mock_execute
    # Mock graph adjacency
    mock_graph = MagicMock()
    mock_graph.get_first_node.return_value = mock_node
    mock_graph.get_adjacent_edges.return_value = [mock_edge]
    mock_graph.get_node.return_value = mock_node
    mock_graph.get_edge.return_value = mock_edge

    # Return the mocks for verification
    mock_graph.mock_node = mock_node
    mock_graph.mock_edge = mock_edge

    return mock_graph


@pytest.fixture
def mock_workflow(mock_graph):
    """
    Create a mock workflow for testing.
    """
    mock_state = {}
    workflow = MagicMock(spec=SurveyPaperReading)
    workflow.graph = mock_graph
    workflow.state = mock_state
    return workflow


@pytest.fixture
def threadpool_executor(mock_workflow):
    """
    Create an instance of ThreadPoolWorkflowExecutor for testing.
    """
    return ThreadPoolWorkflowExecutor(
        workflow=mock_workflow,  # Mock workflow doesn't use JSON
        workflow_class=None,  # Mock workflow doesn't use class creation
        max_workers=2,
        max_inspectors=100,
    )


def test_executor_initialization(threadpool_executor):
    """
    Test if the executor initializes correctly.
    """
    assert isinstance(threadpool_executor.task_queue, Queue)
    assert isinstance(threadpool_executor.workflow, SurveyPaperReading)
    assert threadpool_executor.executor._max_workers == 2
    assert threadpool_executor.max_inspectors == 100


def test_execution(threadpool_executor, mock_graph):
    initial_inputs = [{"data": 0}]
    threadpool_executor.execute(initial_inputs)

    # Verify that the first node was executed
    mock_node = mock_graph.mock_node
    assert mock_node.execute.call_count == threadpool_executor.processed_inspectors

    # Verify that the edge was executed for each input
    mock_edge = mock_graph.mock_edge
    assert mock_edge.execute.call_count == mock_graph.get_adjacent_edges.call_count


@pytest.fixture
def threadpool_executor_with_limit(mock_workflow):
    """
    Create an instance of ThreadPoolWorkflowExecutor for testing.
    """
    return ThreadPoolWorkflowExecutor(
        workflow=mock_workflow,  # Mock workflow doesn't use JSON
        workflow_class=None,  # Mock workflow doesn't use class creation
        max_workers=1,
        max_inspectors=2,
    )


def test_execution_with_limit(threadpool_executor_with_limit):
    initial_inputs = [{"data": 0}]
    threadpool_executor_with_limit.execute(initial_inputs)
    assert threadpool_executor_with_limit.processed_inspectors == 2


@pytest.mark.skip(reason="The LLM model must be set to run this.")
def test_workflow_execute():
    graph_json = {
        "inspectors": [
            {
                "name": "PaperInspector",
                "graph": {
                    "nodes": [
                        {"name": "Paper"},
                    ],
                    "edges": [],
                },
            }
        ],
        "navigators": [
            {
                "name": "Reference",
                "source": "PaperInspector",
                "target": "PaperInspector",
            }
        ],
    }

    workflow_json = {
        "id": "_graphy_test",
        "llm_model": DEFAULT_LLM_MODEL_CONFIG,
        "graph": graph_json,
    }
    executor = ThreadPoolWorkflowExecutor(workflow_json, SurveyPaperReading, 1, 2)
    inputs = [
        {"paper_file_path": "inputs/samples/graphrag.pdf"},
    ]

    executor.execute(inputs)
