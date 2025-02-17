from graph.types import DataType, DataGenerator
from graph.nodes.chain_node import PaperDimensionExtractNode
from graph.nodes.dag_node import DAGInspectorNode, ProgressInfo
from graph.nodes.pdf_extract_node import PDFExtractNode
from memory.llm_memory import PaperReadingMemoryManager
from models import LLM
from config import (
    WF_STATE_MEMORY_KEY,
    WF_STATE_EXTRACTOR_KEY,
    WF_STATE_CACHE_KEY,
    WF_IMAGE_DIR,
    WF_OUTPUT_DIR,
)
from extractor import PaperExtractor
from db import PersistentStore
from utils.profiler import profiler
from utils.cryptography import id_generator

from langchain_core.pydantic_v1 import BaseModel, Field, create_model
from langchain_core.language_models.llms import BaseLLM
from langchain_core.embeddings import Embeddings
from typing import Any, Dict, List

import os
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
        id_name = f"{id_generator(base_name)}_{id_name}"

    return id_name


def change_path(original_path, new_prefix=WF_OUTPUT_DIR) -> str:
    if not original_path:
        return None
    # The suffix that the old prefix ends with
    suffix = "/graphyourdata/output"

    # Find the index of the suffix in the original path
    suffix_index = original_path.rfind(suffix)

    # If the suffix is found, replace the old prefix with the new prefix
    if suffix_index != -1:
        # Calculate the start index of the old prefix
        start_index = suffix_index + len(suffix)

        # Replace the old prefix with the new prefix
        new_path = new_prefix + original_path[start_index:]
    else:
        # If the suffix is not found, leave the path unchanged
        new_path = original_path
    return new_path


