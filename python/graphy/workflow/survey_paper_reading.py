from workflow import BaseWorkflow
from models import LLM
from db import PersistentStore
from graph import BaseGraph
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
        persist_store: PersistentStore = None,
    ):
        self.progress = {"total": ProgressInfo()}
        graph = self._create_graph(workflow)
        super().__init__(
            id,
            llm_model,
            parser_model,
            embeddings_model,
            graph,
            persist_store,
        )
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

    def _create_graph(self, workflow):
        graph = BaseGraph()
        # the paper reading has just one single node of PaperInspector
        has_navigator = workflow.get("has_navigator", False)
        if not has_navigator:
            inspector_node = PaperInspector(
                "PaperInspector",
                self.llm_model,
                self.embeddings_model,
                create_inspector_graph(
                    workflow, self.llm_model, self.parser_model, self.embeddings_model
                ),
                self.persist_store,
            )
            graph.add_node(inspector_node)
            self.progress["PaperInspector"] = ProgressInfo(0, 0)
        else:
            # TODO: add navigator node
            pass

        return graph
