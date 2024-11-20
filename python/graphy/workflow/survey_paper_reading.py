from workflow import BaseWorkflow
from models import LLM, DEFAULT_LLM_MODEL_CONFIG, DefaultEmbedding, set_llm_model
from db import PersistentStore, JsonFileStore
from graph import BaseGraph
from graph.edges.paper_navigate_edge import PaperNavigateEdge
from graph.nodes.paper_reading_nodes import (
    PaperInspector,
    create_inspector_graph,
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
    WF_PDF_DOWNLOAD_DIR,
)

from langchain_core.embeddings import Embeddings
from typing import Type

import time
import os
import logging

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
            WF_PDF_DOWNLOAD_DIR,
        ]:
            if not os.path.exists(folder):
                os.makedirs(folder, exist_ok=True)
        if not persist_store:
            persist_store = JsonFileStore(os.path.join(WF_OUTPUT_DIR, id))
        graph = self._create_graph(
            graph_json,
            llm_model,
            parser_model,
            embeddings_model,
            vectordb,
            persist_store,
        )
        super().__init__(
            id,
            graph,
            persist_store,
        )

    @classmethod
    def from_json(
        cls: Type["SurveyPaperReading"], workflow_json: dict
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
        llm_config = workflow_json.get("llm_model", DEFAULT_LLM_MODEL_CONFIG)
        parser_config = workflow_json.get("parser_model", {})
        embeddings_model = DefaultEmbedding()
        llm_model = set_llm_model(llm_config)
        parser_model = llm_model
        if parser_config:
            parser_model = set_llm_model(parser_config)
        graph_json = workflow_json.get("graph", {})

        if not graph_json:
            raise ValueError("No graph found in the workflow JSON.")

        return cls(
            id,
            llm_model,
            parser_model,
            embeddings_model.chroma_embedding_model(),
            graph_json,
        )

    def _create_graph(
        self,
        graph_json,
        llm_model,
        parser_model,
        embeddings_model,
        vectordb,
        persist_store,
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
                inspector_graph = create_inspector_graph(
                    inspector_graph_json,
                    llm_model,
                    parser_model,
                    embeddings_model,
                )

                inspector_node = PaperInspector(
                    inspector_name,
                    llm_model,
                    embeddings_model,
                    vectordb,
                    inspector_graph,
                    persist_store,
                )
                graph.add_node(inspector_node)

            # Parse Navigator Edges
            navigators = graph_json.get("navigators", [])
            for navigator in navigators:
                name = navigator.get("name", "")
                source = navigator["source"]
                target = navigator["target"]

                edge = PaperNavigateEdge(source=source, target=target, name=name)
                graph.add_edge(edge)

        # Handle single InspectorNode special case
        else:
            inspector_graph = create_inspector_graph(
                graph_json,
                llm_model,
                parser_model,
                embeddings_model,
            )

            inspector_node = PaperInspector(
                "PaperInspector",
                llm_model,
                embeddings_model,
                inspector_graph,
                persist_store,
            )
            graph.add_node(inspector_node)

        logger.info(f"Created graph: {graph}")

        return graph

    def get_progress(self, node_key: str) -> ProgressInfo:
        """
        Get the progress of an inspector node.

        Args:
            node_key (str): The key of the inspector node.

        Returns:
            ProgressInfo: The progress of the node.
        """
        inspector_node = self.graph.get_first_node()
        if inspector_node.node_type != NodeType.INSPECTOR:
            logger.warning("No inspector node found in the graph.")
            return ProgressInfo(0, 0)
        else:
            return inspector_node.get_progress(node_key)
