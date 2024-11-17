from typing import Dict, Any, Generator
from workflows import AbstractWorkflow
from workflows.abstract_workflow import process_id
from extractor import PaperExtractor
from graph import BaseNode, NodeCache, NodeType, PDFExtractNode, ExtractNode
from typing import Any, Dict, List
from types import new_class
from langchain_core.pydantic_v1 import Field, create_model
from memory import PaperReadingMemoryManager
from memory.llm_memory import VectorDBHierarchy
from db import PersistentStore
from config import (
    WF_STATE_CACHE_KEY,
    WF_STATE_MEMORY_KEY,
    WF_STATE_EXTRACTOR_KEY,
    WF_DATA_DIR,
    WF_OUTPUT_DIR,
    WF_DOWNLOADS_DIR,
    WF_IMAGE_DIR,
    WF_UPLOADS_DIR,
    WF_VECTDB_DIR,
    WF_BRW_CACHE_DIR,
    WF_GRW_CACHE_DIR,
    WF_WEBDATA_DIR,
)

import time
from langchain_core.embeddings import Embeddings
from langchain_core.language_models import BaseLLM

import os
import re
import json
import logging
import copy

logger = logging.getLogger(__name__)


class SurveyPaperReading(AbstractWorkflow):
    def __init__(
        self,
        llm_model: BaseLLM,
        parser_model: BaseLLM,
        embeddings_model: Embeddings,
        paper_file_path: str,
        workflow,
        persist_store: PersistentStore = None,
        max_token_size: int = 8192,
        enable_streaming: bool = False,
    ):
        self.nodes_num = 0

        pdf_extractor = PaperExtractor(paper_file_path)
        base_name = pdf_extractor.get_meta_data().get("title", "").lower()
        if not base_name:  # if not title, use the file name
            base_name = os.path.basename(paper_file_path).split(".")[0]

        super().__init__(
            process_id(base_name),
            llm_model,
            parser_model,
            embeddings_model,
            persist_store,
            max_token_size,
            enable_streaming,
        )
        pdf_extractor.set_img_path(f"{WF_IMAGE_DIR}/{self.id}")
        self.state[self.id][WF_STATE_MEMORY_KEY] = PaperReadingMemoryManager(
            self.llm_model, embeddings_model, self.id, self.max_token_size
        )
        self.state[self.id][WF_STATE_EXTRACTOR_KEY] = pdf_extractor

        for folder in [
            WF_DATA_DIR,
            WF_OUTPUT_DIR,
            WF_DOWNLOADS_DIR,
            WF_IMAGE_DIR,
            WF_UPLOADS_DIR,
            WF_VECTDB_DIR,
            WF_BRW_CACHE_DIR,
            WF_GRW_CACHE_DIR,
            WF_WEBDATA_DIR,
        ]:
            if not os.path.exists(folder):
                os.makedirs(folder, exist_ok=True)

        logger.info(
            f"Starting processing paper: filename={paper_file_path}, id={self.id}"
        )

    def _create_graph(self, workflow):
        nodes_dict = {}
        nodes = []
        edges = []
        start_node = "Paper"
        output_dict = {"nodes": [], "edges": []}

        for node in workflow["nodes"]:
            if node["name"] == start_node:  # node_0 = pdf_extract
                nodes_dict[node["name"]] = PDFExtractNode(
                    self.embeddings_model,
                    start_node,
                )
                output_dict["nodes"].append(
                    {
                        "node_name": "PDFExtractNode",
                        "input": (
                            "[embeddings_model]",
                            start_node,
                        ),
                    }
                )
            else:
                extract_node = ExtractNode.from_dict(
                    node,
                    self.llm_model,
                    self.parser_model,
                    self.max_token_size,
                    self.enable_streaming,
                )
                nodes_dict[node["name"]] = extract_node
                output_dict["nodes"].append(
                    {
                        "node_name": "ExtractNode",
                        "input": (
                            node["name"],
                            "[llm_model]",
                            "[parser_model]",
                            extract_node.json_format,
                            node["query"],
                            "[max_token_size]",
                            "[enable_streaming]",
                            None,
                            extract_node.where,
                        ),
                    }
                )

        for key, value in nodes_dict.items():
            nodes.append(value)
        self.nodes_num = len(nodes)
        for edge in workflow["edges"]:
            edges.append((nodes_dict[edge["source"]], nodes_dict[edge["target"]]))
            if edge["source"] != start_node:
                nodes_dict[edge["target"]].add_dependent_node(edge["source"])

        # Add all nodes
        for node in nodes:
            self.add_node(node)

        # Add all edges
        for from_node, to_node in edges:
            self.add_edge(from_node.name, to_node.name)
            output_dict["edges"].append((from_node.name, to_node.name))

        self.current_node = nodes_dict[start_node].name
        output_dict["start_node"] = self.current_node
        logger.info(json.dumps(self.to_dict(), indent=4))

        return output_dict

    def _load_graph(self, workflow_graph: dict):
        # [{'node_name': str, 'input': (args)}]
        nodes = workflow_graph.get("nodes", [])
        # [(name, name), (name, name), ...]
        edges = workflow_graph.get("edges", [])
        start_node_name = workflow_graph.get("start_node", "")
        start_node = "Paper"

        for node in nodes:
            parsed_input = tuple(
                (
                    getattr(self, item[1:-1])
                    if isinstance(item, str)
                    and item.startswith("[")
                    and item.endswith("]")
                    else item
                )
                for item in node["input"]
            )
            cls_name = node["node_name"]
            if cls_name == "PDFExtractNode":
                self.add_node(PDFExtractNode(*parsed_input))
            elif cls_name == "ExtractNode":
                self.add_node(ExtractNode(*parsed_input))

        self.nodes_num = len(nodes)

        # Add all edges
        for edge in edges:
            self.add_edge(edge[0], edge[1])

        self.current_node = start_node_name
        logger.info(json.dumps(self.to_dict(), indent=4))

    def execute_node(
        self, node_name: str, **kwargs
    ) -> Generator[Dict[str, Any], None, None]:
        """
        Execute a node in the workflow, utilizing persistent results if available.

        Args:
            node_name (str): The name of the node to execute.

        Yields:
            dict: The output of the node execution or persistent results.
        """
        logger.info(f"Starting executing Node: {node_name}")
        start_time = time.time()
        node = self.get_node(node_name)
        # Fetch persistent results if they exist
        persist_results = self.get_persistent_state(node.get_node_key())
        last_output = None
        state = self.state.get(self.id, {})

        if persist_results:
            logger.info(f"Found persistent results for Node: {node_name}.")
            last_output = persist_results
            yield persist_results
        else:
            # Check if precursor nodes need to be executed first
            precursor_nodes = self.get_precursor_nodes(node_name)
            if precursor_nodes:
                for precursor_node in precursor_nodes:
                    n = self.get_node(precursor_node)
            if node:
                node.pre_execute(state)
                try:
                    for output in node.execute(state):
                        last_output = output
                        yield output
                except StopIteration:
                    logger.debug(
                        f"No more streaming results for node: {node.get_node_key()}"
                    )

        if last_output:
            node.post_execute(last_output)
            node_caches: dict = state.get(WF_STATE_CACHE_KEY, {})
            node_key = node.get_node_key()
            node_cache: NodeCache = node_caches.setdefault(
                node_key, NodeCache(node_key)
            )
            if node_cache:
                node_cache.add_chat_cache("", last_output)

            # set the current node to the executed node
            self.set_current_node(node_name)

        end_time = time.time()
        logger.info(
            f"Completed executing node: {node_name} in {end_time - start_time} seconds"
        )
