from typing import Dict, Any, Generator
from workflows import AbstractWorkflow
from workflows.abstract_workflow import process_id
from extractor import PaperExtractor
from nodes import BaseNode, NodeCache, NodeType, PDFExtractNode, ExtractNode
from typing import Any, Dict, List
from types import new_class
from langchain_core.pydantic_v1 import Field, create_model
from memory import PaperReadingMemoryManager
from memory.llm_memory import VectorDBHierarchy
from db import PersistentStore
from config import (
    WF_STATE_CACHE_KEY,
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
        super().__init__(
            llm_model,
            parser_model,
            embeddings_model,
            persist_store,
            max_token_size,
            enable_streaming,
        )
        self.nodes_num = 0

        self.pdf_extractor = PaperExtractor(paper_file_path)
        base_name = self.pdf_extractor.get_meta_data().get("title", "").lower()
        if not base_name:  # if not title, use the file name
            base_name = os.path.basename(paper_file_path).split(".")[0]
        self.id = process_id(base_name)
        self.pdf_extractor.set_img_path(f"{WF_IMAGE_DIR}/{self.id}")

        # self._create_graph(paper_file_path, embeddings_model, workflow)
        self.memory_manager = PaperReadingMemoryManager(
            self.llm_model, embeddings_model, self.id, self.max_token_size
        )
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
                    self.memory_manager,
                    self.pdf_extractor,
                    start_node,
                )
                output_dict["nodes"].append(
                    {
                        "node_name": "PDFExtractNode",
                        "input": (
                            "[embeddings_model]",
                            "[memory_manager]",
                            "[pdf_extractor]",
                            start_node,
                        ),
                    }
                )
            else:
                items = {}
                for item in node["output_schema"]["item"]:
                    if item["type"] == "string":
                        items[item["name"]] = (
                            str,
                            Field(description=item["description"]),
                        )
                    elif item["type"] == "int":
                        items[item["name"]] = (
                            int,
                            Field(description=item["description"]),
                        )
                    else:
                        pass
                        # ERROR
                ItemClass = create_model(node["name"] + "ItemClass", **items)
                if node["output_schema"]["type"] == "array":
                    item_type = {
                        "data": (
                            List[ItemClass],
                            Field(description=node["output_schema"]["description"]),
                        ),
                    }
                elif node["output_schema"]["type"] == "single":
                    item_type = {
                        "data": (
                            ItemClass,
                            Field(description=node["output_schema"]["description"]),
                        ),
                    }
                else:
                    pass
                    # ERROR
                NodeClass = create_model(node["name"] + "NodeClass", **item_type)

                if not node["extract_from"]:
                    where = None
                else:
                    condition_dict = {}
                    # remove '' in []
                    exact_constraints = [
                        s for s in node["extract_from"].get("exact", []) if s
                    ]
                    match_constraints = [
                        s for s in node["extract_from"].get("match", []) if s
                    ]

                    exact_constraints_num = len(exact_constraints)
                    match_constraints_num = len(match_constraints)

                    if exact_constraints_num > 0:
                        if match_constraints_num == 0:
                            where = {
                                "conditions": {
                                    "section": {
                                        "$in": ["paper_meta", "abstract"]
                                        + exact_constraints
                                    }
                                },
                                "return": "all",
                                "result_num": -1,
                                "subquery": "{slot}",
                            }
                        else:
                            condition_dict["$or"] = []
                    else:
                        if match_constraints_num == 0:
                            where = None
                        else:
                            condition_dict["$or"] = []

                    if "$or" in condition_dict:
                        if exact_constraints_num > 0:
                            condition_dict["$or"].append(
                                {
                                    "section": {
                                        "$in": ["paper_meta", "abstract"]
                                        + exact_constraints
                                    }
                                }
                            )
                        if match_constraints_num > 0:
                            for match_constraint in match_constraints:
                                condition_dict["$or"].append(
                                    {
                                        "sec_name": {
                                            "$in": {
                                                "conditions": {
                                                    "type": VectorDBHierarchy.FirstLayer.value
                                                },
                                                "return": "documents",
                                                "subquery": match_constraint,
                                                "result_num": 1,
                                            }
                                        }
                                    }
                                )

                        if len(condition_dict["$or"]) == 1:
                            condition_dict = condition_dict["$or"][0]
                        where = {
                            "conditions": condition_dict,
                            "return": "all",
                            "result_num": -1,
                            "subquery": "{slot}",
                        }

                nodes_dict[node["name"]] = ExtractNode(
                    node["name"],
                    self.llm_model,
                    self.parser_model,
                    NodeClass,
                    node["query"],
                    self.memory_manager,
                    self.max_token_size,
                    self.enable_streaming,
                    None,
                    where,
                )
                output_dict["nodes"].append(
                    {
                        "node_name": "ExtractNode",
                        "input": (
                            node["name"],
                            "[llm_model]",
                            "[parser_model]",
                            NodeClass,
                            node["query"],
                            "[memory_manager]",
                            "[max_token_size]",
                            "[enable_streaming]",
                            None,
                            where,
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
                node.pre_execute(self.state)
                try:
                    for output in node.execute(self.state):
                        last_output = output
                        yield output
                except StopIteration:
                    logger.debug(
                        f"No more streaming results for node: {node.get_node_key()}"
                    )

        if last_output:
            node.post_execute(last_output)
            node_caches: dict = self.state.get(WF_STATE_CACHE_KEY, {})
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
