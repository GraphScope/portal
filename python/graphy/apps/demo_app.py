import torchtext

torchtext.disable_torchtext_deprecation_warning()

from workflow import SurveyPaperReading, ThreadPoolWorkflowExecutor
from graph.nodes.paper_reading_nodes import ProgressInfo
from config import (
    WF_UPLOADS_DIR,
    WF_OUTPUT_DIR,
    WF_DATA_DIR,
)
from utils.data_extractor import (
    GraphBuilder,
    hash_id,
)
from utils.cryptography import encrypt_key, decrypt_key
from utils.text_clustering import KMeansClustering, OnlineClustering
from utils.profiler import profiler
from db import JsonFileStore
from graph.nodes.chain_node import BaseChainNode
from graph.nodes.paper_reading_nodes import NameDesc
from apps.text_generator import ReportGenerator
from models import set_llm_model, DefaultEmbedding, DEFAULT_LLM_MODEL_CONFIG

from threading import Thread
from flask import Flask, request, jsonify, send_file
from werkzeug.utils import secure_filename
from typing import Dict
from langchain_core.embeddings import Embeddings
from langchain_core.language_models import BaseLLM
from chromadb.utils import embedding_functions
from flask_cors import CORS
from enum import Enum

import os
import traceback
import json
import zipfile
import uuid
import shutil
import logging
import copy

logger = logging.getLogger(__name__)

DEFAULT_DATASET_ID = "0"


def list_files_in_folder(folder_path):
    files = []
    if os.path.isdir(folder_path):
        for root, _dir, filenames in os.walk(folder_path):
            for filename in filenames:
                if filename.endswith(".pdf"):
                    files.append(os.path.join(root, filename))
    return files


def create_json_response(result):
    # Initialize with a default status and empty data
    json_data = {"success": True}
    json_data["data"] = result

    # Convert the final dictionary to a JSON string
    return json_data


def create_error_response(msg: str):
    json_data = {"success": False, "message": msg}
    return json_data


class STATUS(Enum):
    INITIALIZED = "initialized"
    WAITING_WORKFLOW_CONFIG = "waiting_workflow_config"
    WAITING_EXTRACT = "waiting_extract"
    EXTRACTING = "extracting"
    WAITING_CLUSTER = "waiting_cluster"
    WAITING_SUMMARY = "waiting_summary"
    SUMMARIZED = "summarized"

    # Method to convert Enum to JSON
    @classmethod
    def to_json(self):
        return self.value

    # Method to create Enum from JSON
    @classmethod
    def from_json(cls, value):
        return cls(value)

    def __lt__(self, other):
        if isinstance(other, STATUS):
            return list(STATUS).index(self) < list(STATUS).index(other)
        return NotImplemented

    def __le__(self, other):
        if isinstance(other, STATUS):
            return list(STATUS).index(self) <= list(STATUS).index(other)
        return NotImplemented

    def __gt__(self, other):
        if isinstance(other, STATUS):
            return list(STATUS).index(self) > list(STATUS).index(other)
        return NotImplemented

    def __ge__(self, other):
        if isinstance(other, STATUS):
            return list(STATUS).index(self) >= list(STATUS).index(other)
        return NotImplemented


