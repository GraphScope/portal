from __future__ import annotations
from abc import ABC, abstractmethod

from graph.nodes.base_node import BaseNode, NodeType
from graph.nodes.paper_reading_nodes import ProgressInfo, process_id
from graph.types import DataGenerator
from graph import BaseGraph
from config import WF_STATE_CACHE_KEY
from db import PersistentStore
from models import LLM
from utils.profiler import profiler

from langchain_core.embeddings import Embeddings

from typing import Dict, List, Any, Generator
import re
import logging


logger = logging.getLogger(__name__)


class BaseWorkflow(ABC):
    """
    Base Class representing the workflow.

    Attributes:
        llm_model: The large language model for executing prompts.
        parser_model: The model for parsing outputs into structured (JSON) format.
        embeddings_model: The model for converting text to embeddings for vector db.
        persist_store (PersistentStore): The persistent store for storing the state of the workflow.
        graph (BaseGraph): The graph representing the workflow.
        state (Dict[str, Any]): The state of the workflow, including executed nodes and their contexts.
        progress (Dict[str, ProgressInfo]): The progress of the workflow.
    """

    def __init__(
        self,
        id: str,
        graph: BaseGraph,
        persist_store: PersistentStore = None,
    ):
        self.id = id
        self.persist_store = persist_store
        self.graph = graph
        self.state = {}

    @classmethod
    @abstractmethod
    def from_dict(cls, workflow_json: dict):
        """
        Abstract class method to create a workflow from dict.
        """
        pass

    def get_id(self):
        return self.id

    @profiler.profile(name="WorkflowNodeExecution")
    def execute_node(
        self, node_name: str, input: DataGenerator = None
    ) -> DataGenerator:
        """
        Executes the node with the given name.

        Args:
            :param node_name: Name of the node to execute.
            :return: Result of the node execution.
        """

        node = self.graph.get_node(node_name)
        if not node:
            raise ValueError(f"Node {node_name} does not exist.")
        else:
            yield node.execute(self.state, input)

    @profiler.profile(name="WorkflowEdgeExecution")
    def execute_edge(
        self, edge_name: str, input: DataGenerator = None
    ) -> DataGenerator:
        """
        Executes the edge with the given name.

        Args:
            :param edge_name: Name of the edge to execute.
            :return: Result of the edge execution.
        """

        edge = self.graph.get_edge(edge_name)
        if not edge:
            raise ValueError(f"Edge {edge_name} does not exist.")
        else:
            yield edge.execute(self.state, input)
