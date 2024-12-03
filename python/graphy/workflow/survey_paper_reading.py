from workflow import BaseWorkflow
from models import LLM, DEFAULT_LLM_MODEL_CONFIG, MyEmbedding, set_llm_model
from db import PersistentStore, JsonFileStore
from graph import BaseGraph
from graph.edges.paper_navigate_edge import PaperNavigateEdge
from graph.nodes.paper_reading_nodes import (
    PaperInspector,
    ProgressInfo,
)
from graph.nodes.base_node import NodeType
from utils.profiler import profiler
from config import (
    WF_STATE_CACHE_KEY,
    WF_OUTPUT_DIR,
    WF_DOWNLOADS_DIR,
    WF_IMAGE_DIR,
    WF_UPLOADS_DIR,
    WF_VECTDB_DIR,
    WF_WEBDATA_DIR,
)

from langchain_core.embeddings import Embeddings
from typing import Type

import time
import os
import logging
import chromadb

logger = logging.getLogger(__name__)


class SurveyPaperReading(BaseWorkflow):
    def __init__(
        self,
        id: str,
        llm_model: LLM,
        parser_model: LLM,
        embeddings_model: Embeddings,
        vectordb,
        graph_json: dict,
        persist_store=None,
    ):
        for folder in [
            WF_OUTPUT_DIR,
            WF_DOWNLOADS_DIR,
            WF_IMAGE_DIR,
            WF_UPLOADS_DIR,
            WF_VECTDB_DIR,
            WF_WEBDATA_DIR,
        ]:
            if not os.path.exists(folder):
                os.makedirs(folder, exist_ok=True)
        if not persist_store:
            persist_store = JsonFileStore(os.path.join(WF_OUTPUT_DIR, id))

        if "graph" in graph_json:
            graph_json = graph_json["graph"]

        graph = self._create_graph(
            graph_json,
            llm_model,
            parser_model,
            embeddings_model,
            vectordb,
            persist_store,
            id,
        )

        super().__init__(
            id,
            graph,
            persist_store,
        )

    @classmethod
    def from_dict(
        cls: Type["SurveyPaperReading"], workflow_json: dict, persist_store=None
    ) -> "SurveyPaperReading":
        """
        Create a SurveyPaperReading workflow from a JSON configuration.

        Args:
            workflow_json (dict): The JSON representation of the workflow.

        Raises:
            ValueError: If no graph field is found in the workflow_json

        Returns:
            SurveyPaperReading: An instance of the workflow.

        Example `workflow_json`:
            {
                "id": "example_workflow",
                "llm_config": {
                    "model_name": "gpt-4",
                    "base_url": "https://api.openai.com/v1",
                    "api_key": "your_api_key_here",
                },
                "graph": {
                    "inspectors": [
                        {
                            "name": "PaperInspector",
                            "graph": {
                                "nodes": [
                                    {
                                        "name": "Paper",
                                        "node_type": "BASE",
                                    },
                                    {
                                        "name": "Background",
                                        "node_type": "INSPECTOR",
                                        "query": "**Question**: What problem does this paper address?",
                                        "extract_from": ["1"],
                                        "output_schema": {
                                            "type": "single",
                                            "description": "Description of the problem addressed in the paper.",
                                            "item": [
                                                {"name": "problem", "type": "string", "description": "The problem addressed."},
                                                {"name": "importance", "type": "string", "description": "Why the problem matters."},
                                            ],
                                        },
                                    },
                                    {
                                        "name": "Solution",
                                        "node_type": "INSPECTOR",
                                        "query": "**Question**: What solutions are proposed in this paper?",
                                        "extract_from": [],
                                        "output_schema": {
                                            "type": "array",
                                            "description": "Proposed solutions in the paper.",
                                            "item": [
                                                {"name": "name", "type": "string", "description": "Name of the solution."},
                                                {"name": "details", "type": "string", "description": "Detailed description."},
                                            ],
                                        },
                                    },
                                ],
                                "edges": [
                                    {"source": "Paper", "target": "Background", },
                                    {"source": "Background", "target": "Solution"},
                                ],
                            }
                        }
                    ],
                      "navigators": [
                        {
                        "name": "Reference",
                        "source": "PaperInspector",
                        "target": "PaperInspector"
                        }
                    ]
                },
            }
        """
        id = workflow_json.get("id", f"survey_paper_reading_{int(time.time())}")
        llm_config = workflow_json.get("llm_config", DEFAULT_LLM_MODEL_CONFIG)
        parser_config = workflow_json.get("parser_config", {})
        embeddings_model = MyEmbedding()
        llm_model = set_llm_model(llm_config)
        parser_model = llm_model
        if parser_config:
            parser_model = set_llm_model(parser_config)
        graph_json = workflow_json.get("graph", {})

        vectordb = chromadb.PersistentClient(path=WF_VECTDB_DIR)

        if not graph_json:
            raise ValueError("No graph found in the workflow JSON.")

        return cls(
            id,
            llm_model,
            parser_model,
            embeddings_model,
            vectordb,
            graph_json,
            persist_store,
        )

    def _create_graph(
        self,
        graph_json,
        llm_model,
        parser_model,
        embeddings_model,
        vectordb,
        persist_store,
        id,
    ):
        """
        Create a graph for the SurveyPaperReading workflow.

        Args:
            workflow (dict): The workflow JSON defining inspectors and navigators.

        Returns:
            BaseGraph: The constructed graph for the workflow.
        """
        graph = BaseGraph()

        # Parse Inspector Nodes
        inspectors = graph_json.get("inspectors", [])
        if inspectors:
            for inspector in inspectors:
                inspector_name = inspector["name"]
                inspector_graph_json = inspector["graph"]

                inspector_node = PaperInspector.from_dict(
                    inspector_name,
                    inspector_graph_json,
                    llm_model,
                    parser_model,
                    embeddings_model,
                    vectordb,
                    persist_store,
                )
                graph.add_node(inspector_node)

            # Parse Navigator Edges
            navigators = graph_json.get("navigators", [])
            for navigator in navigators:
                name = navigator.get("name", "")
                source = navigator["source"]
                target = navigator["target"]
                paper_download_dir = os.path.join(WF_OUTPUT_DIR, id, "navigator")

                edge = PaperNavigateEdge(
                    source=source,
                    target=target,
                    name=name,
                    persist_store=persist_store,
                    paper_download_dir=paper_download_dir,
                )
                graph.add_edge(edge)

        # Handle single InspectorNode special case
        else:
            inspector_node = PaperInspector.from_dict(
                "PaperInspector",
                graph_json,
                llm_model,
                parser_model,
                embeddings_model,
                vectordb,
                persist_store,
            )
            graph.add_node(inspector_node)

        logger.info(f"Created graph: {graph}")

        return graph

    def get_progress(self, node_key: str) -> dict:
        """
        Get the progress of an inspector node.

        Args:
            node_key (str): The key of the inspector node.

        Returns:
            A dict of ProgressInfo: The progress of all nodes within the node.
        """
        node = self.graph.get_node(node_key)
        if node.node_type == NodeType.INSPECTOR:
            results = {}
            for inner_node in node.graph.get_node_names():
                results[inner_node] = node.get_progress(inner_node)
            return results
        else:
            return {node_key: node.get_progress()}