class DemoApp:
    def __init__(
        self,
        name,
        upload_folder=WF_UPLOADS_DIR,
        output_folder=WF_OUTPUT_DIR,
    ):
        self.name = name
        self.app = Flask(self.name)
        # allow cross-domain access
        CORS(self.app)
        # a default embedding model, TODO may be configured
        self.embedding_model = DefaultEmbedding()
        # a default llm model, TODO may be configured
        self.llm = set_llm_model(DEFAULT_LLM_MODEL_CONFIG)
        # Each dataset has a persist store
        self.persist_stores = {}
        self.cache = {}
        self.configure_app(upload_folder, output_folder)
        self.dataset()
        self.llm_config()
        self.workflow()
        self.llm_report()

        self.text_generator = ReportGenerator(self.llm.model)

    def get_persist_store(self, dataset_id):
        persist_store = self.persist_stores.setdefault(
            dataset_id,
            JsonFileStore(os.path.join(self.app.config["OUTPUT_FOLDER"], dataset_id)),
        )
        persist_store.use("")
        return persist_store

    def init_metadata(self, dataset_id):
        metadata = {}
        persist_store = self.get_persist_store(dataset_id)
        metadata["id"] = dataset_id
        metadata["config"] = {}
        metadata["entity"] = []
        metadata["status"] = STATUS.INITIALIZED.value
        persist_store.save_state("", "metadata", metadata)

    def set_meta_schema(self, dataset_id, schema):
        persist_store = self.get_persist_store(dataset_id)
        metadata = persist_store.get_state("", "metadata")
        metadata["schema"] = schema
        persist_store.save_state("", "metadata", metadata)

    def get_meta_schema(self, dataset_id):
        persist_store = self.get_persist_store(dataset_id)
        metadata = persist_store.get_state("", "metadata")
        return metadata.get("schema", {})

    def set_meta_config(self, dataset_id, config):
        persist_store = self.get_persist_store(dataset_id)
        metadata = persist_store.get_state("", "metadata")
        if config:
            self.set_llm_model(dataset_id, config)
            if "api_key" in config:
                config["api_key"] = encrypt_key(config["api_key"])
        metadata["config"] = config
        persist_store.save_state("", "metadata", metadata)

    def get_meta_config(self, dataset_id):
        persist_store = self.get_persist_store(dataset_id)
        metadata = persist_store.get_state("", "metadata")
        llm_config = metadata.get("config", {})
        # must initialize the llm model if it is not configured yet
        if llm_config:
            self.set_llm_model(dataset_id, llm_config, initialize=False)
        return llm_config

    def set_meta_interactive_info(self, dataset_id, graph_id):
        persist_store = self.get_persist_store(dataset_id)
        metadata = persist_store.get_state("", "metadata")
        metadata["interactive_graph_id"] = graph_id
        persist_store.save_state("", "metadata", metadata)

    def add_meta_entities(self, dataset_id, entities):
        persist_store = self.get_persist_store(dataset_id)
        metadata = persist_store.get_state("", "metadata")
        if "entity" not in metadata:
            metadata["entity"] = []
        unique_entities = set(metadata["entity"])
        unique_entities.update(entities)
        metadata["entity"] = list(unique_entities)
        persist_store.save_state("", "metadata", metadata)

    def set_status(self, dataset_id, status):
        persist_store = self.get_persist_store(dataset_id)
        metadata = persist_store.get_state("", "metadata")
        metadata["status"] = status.value
        persist_store.save_state("", "metadata", metadata)

    def get_status(self, dataset_id):
        persist_store = self.get_persist_store(dataset_id)
        metadata = persist_store.get_state("", "metadata")
        return metadata.get("status", STATUS.INITIALIZED.value)

    def set_metadata(self, dataset_id, value):
        persist_store = self.get_persist_store(dataset_id)
        llm_config = value.get("config", {})
        if llm_config:
            self.set_llm_model(dataset_id, llm_config)
            if "api_key" in llm_config:
                llm_config["api_key"] = encrypt_key(llm_config["api_key"])
        persist_store.save_state("", "metadata", value)

    def get_metadata(self, dataset_id):
        persist_store = self.get_persist_store(dataset_id)
        metadata = persist_store.get_state("", "metadata")
        llm_config = metadata.get("config", {})
        # must initialize the llm model if it is not configured yet
        if llm_config:
            self.set_llm_model(dataset_id, llm_config, initialize=False)

        return metadata

    def set_cache(self, dataset_id, key, value):
        self.cache.setdefault(dataset_id, {})
        self.cache[dataset_id][key] = value

    def get_cache(self, dataset_id, key):
        if dataset_id in self.cache:
            return self.cache[dataset_id].get(key)
        return None

    def get_workflow_node_names(self, dataset_id):
        if dataset_id == DEFAULT_DATASET_ID:
            return ["Challenge", "Solution", "Task"]
        node_names = []
        if dataset_id in self.cache:
            workflow = self.cache[dataset_id].get("workflow", None)
            if workflow:
                node_names = workflow.graph.get_node_names()
        return node_names

    def set_llm_model(self, dataset_id, llm_config, initialize=True):
        if initialize:
            llm = set_llm_model(llm_config)
            self.set_cache(dataset_id, "llm_model", llm)
        else:
            cache = self.cache.get(dataset_id, {})
            if cache and not "llm_model" in cache:
                llm_config = copy.deepcopy(llm_config)
                if "api_key" in llm_config:
                    llm_config["api_key"] = decrypt_key(llm_config["api_key"])
                llm = set_llm_model(llm_config)
                self.set_cache(dataset_id, "llm_model", llm)

    def set_workflow(self, dataset_id, workflow_dict):
        persist_store = self.get_persist_store(dataset_id)
        cache = self.cache.get(dataset_id, {})
        llm = cache.get("llm_model", None)
        if llm:
            logger.debug(
                f"The model {llm.model_name} is used for the workflow, which has maximum output token limit of {llm.context_size}"
            )

        if not llm and self.llm:
            llm = self.llm
            logger.debug(
                f"Default model {self.llm.model_name} is used for the workflow, which has maximum output token limit of {llm.context_size}"
            )

        if not llm:
            raise ValueError("LLM model not configured")

        embedding_model = self.embedding_model.chroma_embedding_model()
        if not embedding_model:
            # A safe guarantee to use the default model
            embedding_model = embedding_functions.DefaultEmbeddingFunction()

        # Initialize the workflow
        workflow = SurveyPaperReading(
            dataset_id, llm, llm, embedding_model, workflow_dict, persist_store
        )
        self.set_cache(dataset_id, "workflow", workflow)

    def get_progress(self, dataset_id, node_names=[]):
        def get_paper_data(node, progress, workflow, get_paper_data=False):
            output_data = {}
            output_data["node_name"] = node
            output_data["papers"] = []
            progress[node] = workflow.get_progress(node)

            """
            for wf in self.cache[dataset_id]["wf_dict"].values():
                progress[node].add(wf.get_progress(node))
                progress["total"].add(wf.get_progress())
                paper_data = {}
                paper_data["name"] = wf.get_id()
                paper_data["id"] = hash_id(paper_data["name"])
                node_cached_results = wf.get_cached_results(node)
                # paper_data.update(node_cached_results)
                paper_data["data"] = []

                if get_paper_data:
                    if node_cached_results and "data" in node_cached_results:
                        results = node_cached_results["data"]
                        if type(results) is dict:
                            results["id"] = hash_id(f"{paper_data['id']}_{0}")
                            paper_data["data"] = [results]
                        else:
                            for i, result in enumerate(results):
                                result["id"] = hash_id(f"{paper_data['id']}_{i}")
                                paper_data["data"].append(result)
                    output_data["papers"].append(paper_data)
            """

            return output_data

        def get_default_paper_data(node, get_paper_data=False):
            output_data = {}
            output_data["node_name"] = node
            output_data["papers"] = []
            default_datapath = os.path.join(
                self.app.config["OUTPUT_FOLDER"], DEFAULT_DATASET_ID
            )
            for paper in os.listdir(default_datapath):
                node_file = os.path.join(default_datapath, paper, f"{node}.json")
                paper_file = os.path.join(default_datapath, paper, "Paper.json")
                paper_json = {}
                if os.path.exists(paper_file):
                    with open(paper_file, "r") as f:
                        paper_json = json.load(f)["data"]

                    paper_data = {}
                    paper_data["name"] = paper_json["title"]
                    paper_data["id"] = hash_id(paper_json["title"])

                    # paper_data.update(node_cached_results)
                    paper_data["data"] = []
                    if get_paper_data and os.path.exists(node_file):
                        with open(node_file, "r") as f:
                            cached_results = json.load(f)

                        if cached_results and "data" in cached_results:
                            results = cached_results["data"]
                            if type(results) is dict:
                                results["id"] = hash_id(results["name"])
                                paper_data["data"] = [results]
                            elif type(results) is str:
                                paper_data["data"].append(
                                    {
                                        "id": hash_id(results),
                                        "name": results,
                                    }
                                )
                            elif type(results) is list:
                                for i, result in enumerate(results):
                                    result["id"] = hash_id(result["name"])
                                    paper_data["data"].append(result)
                            output_data["papers"].append(paper_data)
            return output_data

        progress = {}
        progress["total"] = ProgressInfo()
        output = []
        if dataset_id in self.cache:
            workflow = self.cache[dataset_id].get("workflow", None)
            if not node_names:
                inspector_node = workflow.graph.get_first_node()
                node_names = inspector_node.graph.get_node_names()
            for node in node_names:
                progress[node] = ProgressInfo()

            for node in node_names:
                if dataset_id == DEFAULT_DATASET_ID:
                    output_data = get_default_paper_data(node, len(node_names) == 1)
                    output_data["progress"] = 100.0
                else:
                    output_data = get_paper_data(
                        node, progress, workflow, len(node_names) == 1
                    )
                    output_data["progress"] = progress[node].get_percentage()
                output.append(output_data)
            progress["total"] = workflow.get_progress("")

        return output, progress["total"].get_percentage()

    def check_status(self, dataset_id, status):
        metadata = self.get_metadata(dataset_id)
        if metadata and "status" in metadata:
            return metadata["status"] == status.value
        return False

    def retrieve_node_output_schema(self, dataset_id, node_name):
        metadata = self.get_metadata(dataset_id)
        if not metadata:
            return None
        if "schema" not in metadata:
            return None
        schema = metadata["schema"]
        if "nodes" in schema:
            node_list = schema["nodes"]
            for node in node_list:
                if node.get("name") == node_name:
                    return node.get("output_schema")
        return None

    def configure_app(self, upload_folder, output_folder):
        self.app.config["UPLOAD_FOLDER"] = upload_folder
        self.app.config["OUTPUT_FOLDER"] = output_folder
        os.makedirs(self.app.config["UPLOAD_FOLDER"], exist_ok=True)
        os.makedirs(self.app.config["OUTPUT_FOLDER"], exist_ok=True)

    def run(self, host="0.0.0.0", port=9999, debug=True):
        self.app.run(host=host, port=port, debug=debug)

    def dataset(self):
        @self.app.route("/api/dataset", methods=["POST"])
        def create_dataset():
            # Check if the post request has the file part
            if "file" not in request.files:
                return (
                    jsonify(create_error_response("No file part in the request")),
                    400,
                )

            file = request.files["file"]

            # Ensure a file is selected
            if file.filename == "":
                return (
                    create_error_response("No file selected"),
                    400,
                )

            # Check if the file is a valid PDF or a ZIP of PDFs
            if not allowed_file(file.filename):
                return (
                    create_error_response("File type not allowed"),
                    400,
                )

            # Create a unique identifier for the dataset
            dataset_id = hash_id(file.filename)

            # Create directory to store the dataset files
            upload_path = os.path.join(self.app.config["UPLOAD_FOLDER"], dataset_id)
            os.makedirs(upload_path, exist_ok=True)

            dataset_path = os.path.join(self.app.config["OUTPUT_FOLDER"], dataset_id)
            os.makedirs(dataset_path, exist_ok=True)

            self.get_persist_store(dataset_id)
            # Save the file
            if file and file.filename.endswith(".pdf"):
                # If it's a single PDF file
                filename = secure_filename(file.filename)
                file.save(os.path.join(upload_path, filename))
            elif file and zipfile.is_zipfile(file):
                # If it's a ZIP file, extract the contents
                zip_ref = zipfile.ZipFile(file, "r")
                zip_ref.extractall(upload_path)
                zip_ref.close()
            else:
                return (
                    create_error_response("Invalid file format"),
                    400,
                )

            self.init_metadata(dataset_id)
            self.cache.setdefault(dataset_id, {})
            # Return the unique identifier
            return jsonify(create_json_response({"dataset_id": dataset_id}))

        def allowed_file(filename):
            # Helper function to check allowed file types
            return "." in filename and filename.rsplit(".", 1)[1].lower() in {
                "pdf",
                "zip",
            }

        @self.app.route("/api/dataset/<dataset_id>", methods=["DELETE"])
        def delete_dataset(dataset_id):
            try:
                # Delete the output folders
                output_path = os.path.join(self.app.config["OUTPUT_FOLDER"], dataset_id)
                if os.path.exists(output_path):
                    shutil.rmtree(output_path)

                if dataset_id in self.persist_stores:
                    self.persist_stores.pop(dataset_id)
                if dataset_id in self.cache:
                    self.cache.pop(dataset_id)
                # Return success response
                return (
                    create_json_response({"message": "Dataset deleted successfully"}),
                    200,
                )

            except Exception as e:
                return create_error_response(str(e)), 500

        @self.app.route("/api/dataset", methods=["GET"])
        def get_dataset():
            def get_single_dataset(dataset_id):
                # Get if metadata already presents
                cache = self.cache.setdefault(dataset_id, {})
                metadata = self.get_metadata(dataset_id)
                if metadata:
                    if dataset_id != DEFAULT_DATASET_ID:  # do not do for default data
                        status = STATUS.INITIALIZED
                        if "config" in metadata:
                            self.set_llm_model(
                                dataset_id, metadata["config"], initialize=False
                            )
                            status = STATUS.WAITING_WORKFLOW_CONFIG.value
                        if "schema" in metadata:
                            if "workflow" not in cache:
                                self.set_workflow(dataset_id, metadata["schema"])
                            status = STATUS.WAITING_EXTRACT.value
                        if "status" not in metadata or metadata["status"] < status:
                            metadata["status"] = status
                    else:
                        metadata["status"] = STATUS.WAITING_EXTRACT.value
                return metadata

            dataset_id = request.args.get("dataset_id")
            if dataset_id:
                metadata = get_single_dataset(dataset_id)
                return jsonify(create_json_response(metadata))
            else:
                # Return all metadata if no dataset_id is provided
                metadatas = []
                for folder in os.listdir(self.app.config["OUTPUT_FOLDER"]):
                    metadata_file = os.path.join(
                        self.app.config["OUTPUT_FOLDER"], folder, "metadata.json"
                    )
                    if os.path.exists(metadata_file):
                        metadatas.append(get_single_dataset(dataset_id=folder))

                return jsonify(create_json_response(metadatas))

    def llm_config(self):
        @self.app.route("/api/llm/config", methods=["POST"])
        def configure_llm():
            try:
                # Extract the JSON payload
                config_data = request.get_json()

                # Ensure all required fields are present in the payload
                required_fields = [
                    "dataset_id",
                    "llm_model",
                    "base_url",
                    "api_key",
                ]
                for field in required_fields:
                    if field not in config_data:
                        return (
                            create_error_response(f"Missing {field} in request"),
                            400,
                        )
                dataset_id = config_data["dataset_id"]
                self.set_meta_config(dataset_id, config_data)
                self.set_status(dataset_id, STATUS.WAITING_WORKFLOW_CONFIG)

                # Return success response
                return (
                    create_json_response(
                        {
                            "message": "LLM model configured successfully",
                        }
                    ),
                    200,
                )

            except Exception as e:
                return create_error_response(str(e)), 500

        @self.app.route("/api/llm/config", methods=["GET"])
        def get_llm_config():
            try:
                # Ensure all required fields are present in the payload
                required_fields = ["dataset_id"]
                for field in required_fields:
                    if field not in request.args:
                        return create_error_response(f"Missing {field} in request"), 400

                dataset_id = request.args.get("dataset_id")
                config = self.get_meta_config(dataset_id)

                return jsonify(create_json_response(config))

            except Exception as e:
                return create_error_response(str(e)), 500

    def workflow(self):
        @self.app.route("/api/dataset/workflow/config", methods=["POST"])
        def config_workflow():
            try:
                # Extract the JSON payload
                payload = request.get_json()

                # Ensure all required fields are present in the payload
                required_fields = ["dataset_id", "workflow_json"]
                for field in required_fields:
                    if field not in payload:
                        return create_error_response(f"Missing {field} in request"), 400

                dataset_id = payload["dataset_id"]
                metadata = self.get_metadata(dataset_id)
                workflow_dict = payload["workflow_json"]

                """
                if (
                    self.check_status(dataset_id, STATUS.WAITING_WORKFLOW_CONFIG)
                    is False
                ):
                    return (
                        create_error_response("LLM model not configured"),
                        400,
                    )
                """

                # Load the dataset
                dataset_path = os.path.join(
                    self.app.config["UPLOAD_FOLDER"], dataset_id
                )
                if not os.path.exists(dataset_path):
                    return create_error_response("Dataset not found"), 404

                self.set_workflow(dataset_id, workflow_dict)
                metadata["schema"] = workflow_dict
                metadata["status"] = STATUS.WAITING_EXTRACT.value
                self.set_metadata(dataset_id, metadata)
                return (
                    create_json_response(
                        {"message": "Embedding workflow successfully"}
                    ),
                    200,
                )

            except Exception as e:
                return create_error_response(str(e)), 500

        @self.app.route("/api/dataset/workflow/config", methods=["GET"])
        def get_workflow_config():
            try:
                # Ensure all required fields are present in the payload
                required_fields = ["dataset_id"]
                for field in required_fields:
                    if field not in request.args:
                        return create_error_response(f"Missing {field} in request"), 400
                dataset_id = request.args.get("dataset_id")
                workflow = self.get_meta_schema(dataset_id)

                if workflow and "workflow" not in self.cache.get(dataset_id, {}):
                    self.set_workflow(dataset_id, workflow)

                return jsonify(
                    create_json_response(
                        {
                            "dataset_id": dataset_id,
                            "workflow_json": workflow,
                        }
                    )
                )

            except Exception as e:
                traceback.print_exc()
                return create_error_response(str(e)), 500

        @self.app.route("/api/dataset/extract", methods=["POST"])
        def extract():
            try:
                # Extract the JSON payload
                payload = request.get_json()

                # Ensure all required fields are present in the payload
                required_fields = ["dataset_id"]
                for field in required_fields:
                    if field not in payload:
                        return create_error_response(f"Missing {field} in request"), 400

                dataset_id = payload["dataset_id"]
                thread_num = payload.get("thread_num", 1)

                """
                if self.check_status(dataset_id, STATUS.WAITING_EXTRACT) is False:
                    return (
                        create_error_response("Workflow not configured"),
                        400,
                    )
                """

                if dataset_id == DEFAULT_DATASET_ID:
                    self.set_status(dataset_id, STATUS.WAITING_CLUSTER)
                    # Return success response
                    return (
                        create_json_response(
                            {"message": "Workflow extraction completed"}
                        ),
                        200,
                    )

                workflow = self.cache.get(dataset_id).get("workflow")
                # Load the dataset
                dataset_path = os.path.join(
                    self.app.config["UPLOAD_FOLDER"], dataset_id
                )
                pdf_files = [
                    {"paper_file_path": os.path.join(dataset_path, file)}
                    for file in os.listdir(dataset_path)
                    if file.lower().endswith(".pdf")
                ]
                executor = ThreadPoolWorkflowExecutor(workflow, thread_num)

                def run_executor():
                    executor.execute(pdf_files)

                # Run in a separate thread
                thread = Thread(target=run_executor)
                thread.start()

                # Update the metadata
                self.set_status(dataset_id, STATUS.EXTRACTING)
                # Return success response
                return (
                    create_json_response({"message": "Start workflow successfully"}),
                    200,
                )

            except Exception as e:
                traceback.print_exc()
                return create_error_response(str(e)), 500

        @self.app.route("/api/dataset/extract", methods=["GET"])
        def get_extract():
            try:
                # Ensure all required fields are present in the payload
                required_fields = ["dataset_id"]
                for field in required_fields:
                    if field not in request.args:
                        return create_error_response(f"Missing {field} in request"), 400
                dataset_id = request.args.get("dataset_id")
                workflow_node_names = request.args.getlist("workflow_node_names")

                # Get the results with the specified paper IDs and workflow node IDs, if provided
                results, total_progress = self.get_progress(
                    dataset_id, workflow_node_names
                )
                self.add_meta_entities(dataset_id, workflow_node_names)
                if total_progress == 100.0:
                    self.set_status(dataset_id, STATUS.WAITING_CLUSTER)

                # Return the results as a JSON response
                return jsonify(create_json_response(results))

            except Exception as e:
                traceback.print_exc()
                return create_error_response(str(e)), 500

        @self.app.route("/api/dataset/graphy", methods=["POST"])
        def graphy_dataset():
            try:
                # Extract the JSON payload
                payload = request.get_json()
                # Ensure all required fields are present in the payload
                required_fields = ["dataset_id"]
                for field in required_fields:
                    if field not in payload:
                        return create_error_response(f"Missing {field} in request"), 400

                dataset_id = payload["dataset_id"]
                data_path = os.path.join(self.app.config["OUTPUT_FOLDER"], dataset_id)

                # Define the zip file path
                zip_filename = f"{dataset_id}_graph.zip"
                zip_filepath = os.path.join(data_path, zip_filename)

                # Check if the zip file already exists
                if os.path.exists(zip_filepath):
                    # Send the zip file to the client as a downloadable response
                    return send_file(
                        zip_filepath,
                        as_attachment=True,
                        download_name=zip_filename,
                    )

                node_names = self.get_workflow_node_names(dataset_id)
                graph_builder = GraphBuilder(data_path, self.embedding_model)
                graph_builder.extract_paper_data()
                for node_name in node_names:
                    graph_builder.extract_data(node_name)
                    graph_builder.extract_clustered_data(node_name)

                graph_builder.build_graph()
                graph_path = os.path.join(data_path, "graph")

                # Ensure graph_path exists
                if not os.path.exists(graph_path):
                    return (
                        create_error_response(f"Graph path {graph_path} not found"),
                        404,
                    )

                # Create a zip file containing the files in the graph_path
                with zipfile.ZipFile(zip_filepath, "w", zipfile.ZIP_DEFLATED) as zipf:
                    for root, dirs, files in os.walk(graph_path):
                        for file in files:
                            file_path = os.path.join(root, file)
                            arcname = os.path.relpath(
                                file_path, graph_path
                            )  # Store relative paths in the zip file
                            zipf.write(file_path, arcname)

                # Send the zip file to the client as a downloadable response
                return send_file(
                    zip_filepath, as_attachment=True, download_name=zip_filename
                )

            except Exception as e:
                return create_error_response(str(e)), 500

        @self.app.route("/api/dataset/graphy", methods=["GET"])
        def get_graphy_dataset():
            try:
                # Ensure required 'dataset_id' field is present
                required_fields = ["dataset_id"]
                for field in required_fields:
                    if field not in request.args:
                        return create_error_response(f"Missing {field} in request"), 400

                dataset_id = request.args.get("dataset_id")
                data_path = os.path.join(self.app.config["OUTPUT_FOLDER"], dataset_id)

                # Define the zip file path
                zip_filename = f"{dataset_id}_graph.zip"
                zip_filepath = os.path.join(data_path, zip_filename)

                # Check if the zip file already exists
                if os.path.exists(zip_filepath):
                    # Send the zip file to the client as a downloadable response
                    return send_file(
                        zip_filepath,
                        as_attachment=True,
                        download_name=zip_filename,
                    )
                else:
                    return (
                        create_error_response(
                            f"Graph ZIP file for {dataset_id} not found"
                        ),
                        404,
                    )
            except Exception as e:
                return create_error_response(str(e)), 500

        @self.app.route("/api/dataset/graphy/interactive", methods=["POST"])
        def graphy_dataset_interactive():
            try:
                # Extract the JSON payload
                payload = request.get_json()
                # Ensure all required fields are present in the payload
                required_fields = ["dataset_id"]
                for field in required_fields:
                    if field not in payload:
                        return create_error_response(f"Missing {field} in request"), 400

                dataset_id = payload["dataset_id"]
                data_path = os.path.join(self.app.config["OUTPUT_FOLDER"], dataset_id)
                graph_builder = GraphBuilder(data_path, self.embedding_model)

                if dataset_id == DEFAULT_DATASET_ID:
                    graph_id = "1"
                    self.set_meta_interactive_info(dataset_id, graph_id)
                    graph_builder.start_interactive_service(graph_id)
                    return (
                        create_json_response({"interactive_graph_id": graph_id}),
                        200,
                    )
                else:
                    metadata = self.get_metadata(dataset_id)
                    graph_id = ""
                    if metadata:
                        graph_id = metadata.get("interactive_graph_id")

                    if not graph_id:
                        node_names = self.get_workflow_node_names(dataset_id)

                        if not os.path.exists(
                            os.path.join(data_path, "graph", "schema.json")
                        ):
                            graph_builder.extract_paper_data()
                            for node_name in node_names:
                                graph_builder.extract_data(node_name)
                                graph_builder.extract_clustered_data(node_name)

                            schema = graph_builder.build_graph()
                        else:
                            schema = graph_builder.get_interactive_schema()

                        # Import to Interactive
                        graph_id = graph_builder.import_to_interactive(
                            schema, dataset_id
                        )
                        self.set_meta_interactive_info(dataset_id, graph_id)

                    graph_builder.start_interactive_service(graph_id)
                    return (
                        create_json_response({"interactive_graph_id": graph_id}),
                        200,
                    )

            except Exception as e:
                traceback.print_exc()
                return create_error_response(str(e)), 500

        @self.app.route("/api/dataset/graphy/interactive", methods=["GET"])
        def get_graphy_dataset_interactive():
            try:
                # Ensure required 'dataset_id' field is present
                required_fields = ["dataset_id"]
                for field in required_fields:
                    if field not in request.args:
                        return create_error_response(f"Missing {field} in request"), 400

                dataset_id = request.args.get("dataset_id")
                metadata = self.get_metadata(dataset_id)
                graph_id = ""
                if metadata:
                    graph_id = metadata.get("interactive_graph_id")
                if graph_id:
                    return (
                        create_json_response({"interactive_graph_id": graph_id}),
                        200,
                    )
                else:
                    return (
                        create_error_response(
                            f"Interactive graph not exist for dataset: {dataset_id}"
                        ),
                        400,
                    )

            except Exception as e:
                return create_error_response(str(e)), 500

        @self.app.route(
            "/api/dataset/graphy/interactive/<dataset_id>", methods=["DELETE"]
        )
        def delete_graphy_dataset_interactive(dataset_id):
            try:
                metadata = self.get_metadata(dataset_id)
                graph_id = ""
                if metadata:
                    graph_id = metadata.get("interactive_graph_id")
                if graph_id:
                    data_path = os.path.join(
                        self.app.config["OUTPUT_FOLDER"], dataset_id
                    )
                    graph_builder = GraphBuilder(data_path, self.embedding_model)
                    graph_builder.delete_interactive_service(graph_id)
                    return (
                        create_json_response(
                            {"message": f"Graph: {graph_id} deleted from Interactive"}
                        ),
                        200,
                    )
                else:
                    return (
                        create_error_response(
                            f"Interactive graph not exist for dataset: {dataset_id}"
                        ),
                        400,
                    )

            except Exception as e:
                traceback.print_exc()
                return create_error_response(str(e)), 500

    def llm_report(self):
        @self.app.route("/api/llm/report/prompt", methods=["POST"])
        def set_prompt():
            try:
                # Extract the JSON payload
                input_data = request.get_json()
                required_fields = ["prompt", "dataset_id"]
                for field in required_fields:
                    if field not in input_data:
                        return (
                            create_error_response(f"Missing {field} in request"),
                            400,
                        )

                dataset_id = input_data["dataset_id"]
                identity = input_data.get("identity", "0")
                new_prompt = input_data["prompt"]

                baseline_method = input_data.get("baseline", False)
                persist_store = self.get_persist_store(dataset_id)

                if baseline_method:
                    result = self.text_generator.set_prompt_baseline(new_prompt)
                    persist_store.save_state(
                        f"report_cache/{identity}",
                        "prompt_baseline",
                        {"content": self.text_generator.get_prompt_baseline()},
                    )
                else:
                    result = self.text_generator.set_prompt(new_prompt)
                    persist_store.save_state(
                        f"report_cache/{identity}",
                        "prompt",
                        {"content": self.text_generator.get_prompt()},
                    )

                # Return success response
                return (
                    create_json_response({"result": result}),
                    200,
                )

            except Exception as e:
                return create_error_response(str(e)), 500

        @self.app.route("/api/llm/report/clustering", methods=["POST"])
        def online_clustering():
            try:
                # Extract the JSON payload
                input_data = request.get_json()
                required_fields = ["data", "dataset_id", "groupby"]
                for field in required_fields:
                    if field not in input_data:
                        return (
                            create_error_response(f"Missing {field} in request"),
                            400,
                        )
                dataset_id = input_data["dataset_id"]
                graph_data = input_data["data"]
                group_key = input_data["groupby"]
                n_clusters = input_data.get("n_clusters", 4)

                # An optional field to specify the clustering keys, e.g., ["name", "description"].
                # If not provided, use the output schema items as clustering keys.
                clustering_keys = input_data.get("clustering_keys", [])

                if not clustering_keys:
                    # Retrieve the output schema of the specified node
                    output_schema = self.retrieve_node_output_schema(
                        dataset_id, group_key
                    )
                    if output_schema is None:
                        return (
                            create_error_response(f"Node {group_key} not found"),
                            404,
                        )
                    output_schema_items = output_schema.get("item")
                    clustering_keys = [item.get("name") for item in output_schema_items]

                # Can make embedding model consistent
                cluster = OnlineClustering(self.embedding_model, n_clusters)
                clustered_data = []
                output_data = {}
                output_data["nodes"] = []
                for item in graph_data["nodes"]:
                    item_label = item.get("label", "")
                    if item_label and item_label == group_key:
                        properties = item.get("properties", {})
                        if properties:
                            # Build the cluster_key by joining the values of clustering keys
                            cluster_key = "_".join(
                                [properties.get(key, "") for key in clustering_keys]
                            )
                        else:
                            cluster_key = "_".join(
                                [item.get(key, "") for key in clustering_keys]
                            )
                        item["cluster_key"] = cluster_key
                        clustered_data.append(item)
                    else:
                        # Add item to filtered_graph_data if it doesn't match the group_key
                        output_data["nodes"].append(item)

                cluster.embed_data(clustered_data)
                clusters = cluster.cluster_data(clustered_data)

                for idx, item in enumerate(clustered_data):
                    if "properties" in item:
                        item["properties"]["_cluster_id"] = str(clusters[idx])
                    else:
                        item["_cluster_id"] = str(clusters[idx])
                    del item["embedding"]

                output_data["nodes"].extend(clustered_data)
                if "edges" in graph_data:
                    output_data["edges"] = graph_data["edges"]

                # Return success response
                return (
                    create_json_response(output_data),
                    200,
                )

            except Exception as e:
                return create_error_response(str(e)), 500

        @self.app.route("/api/dataset/summarizing", methods=["POST"])
        def do_summarizing():
            try:
                # Extract the JSON payload
                payload = request.get_json()
                # Ensure all required fields are present in the payload
                required_fields = ["data", "groupby", "clustering_info"]
                for field in required_fields:
                    if field not in payload:
                        return create_error_response(f"Missing {field} in request"), 400

                data = payload["data"]
                clustering_info = payload["clustering_info"]
                groupby = payload["groupby"]

                groupby_node_ids = set()
                new_graph_data = {}

                clusters = {}

                for node in data["nodes"]:
                    if node["label"] == groupby:
                        if "_cluster_id" in node["properties"]:
                            cluster_id = node["properties"]["_cluster_id"]
                            if cluster_id in clusters:
                                clusters[cluster_id].append(node)
                            else:
                                clusters[cluster_id] = [node]
                            groupby_node_ids.add(node["id"])

                new_nodes = {}
                id_mapping = {}
                for cluster_id in clusters:
                    cluster_nodes = clusters[cluster_id]
                    if len(cluster_nodes) == 1:
                        new_node_id = cluster_nodes[0]["id"]
                        new_nodes[cluster_id] = {
                            "id": new_node_id,
                            "label": groupby,
                            "properties": {
                                "name": cluster_nodes[0]["properties"]["name"],
                                "description": cluster_nodes[0]["properties"].get(
                                    "description", ""
                                ),
                            },
                        }
                    else:
                        node_descriptions = "\n".join(
                            [
                                "\n".join(
                                    f"{prop.capitalize()}: {str(node['properties'].get(prop, ''))}"
                                    for prop in clustering_info
                                )
                                for node in cluster_nodes
                            ]
                        )

                        query = (
                            "You are a highly regarded academic expert with deep expertise in research and publication. "
                            "Based on the descriptions of nodes in the cluster, generate a **specific** name and a **detailed** description that accurately represent the cluster."
                            "- **Avoid Broad Terms**: The name should be precise and avoid vague terms like 'distributed graph processing.' "
                            "Focus on the key innovation or challenge."
                            "- **Detail the Core Theme**: The description should capture the essence of the cluster, avoiding high-level phrases. "
                            "Focus on the specific problem or solution the cluster addresses."
                            "- **One Summary Only**: Provide ONLY ONE summary for the cluster, focusing on the most prominent theme."
                            "Examples:"
                            "- **Incorrect**: <broad terms> 'Challenges in Scalable Graph Processing'"
                            "- **Correct**: 'Large Communication Overhead'"
                            "- **Incorrect**: <multiple challenges> 'memory and communication issues'"
                            "- **Correct**: 'Load Balance Problem'"
                            "The aggregated descriptions of all nodes within the cluster, enclosed within XML tags <DESCRIPTIONS></DESCRIPTIONS>, are as follows: "
                            "<DESCRIPTIONS>"
                            f"{node_descriptions}"
                            "</DESCRIPTIONS>"
                        )

                        executor = BaseChainNode(
                            "ClusterSummarizer",
                            self.llm.model,
                            self.llm.model,
                            NameDesc,
                            max_token_size=self.llm.context_size,
                            enable_streaming=True,
                        )

                        response = {}
                        for result in executor.run("", query):
                            response = result

                        returned_summaries = {
                            "name": response["name"],
                            "description": response.get("description", ""),
                        }

                        new_node_id = str(uuid.uuid5(uuid.NAMESPACE_DNS, cluster_id))
                        new_nodes[cluster_id] = {
                            "id": new_node_id,
                            "label": groupby,
                            "properties": returned_summaries,
                        }

                    for node in cluster_nodes:
                        id_mapping[node["id"]] = new_node_id

                new_graph_data = {"nodes": [], "edges": []}

                added_new_node = set()
                for node in data["nodes"]:
                    if node["label"] != groupby:
                        new_graph_data["nodes"].append(node)
                    else:
                        cluster_id = node["properties"]["_cluster_id"]
                        if cluster_id not in added_new_node:
                            new_graph_data["nodes"].append(new_nodes[cluster_id])
                            added_new_node.add(cluster_id)

                added_new_edge = set()
                for edge in data["edges"]:
                    if edge["source"] in groupby_node_ids:
                        new_edge = copy.deepcopy(edge)
                        new_edge["source"] = id_mapping[edge["source"]]
                        if (
                            new_edge["source"],
                            new_edge["target"],
                        ) not in added_new_edge:
                            new_graph_data["edges"].append(new_edge)
                            added_new_edge.add((new_edge["source"], new_edge["target"]))
                    elif edge["target"] in groupby_node_ids:
                        new_edge = copy.deepcopy(edge)
                        new_edge["target"] = id_mapping[edge["target"]]
                        if (
                            new_edge["source"],
                            new_edge["target"],
                        ) not in added_new_edge:
                            new_graph_data["edges"].append(new_edge)
                            added_new_edge.add((new_edge["source"], new_edge["target"]))
                    else:
                        new_graph_data["edges"].append(edge)

                return (
                    create_json_response(new_graph_data),
                    200,
                )

            except Exception as e:
                traceback.print_exc()
                return create_error_response(str(e)), 500

        @self.app.route("/api/llm/report/prepare", methods=["POST"])
        def prepare_report():
            try:
                # Extract the JSON payload
                input_data = request.get_json()
                required_fields = [
                    "data",
                    "dataset_id",
                    "groupby",
                    # "paper_attr",
                    # "prop_attr",
                ]
                for field in required_fields:
                    if field not in input_data:
                        return (
                            create_error_response(f"Missing {field} in request"),
                            400,
                        )

                has_identity = True
                dataset_id = input_data["dataset_id"]
                identity = input_data.get("identity", "0")
                use_prompt_cache = input_data.get("use_prompt_cache", True)
                if "identity" not in input_data:
                    has_identity = False

                baseline_method = input_data.get("baseline", False)
                persist_store = self.get_persist_store(dataset_id)

                if baseline_method:
                    if has_identity and use_prompt_cache:
                        prompt = persist_store.get_state(
                            f"report_cache/{identity}", "prompt_baseline"
                        )
                        if prompt is None:
                            self.text_generator.prepare_data_baseline(input_data)
                            persist_store.save_state(
                                f"report_cache/{identity}",
                                "prompt_baseline",
                                {"content": self.text_generator.get_prompt_baseline()},
                            )
                        else:
                            self.text_generator.set_prompt_baseline(prompt["content"])

                    else:
                        self.text_generator.prepare_data_baseline(input_data)
                        persist_store.save_state(
                            f"report_cache/{identity}",
                            "prompt_baseline",
                            {"content": self.text_generator.get_prompt_baseline()},
                        )
                    output_prompt = self.text_generator.get_prompt_baseline()
                else:
                    if has_identity and use_prompt_cache:
                        prompt = persist_store.get_state(
                            f"report_cache/{identity}", "prompt"
                        )
                        recall = True
                        try:
                            self.text_generator.recall_status(
                                persist_store, f"report_cache/{identity}"
                            )
                        except:
                            recall = False
                        if prompt is None or not recall:
                            self.text_generator.prepare_data(input_data)
                            persist_store.save_state(
                                f"report_cache/{identity}",
                                "prompt",
                                {"content": self.text_generator.get_prompt()},
                            )
                            self.text_generator.store_status(
                                persist_store, f"report_cache/{identity}"
                            )
                        else:
                            self.text_generator.set_prompt(prompt["content"])
                    else:
                        self.text_generator.prepare_data(input_data)
                        persist_store.save_state(
                            f"report_cache/{identity}",
                            "prompt",
                            {"content": self.text_generator.get_prompt()},
                        )
                        self.text_generator.store_status(
                            persist_store, f"report_cache/{identity}"
                        )
                    output_prompt = self.text_generator.get_prompt()

                # Return success response
                return (
                    create_json_response({"prompts": output_prompt}),
                    200,
                )

            except Exception as e:
                traceback.print_exc()
                return create_error_response(str(e)), 500

        @self.app.route("/api/llm/report/generate", methods=["POST"])
        def generate_report():
            try:
                input_data = request.get_json()

                required_fields = ["data", "dataset_id", "groupby"]
                for field in required_fields:
                    if field not in input_data:
                        return (
                            create_error_response(f"Missing {field} in request"),
                            400,
                        )

                has_identity = True
                dataset_id = input_data["dataset_id"]
                use_prompt_cache = input_data.get("use_prompt_cache", True)
                use_result_cache = input_data.get("use_result_cache", True)
                identity = input_data.get("identity", "0")
                if "identity" not in input_data:
                    has_identity = False

                baseline_method = input_data.get("baseline", False)
                persist_store = self.get_persist_store(dataset_id)

                result = ""
                bib_text = ""

                if baseline_method:
                    if has_identity and use_prompt_cache:
                        prompt = persist_store.get_state(
                            f"report_cache/{identity}", "prompt_baseline"
                        )
                        if prompt is None:
                            self.text_generator.prepare_data_baseline(input_data)
                            persist_store.save_state(
                                f"report_cache/{identity}",
                                "prompt_baseline",
                                {"content": self.text_generator.get_prompt_baseline()},
                            )
                        else:
                            self.text_generator.set_prompt_baseline(prompt["content"])
                    else:
                        self.text_generator.prepare_data_baseline(input_data)
                        persist_store.save_state(
                            f"report_cache/{identity}",
                            "prompt_baseline",
                            {"content": self.text_generator.get_prompt_baseline()},
                        )

                    if has_identity and use_result_cache:
                        result = persist_store.get_text(
                            f"report_cache/{identity}", "report_baseline"
                        )
                        if result is None:
                            result = self.text_generator.execute_baseline()
                            persist_store.save_text(
                                f"report_cache/{identity}", "report_baseline", result
                            )
                    else:
                        result = self.text_generator.execute_baseline()
                        persist_store.save_text(
                            f"report_cache/{identity}", "report_baseline", result
                        )

                    # def generate_stream():
                    #     try:
                    #         cur_output = ""
                    #         result_generator = (
                    #             self.text_generator.execute_baseline_streaming()
                    #         )

                    #         for result in result_generator:
                    #             cur_output += result
                    #             json_data = create_json_response({"data": result})
                    #             yield f"{json_data}\n".encode(
                    #                 "utf-8"
                    #             )  # Stream each result as JSON bytes

                    #     except Exception as e:
                    #         error_trace = traceback.format_exc()
                    #         error_response = json.dumps(
                    #             {
                    #                 "status": "error",
                    #                 "message": str(e),
                    #                 "trace": error_trace,
                    #             }
                    #         )
                    #         yield f"{error_response}\n".encode("utf-8")

                    # # Return a streaming response
                    # return Response(
                    #     stream_with_context(generate_stream()),
                    #     content_type="text/event-stream",
                    # )

                else:
                    if has_identity and use_prompt_cache:
                        prompt = persist_store.get_state(
                            f"report_cache/{identity}", "prompt"
                        )
                        recall = True
                        try:
                            self.text_generator.recall_status(
                                persist_store, f"report_cache/{identity}"
                            )
                        except:
                            recall = False
                        if prompt is None or not recall:
                            self.text_generator.prepare_data(input_data)
                            persist_store.save_state(
                                f"report_cache/{identity}",
                                "prompt",
                                {"content": self.text_generator.get_prompt()},
                            )
                            self.text_generator.store_status(
                                persist_store, f"report_cache/{identity}"
                            )
                        else:
                            self.text_generator.set_prompt(prompt["content"])
                    else:
                        self.text_generator.prepare_data(input_data)
                        persist_store.save_state(
                            f"report_cache/{identity}",
                            "prompt",
                            {"content": self.text_generator.get_prompt()},
                        )
                        self.text_generator.store_status(
                            persist_store, f"report_cache/{identity}"
                        )

                    if has_identity and use_result_cache:
                        result = persist_store.get_text(
                            f"report_cache/{identity}", "report.tex"
                        )
                        bib_text = persist_store.get_text(
                            f"report_cache/{identity}", "report.bib"
                        )
                        if result is None:
                            result, bib_text = self.text_generator.execute()
                            persist_store.save_text(
                                f"report_cache/{identity}", "report.tex", result
                            )
                            persist_store.save_text(
                                f"report_cache/{identity}", "report.bib", bib_text
                            )
                    else:
                        result, bib_text = self.text_generator.execute()
                        persist_store.save_text(
                            f"report_cache/{identity}", "report.tex", result
                        )
                        persist_store.save_text(
                            f"report_cache/{identity}", "report.bib", bib_text
                        )

                    # def generate_stream():
                    #     try:
                    #         cur_output = ""
                    #         result_generator = self.text_generator.execute_streaming()

                    #         for result in result_generator:
                    #             cur_output += result
                    #             json_data = create_json_response({"data": result})
                    #             yield f"{json_data}\n".encode(
                    #                 "utf-8"
                    #             )  # Stream each result as JSON bytes

                    #     except Exception as e:
                    #         error_trace = traceback.format_exc()
                    #         error_response = json.dumps(
                    #             {
                    #                 "status": "error",
                    #                 "message": str(e),
                    #                 "trace": error_trace,
                    #             }
                    #         )
                    #         yield f"{error_response}\n".encode("utf-8")

                    # # Return a streaming response
                    # return Response(
                    #     stream_with_context(generate_stream()),
                    #     content_type="text/event-stream",
                    # )

                # Return success response
                return (
                    create_json_response({"data": result, "bib": bib_text}),
                    200,
                )

            except Exception as e:
                return create_error_response(str(e)), 500


if __name__ == "__main__":
    logger.setLevel(logging.DEBUG)
    logger.info("Starting the demo app")
    logger.info(f"DATA_DIR: {WF_DATA_DIR}")
    demo_app = DemoApp("demo-app")
    demo_app.run()
