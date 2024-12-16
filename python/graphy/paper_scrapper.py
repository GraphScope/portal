import ray

from apps.paper_reading import SurveyPaperReading
from workflow import ThreadPoolWorkflowExecutor
from models import set_llm_model, DEFAULT_LLM_MODEL_CONFIG
from workflow.ray_executor import RayWorkflowExecutor

import argparse
import json
import os
import logging


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
    except NotADirectoryError:
        inputs.append({"paper_file_path": folder_path})
    except Exception as e:
        print(f"An error occurred: {e}")

    return inputs


def parse_arguments():
    """
    Parse command-line arguments.

    Returns:
        argparse.Namespace: Parsed command-line arguments.
    """
    parser = argparse.ArgumentParser(
        description="Run workflow with specified configurations."
    )
    parser.add_argument(
        "input_folder",
        type=str,
        help="Path to the input folder containing workflow files.",
    )
    parser.add_argument(
        "-f",
        "--workflow",
        type=str,
        default="config/workflow.json",
        help="Path to the workflow configuration file (default: config/workflow.json).",
    )
    parser.add_argument(
        "-w",
        "--max-workers",
        type=int,
        default=4,
        help="Maximum number of parallel workers (default: 4).",
    )
    parser.add_argument(
        "-i",
        "--max-inspectors",
        type=int,
        default=100,
        help="Maximum number of inspectors allowed (default: 100).",
    )
    parser.add_argument(
        "-t",
        "--tmp-dir",
        type=str,
        help="The temporary directory for ray.",
    )
    return parser.parse_args()


def fix_workflow(workflow_json):
    fixed_workflow_json = {}
    if "graph" not in workflow_json:
        fixed_workflow_json["graph"] = workflow_json
    else:
        fixed_workflow_json = workflow_json
    if "id" not in fixed_workflow_json:
        fixed_workflow_json["id"] = "test_workflow"
    if "llm_config" not in fixed_workflow_json:
        fixed_workflow_json["llm_config"] = DEFAULT_LLM_MODEL_CONFIG
    return fixed_workflow_json


if __name__ == "__main__":
    args = parse_arguments()
    input_folder = args.input_folder
    max_workers = args.max_workers
    max_inspectors = args.max_inspectors
    with open(args.workflow, "r") as f:
        workflow_json = json.load(f)
    if workflow_json:
        if args.tmp_dir:
            ray.init(
                logging_level=logging.INFO,
                logging_format="%(asctime)s %(levelname)s %(message)s",
                _temp_dir=args.tmp_dir,
            )
        else:
            ray.init(
                logging_level=logging.INFO,
                logging_format="%(asctime)s %(levelname)s %(message)s",
            )
        fixed_workflow_json = fix_workflow(workflow_json)
        executor = RayWorkflowExecutor(
            fixed_workflow_json, SurveyPaperReading, max_workers, max_inspectors
        )
        inputs = list_pdf_inputs(input_folder)
        executor.execute(inputs)
