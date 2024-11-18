from __future__ import annotations

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


class BaseWorkflow:
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
        llm_model: LLM,
        parser_model: LLM,
        embddings_model: Embeddings,
        graph: BaseGraph,
        persist_store: PersistentStore = None,
    ):
        self.id = id
        self.llm_model = llm_model
        self.parser_model = parser_model
        self.embeddings_model = embddings_model
        self.persist_store = persist_store
        self.graph = graph
        self.state = {}
        self.progress = {"total": ProgressInfo()}

    def get_id(self):
        return self.id

    def get_progress(self, node_name: str = None) -> ProgressInfo:
        if node_name:
            return self.progress.get(node_name, ProgressInfo())
        else:
            return self.progress["total"]

    def get_persistent_state(self, node_key: str):
        """
        Retrieve the persistent state of a node from the `PersistentStore`.

        Args:
            node_key (str): The key of the node for fetching persistent state

        Returns:
            dict or None: The persistent state of the node if the file exists, otherwise None.
        """
        if self.persist_store:
            return self.persist_store.get_state(self.get_id(), node_key)
        else:
            return None

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
