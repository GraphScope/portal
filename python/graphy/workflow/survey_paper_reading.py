from workflow import BaseWorkflow
from models import LLM
from db import PersistentStore, JsonFileStore
from graph import BaseGraph, BaseEdge
from graph.nodes.paper_reading_nodes import (
    PaperInspector,
    create_inspector_graph,
    ProgressInfo,
)
from config import (
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
import os
from langchain_core.embeddings import Embeddings
from langchain_core.language_models import BaseLLM


class SurveyPaperReading(BaseWorkflow):
    def __init__(
        self,
        id: str,
        llm_model: LLM,
        parser_model: LLM,
        embeddings_model: Embeddings,
        workflow,
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
        self.progress = {"total": ProgressInfo()}
        persist_store = JsonFileStore(os.path.join(WF_OUTPUT_DIR, self.id))
        graph = self._create_graph(workflow)
        super().__init__(
            id,
            llm_model,
            parser_model,
            embeddings_model,
            graph,
            persist_store,
        )

    def _create_graph(self, workflow):
        """
        Create a graph for the SurveyPaperReading workflow.

        Args:
            workflow (dict): The workflow JSON defining inspectors and navigators.

        Returns:
            BaseGraph: The constructed graph for the workflow.
        """
        graph = BaseGraph()

        # Parse Inspector Nodes
        inspectors = workflow.get("inspectors", [])
        if inspectors:
            for inspector in inspectors:
                inspector_name = inspector["name"]
                inspector_graph_json = inspector["graph"]
                inspector_graph = create_inspector_graph(
                    inspector_graph_json,
                    self.llm_model,
                    self.parser_model,
                    self.embeddings_model,
                )

                inspector_node = PaperInspector(
                    name=inspector_name,
                    llm_model=self.llm_model,
                    embeddings_model=self.embeddings_model,
                    graph=inspector_graph,
                    persist_store=self.persist_store,
                )
                graph.add_node(inspector_node)

            # Parse Navigator Edges
            navigators = workflow.get("navigators", [])
            for navigator in navigators:
                name = navigator.get("name", "")
                source = navigator["source"]
                target = navigator["target"]
                # relation = navigator.get("relation", "MANY_TO_MANY")  # Default relation

                edge = BaseEdge(source=source, target=target, name=name)
                graph.add_edge(edge)

        # Handle single InspectorNode special case
        else:
            inspector_graph = create_inspector_graph(
                workflow,
                self.llm_model,
                self.parser_model,
                self.embeddings_model,
            )

            inspector_node = PaperInspector(
                name="PaperInspector",
                llm_model=self.llm_model,
                embeddings_model=self.embeddings_model,
                graph=inspector_graph,
                persist_store=self.persist_store,
            )
            graph.add_node(inspector_node)

        return graph
