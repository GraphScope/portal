from __future__ import annotations

from graph import BaseNode, NodeType
from config import WF_STATE_CACHE_KEY
from db import PersistentStore

from langchain_core.embeddings import Embeddings
from langchain_core.language_models.llms import BaseLLM

from typing import Dict, List, Any, Generator
from utils.profiler import profiler
import re
import logging


logger = logging.getLogger(__name__)


def process_id(base_name: str) -> str:
    # Replace invalid characters with underscores
    id_name = re.sub(r"[^a-zA-Z0-9_-]", "_", base_name)

    # Ensure it does not contain two consecutive periods
    id_name = re.sub(r"\.\.+", ".", id_name)

    # Ensure it starts with an alphanumeric character
    id_name = re.sub(r"^[^a-zA-Z0-9]+", "", id_name)

    # Trim to 63 characters
    if len(id_name) > 63:
        id_name = id_name[:63]

    # Ensure it ends with an alphanumeric character
    id_name = re.sub(r"[^a-zA-Z0-9]+$", "", id_name)

    # Ensure it has at least 3 characters
    if len(id_name) < 3:
        id_name = f"{hash(base_name)}_{id_name}"

    return id_name


class ProgressInfo:
    def __init__(self, number=0, completed=0):
        self.number = number
        self.completed = completed

    def add(self, others: ProgressInfo):
        self.number += others.number
        self.completed += others.completed

    def increase(self):
        self.number += 1

    def decrease(self):
        self.number -= 1

    def complete(self):
        if self.completed < self.number:
            self.completed += 1
        else:
            logging.error(
                f"Completed: {self.completed} cannot exceed Number: {self.number}"
            )

    def get_percentage(self) -> float:
        if self.number == 0:
            return 0.0
        else:
            return 100 * self.completed / float(self.number)

    def backpedal(self):
        if self.completed > 0:
            self.completed -= 1

    def __str__(self):
        return f"Number: {self.number}, Completed: {self.completed}"


