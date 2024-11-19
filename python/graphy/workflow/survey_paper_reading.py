from workflow import BaseWorkflow
from models import LLM
from db import PersistentStore, JsonFileStore
from graph import BaseGraph, BaseEdge
from graph.nodes.paper_reading_nodes import (
    PaperInspector,
    create_inspector_graph,
    ProgressInfo,
)
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
        workflow_dict,
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
        persist_store = JsonFileStore(os.path.join(WF_OUTPUT_DIR, id))
        graph = self._create_graph(
            workflow_dict, llm_model, parser_model, embeddings_model, persist_store
        )
        super().__init__(
            id,
            graph,
            persist_store,
        )
        self.state["processed_data"] = set(persist_store.get_total_data())

    def _create_graph(
        self, workflow_dict, llm_model, parser_model, embeddings_model, persist_store
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
        inspectors = workflow_dict.get("inspectors", [])
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
                    inspector_graph,
                    persist_store,
                )
                graph.add_node(inspector_node)

            # Parse Navigator Edges
            navigators = workflow_dict.get("navigators", [])
            for navigator in navigators:
                name = navigator.get("name", "")
                source = navigator["source"]
                target = navigator["target"]

                edge = BaseEdge(source=source, target=target, name=name)
                graph.add_edge(edge)

        # Handle single InspectorNode special case
        else:
            inspector_graph = create_inspector_graph(
                workflow_dict,
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