class PaperInspector(DAGInspectorNode):
    def __init__(
        self,
        name: str,
        graph,
        llm_model: LLM,
        embeddings_model: Embeddings,
        vectordb,
        persist_store: PersistentStore,
    ):
        super().__init__(
            name,
            graph,
            llm_model,
            embeddings_model,
            vectordb,
            persist_store,
        )

    @classmethod
    def from_dict(
        cls,
        name: str,
        graph_dict: Dict[str, Any],
        llm_model: BaseLLM,
        parser_model: BaseLLM,
        embeddings_model: Embeddings,
        vectordb,
        persist_store: PersistentStore,
    ) -> "PaperInspector":
        from graph.edges.base_edge import BaseEdge
        from graph.base_graph import BaseGraph

        nodes_dict = {}
        nodes = []
        edges = []
        start_node = "Paper"

        if "nodes" in graph_dict:
            for node in graph_dict["nodes"]:
                if node["name"] == start_node:
                    nodes_dict[node["name"]] = PDFExtractNode(
                        embeddings_model, start_node
                    )
                else:
                    extract_node = PaperDimensionExtractNode.from_dict(
                        node,
                        llm_model.model,
                        parser_model.model,
                        llm_model.context_size,
                        llm_model.enable_streaming,
                    )
                    nodes_dict[node["name"]] = extract_node

            for _, value in nodes_dict.items():
                nodes.append(value)

        if "edges" in graph_dict:
            for edge in graph_dict["edges"]:
                edges.append(BaseEdge(edge["source"], edge["target"]))
                if edge["source"] != start_node:
                    nodes_dict[edge["target"]].add_dependent_node(edge["source"])

        graph = BaseGraph()
        # Add all nodes
        for node in nodes:
            graph.add_node(node)

        # Add all edges
        for edge in edges:
            graph.add_edge(edge)

        return cls(name, graph, llm_model, embeddings_model, vectordb, persist_store)

    def pre_execute(self, state: Dict[str, Any], input: DataType) -> DataType | None:
        paper_file_path = input.get("paper_file_path", None)
        paper_meta_path = input.get("paper_meta_path", None)
        paper_file_path = change_path(paper_file_path)
        paper_meta_path = change_path(paper_meta_path)
        if not paper_file_path:
            logger.warning("No 'paper_file_path' provided in input data.")
            logger.info(f"Try to create fake extractor from meta: {paper_meta_path}")
            if not paper_meta_path:
                return None

        data_id = None
        # Initialize the paper extractor and other components
        pdf_extractor = PaperExtractor(paper_file_path, meta_path=paper_meta_path)
        if not paper_file_path and not pdf_extractor.fake_extractor:
            return None

        base_name = pdf_extractor.get_meta_data().get("title", "").lower()
        if not base_name:  # If no title, fallback to filename
            if paper_file_path:
                base_name = os.path.basename(paper_file_path).split(".")[0]
            else:
                base_name = os.path.basename(paper_meta_path).split(".")[0]
        data_id = process_id(base_name)
        pdf_extractor.set_img_path(f"{WF_IMAGE_DIR}/{data_id}")

        if data_id:
            logger.info(
                f"Pre Executing paper: {paper_file_path} with meta: {paper_meta_path}"
            )
            # create necessary state for the current `data_id`
            state[data_id] = {
                WF_STATE_CACHE_KEY: {},
                WF_STATE_EXTRACTOR_KEY: pdf_extractor,
                WF_STATE_MEMORY_KEY: PaperReadingMemoryManager(
                    self.llm_model.model,
                    self.embeddings_model,
                    data_id,
                    self.llm_model.context_size,
                    self.vectordb,
                ),
            }

        return {"data_id": data_id}

    def post_execute(self, state: Dict[str, Any], output: Dict[str, Any] = None):
        data_id = output.get("data", {}).get("data_id", "")
        logger.info(f"Post Executing paper with id: {data_id}")
        if data_id and data_id in state:
            self.persist_store.save_state(data_id, "_DONE", {"done": True})
            # clean state for the current `data_id`
            state[data_id][WF_STATE_CACHE_KEY].clear()
            state[data_id][WF_STATE_MEMORY_KEY].clear_memory()
            state[data_id][WF_STATE_MEMORY_KEY].close()
            state.pop(data_id)

    @profiler.profile(name="PaperInspectorExecution")
    def execute(
        self, state: Dict[str, Any], input: DataGenerator = None
    ) -> DataGenerator:
        """
        Executes the node's logic.

        Args:
            state (Dict[str, Any]): The input state for the node.
            input (DataGenerator): The input data generator.

        Returns:
            DataGenerator: The output data generator from the node.
        """
        logger.info(f"================= START INSPECT ==============")

        # Iterate through the input data
        for input_data in input:
            try:
                paper_data = self._process_input_data(state, input_data)
                if paper_data:
                    yield paper_data
            except Exception as e:
                logger.error(f"Error processing the paper: {e}")
                # clean state and continue with next input data
                if paper_data:
                    self.post_execute(state, paper_data)

    def _process_input_data(
        self, state: Dict[str, Any], input_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Processes each input data, including pre-execution, data extraction, and running through the nodes.

        Args:
            state (Dict[str, Any]): The current state of the workflow.
            input_data (Dict[str, Any]): The input data to be processed.

        Returns:
            Dict[str, Any]: The processed paper data, or None if not processed successfully.
        """
        parent_id = input_data.get("parent_id", None)
        edge_name = input_data.get("edge_name", "Navigator")
        paper_file_path = input_data.get("paper_file_path", None)

        pre_result = self.pre_execute(state, input_data)
        data_id = pre_result.get("data_id", None) if pre_result else None

        if not data_id:
            logger.info(f"Unable to identify `data_id` for {paper_file_path}.")
            return None

        # Handle paper processing logic
        if not paper_file_path:
            # If there's no paper file path, we run through the node with skipped nodes
            self.run_through(data_id, None, parent_id, edge_name, skipped_nodes=["*"])
        else:
            # Otherwise, process the paper using the provided file path
            self.run_through(data_id, state[data_id], parent_id, edge_name)

        first_node_name = self.graph.get_first_node_name()
        paper_data = self.persist_store.get_state(data_id, first_node_name)

        # Post-execute actions if the total progress is done
        if self.progress["total"].is_done():
            if paper_data:
                self.post_execute(state, paper_data)

        return paper_data

    def __repr__(self):
        return f"Node: {self.name}, Type: {self.node_type}, Graph: {self.graph}"