class AbstractWorkflow:
    """
    Abstract Class representing the workflow.

    Attributes:
        llm_model: The large language model for executing prompts.
        parser_model: The model for parsing outputs into structured (JSON) format.
        embeddings_model: The model for converting text to embeddings for vector db.
        memory_manager (HierarchicalMemoryManager): The memory manager for storing and retrieving information.
        state (Dict[str, Any]): The state of the workflow, including executed nodes and their contexts.
        nodes (Dict[str, BaseNode]): A dictionary of nodes in the workflow, keyed by their names.
        adjacent_list(Dict[str, List[str]]): An adjacency list representation of the workflow.
        current_node (str): The current node being executed.
        max_token_size (int): The maximum token size for the llm model.
    """

    def __init__(
        self,
        id: str,
        llm_model: BaseLLM,
        parser_model: BaseLLM,
        embddings_model: Embeddings,
        persist_store: PersistentStore = None,
        max_token_size: int = 8192,
        enable_streaming: bool = False,
    ):
        self.id = id
        self.llm_model = llm_model
        self.parser_model = parser_model
        self.embeddings_model = embddings_model
        self.nodes = {}
        self.node_caches = {}
        self.adjacency_list = {}
        self.progress = {"total": ProgressInfo()}
        self.state = {id: {WF_STATE_CACHE_KEY: self.node_caches}}
        self.persist_store = persist_store
        self.current_node = None
        self.max_token_size = max_token_size
        self.enable_streaming = enable_streaming

    def get_id(self):
        return self.id

    def get_progress(self, node_name: str = None) -> ProgressInfo:
        if node_name:
            return self.progress.get(node_name, ProgressInfo())
        else:
            return self.progress["total"]

    def get_cached_results(self, node_name):
        node_caches: dict = self.state.get(self.id, {}).get(WF_STATE_CACHE_KEY, {})
        cached_results = node_caches.get(node_name, None)
        if cached_results:
            return cached_results.get_response()
        else:
            return None

    def get_node_names(self) -> List[str]:
        return list(self.nodes.keys())

    def add_node(self, node: BaseNode):
        """
        Adds a node to the workflow.

        Args:
            node (BaseNode): The node to be added.
        """
        self.nodes[node.name] = node
        self.progress[node.name] = ProgressInfo(1, 0)
        self.progress["total"].increase()
        self.adjacency_list[node.name] = []

    def remove_node(self, node_name: str):
        """
        Removes a node from the workflow.
        Return the removed node's name, the node, and its adjacency_list.

        Args:
            node_name (str): The name of the node to be removed.
        """
        if node_name in self.adjacency_list:
            adj_list = self.adjacency_list.pop(node_name)
            self.node_caches.pop(node_name)
            curr_progress = self.progress.pop(node_name)
            self.progress["total"].decrease()
            if curr_progress.completed == 1:
                self.progress["total"].backpedal()
            return self.nodes.pop(node_name, None), adj_list
        else:
            return None

    def add_edge(self, source_node_name: str, target_node_name: str):
        """
        Adds an edge to the workflow.

        Args:
            source_node (str): The source node of the edge to be added.
            target_node (str): The target node of the edge to be added.
        """
        source_node = self.nodes.get(source_node_name, None)
        target_node = self.nodes.get(target_node_name, None)
        if not source_node or not target_node:
            logger.error("Source or target node not found in the workflow")
            return
        self.adjacency_list.setdefault(source_node_name, []).append(target_node_name)

    def remove_edge(self, source_node_name: str, target_node_name: str):
        """
        Removes an edge from the workflow.

        Args:
            source_node (str): The source node of the edge to be removed.
            target_node (str): The target node of the edge to be removed.
        """
        adj_list = self.adjacency_list.get(source_node_name, [])
        if adj_list:
            adj_list.remove(target_node_name)

    def remove_all_edges(self, node_name: str) -> List[str]:
        """
        Removes all edges from a node.

        Args:
            node_name (str): The node whose edges are to be removed.
        """
        return self.adjacency_list.pop(node_name, [])

    def set_current_node(self, node_name: str):
        self.current_node = node_name

    def get_current_node(self) -> str:
        """
        Retrieves the current node being executed.

        Returns:
            BaseNode: The current node being executed.
        """
        return self.current_node

    def get_precursor_nodes(self, node_name: str) -> List[str]:
        results = []
        for name, _ in self.nodes.items():
            if self.has_edge(name, node_name):
                results.append(name)
        return results

    def get_node(self, node_name: str) -> BaseNode:
        """
        Retrieves a node from its name from the workflow.

        Args:
            node_name (str): The name of the node to be retrieved.

        Returns:
            BaseNode: The node with the given name.
        """
        return self.nodes.get(node_name, None)

    def get_adjacent_nodes(self, node_name: str):
        """
        Retrieves a node's adjacency node in the workflow from its name.

        Args:
            node_name (str): The name of the node to be retrieved.
        """

        return self.adjacency_list.get(node_name, None)

    def has_edge(self, source_node_name: str, target_node_name: str) -> bool:
        """
        Checks if an edge exists between two nodes.

        Args:
            source_node_name (str): The name of the source node.
            target_node_name (str): The name of the target node.

        Returns:
            bool: True if an edge exists, False otherwise.
        """
        adj = self.adjacency_list.get(source_node_name, [])
        if adj and target_node_name in adj:
            return True
        return False

    def to_dict(self):
        results = []
        for key, values in self.adjacency_list.items():
            for value in values:
                results.append(f"{key} -> {value}")

        workflow_dict = {
            "nodes": [f"{node}" for _, node in self.nodes.items()],
            "edges": results,
            "current_node": self.current_node,
            "progress": str(self.progress),
        }
        return workflow_dict

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
        self, node_name: str, **kwargs
    ) -> Generator[Dict[str, Any], None, None]:
        """
        Executes the node with the given name.

        Args:
            :param node_name: Name of the node to execute.
            :param kwargs: Arbitrary keyword arguments for additional parameters.
            :return: Result of the node execution.
        """

        pass

    @profiler.profile
    def run_through(
        self,
        continue_on_error: bool = False,
        start_node: str = "",
        is_persist: bool = True,
        skipped_nodes: List[str] = [],
    ):
        """
        Runs through the workflow and executes all nodes.

        Args:
            continue_on_error (bool): Whether to continue execution on error.
            start_node (str): The name of the node to start execution from.
            is_persist (bool): Whether to dump the output as a persistent state
            skipped_nodes (List[str]): The list of nodes to skip.
        """
        logger.debug(self.to_dict())
        if start_node:
            current_node_name = start_node
        else:
            current_node_name = self.current_node
        next_nodes = []
        next_nodes.append(current_node_name)

        while len(next_nodes) > 0:
            current_node_name = next_nodes.pop()  # run in dfs order
            if current_node_name in skipped_nodes:
                self.progress[current_node_name].complete()
                self.progress["total"].complete()
                continue
            curr_node = self.get_node(current_node_name)
            self.set_current_node(current_node_name)
            last_output = None
            if current_node_name:
                try:
                    output_generator = self.execute_node(current_node_name)
                    for output in output_generator:
                        last_output = output
                except Exception as e:
                    logger.error(f"Error executing node {current_node_name}: {e}")
                    if continue_on_error:
                        continue
                    else:
                        break
                finally:
                    self.progress[current_node_name].complete()
                    self.progress["total"].complete()
                    input_query = ""
                    if curr_node.get_query():
                        input_query = f"**************QUERY***************: \n {curr_node.get_query()} \n **************MEMORY**************: \n {curr_node.get_memory()}"
                    if is_persist and last_output and self.persist_store:
                        self.persist_store.save_state(
                            self.get_id(), curr_node.get_node_key(), last_output
                        )
                        if input_query:
                            self.persist_store.save_query(
                                self.get_id(), curr_node.get_node_key(), input_query
                            )

                    for next_node_name in reversed(
                        self.get_adjacent_nodes(current_node_name)
                    ):
                        # next_node = self.get_node(next_node_name)
                        next_nodes.append(next_node_name)

    def reset_node(self, node_name: str):
        """
        Args:
            node_name (str): The name of the node to be reset.
        """
        node = self.get_node(node_name)
        curr_progress = self.progress[node_name]
        if curr_progress.completed == 1:
            self.progress["total"].backpedal()
        curr_progress.backpedal()
