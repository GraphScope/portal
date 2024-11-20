import torchtext

torchtext.disable_torchtext_deprecation_warning()

import ray

from workflow import ThreadPoolWorkflowExecutor, SurveyPaperReading
from models import set_llm_model, DefaultEmbedding, DEFAULT_LLM_MODEL_CONFIG
from workflow.ray_executor import RayWorkflowExecutor

import json
import logging

logging.basicConfig(level=logging.DEBUG)

if __name__ == "__main__":
    ray.init()
    graph_json = ""
    with open("config/workflow_navigator.json") as f:
        graph_json = json.load(f)

    if graph_json:
        workflow_json = {
            "id": "test_ray",
            "llm_model": DEFAULT_LLM_MODEL_CONFIG,
            "graph": graph_json,
        }
        paper_survey_workflow = SurveyPaperReading.from_json(workflow_json)
        executor = RayWorkflowExecutor(workflow_json, max_workers=4)
        inputs = [
            {"paper_file_path": "inputs/samples/graphrag.pdf"},
            {"paper_file_path": "inputs/samples/huge-sigmod21.pdf"},
            {"paper_file_path": "inputs/samples/relgo-sigmod25.pdf"},
        ]
        executor.execute(inputs)
