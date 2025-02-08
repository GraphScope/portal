from apps.paper_reading import SurveyPaperReading
from models import set_llm_model, DEFAULT_LLM_MODEL_CONFIG, DefaultEmbedding
from workflow.multiproc_executor import MultiprocWorkflowExecutor

import argparse
import json
import os
import logging
import multiprocessing

os.environ["TOKENIZERS_PARALLELISM"] = "false"


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


logging.basicConfig(
    level=logging.INFO,
    format="[%(asctime)s] {%(pathname)s:%(lineno)d} %(levelname)s - %(message)s",
    handlers=[logging.StreamHandler()],
)

if __name__ == "__main__":
    multiprocessing.set_start_method("spawn")
    args = parse_arguments()
    input_folder = args.input_folder
    max_workers = args.max_workers
    max_inspectors = args.max_inspectors

    with open(args.workflow, "r") as f:
        workflow_json = json.load(f)
    if workflow_json:
        # dummy code to trigger downloading the embedding model if not present
        embedding_model = DefaultEmbedding()
        embedding_model.__call__(["dummy"])
        fixed_workflow_json = fix_workflow(workflow_json)

        executor = MultiprocWorkflowExecutor(
            fixed_workflow_json, SurveyPaperReading, max_workers, max_inspectors
        )
        inputs = list_pdf_inputs(input_folder)
        executor.execute(inputs)
