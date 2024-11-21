import torchtext

torchtext.disable_torchtext_deprecation_warning()

import ray

from workflow import ThreadPoolWorkflowExecutor, SurveyPaperReading
from models import set_llm_model, DefaultEmbedding, DEFAULT_LLM_MODEL_CONFIG
from workflow.ray_executor import RayWorkflowExecutor

import json
import logging
import sys
import os

logging.basicConfig(level=logging.DEBUG)


def list_pdf_inputs(folder_path: str):
    """
    List all PDF files in the given folder and format them into an input list structure.

    Args:
        folder_path (str): Path to the folder containing PDF files.

    Returns:
        List[dict]: A list of dictionaries with "paper_file_path" as keys and file paths as values.
    """
    inputs = []
    try:
        for file_name in os.listdir(folder_path):
            if file_name.endswith(".pdf"):
                inputs.append({"paper_file_path": os.path.join(folder_path, file_name)})
    except FileNotFoundError:
        print(f"Error: Folder '{folder_path}' does not exist.")
    except Exception as e:
        print(f"An error occurred: {e}")

    return inputs


if __name__ == "__main__":
    input_folder = sys.argv[1]
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
        executor = RayWorkflowExecutor(
            workflow_json, max_workers=8, max_inspectors=10000
        )
        inputs = list_pdf_inputs(input_folder)
        executor.execute(inputs)
