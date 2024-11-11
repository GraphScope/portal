# utils.py

from sklearn.preprocessing import normalize
from typing import Dict, List, Tuple
from rapidfuzz import process, fuzz
import numpy as np
from sentence_transformers import util, SentenceTransformer
from transformers import AutoModel, AutoTokenizer
from config import WF_OUTPUT_DIR
from gs_interactive.client.driver import Driver
from gs_interactive.client.session import Session
from gs_interactive.models import *
from utils.text_clustering import (
    Clustering,
    KMeansClustering,
)
from models.embedding_model import TextEmbedding

import uuid
import json
import csv
import os
import re
import numpy as np
import time
import logging


CLUSTERED_SUFFIX = "clustered"
SUMMARIZED_SUFFIX = "summarized"

os.environ["HF_HUB_OFFLINE"] = "1"


def hash_id(input_string: str) -> str:
    return str(uuid.uuid5(uuid.NAMESPACE_DNS, input_string))


def load_json(file_path: str) -> dict:
    with open(file_path, "r") as file:
        return json.load(file)["data"]


def list_to_str(lst: list) -> str:
    return ",".join(lst) if lst else ""


def write_csv(file_path: str, data: list, headers: list = None):
    if headers is None and data:
        headers = list(data[0].keys())
    if len(data) > 0:
        with open(file_path, "w", newline="") as file:
            writer = csv.DictWriter(file, fieldnames=headers, delimiter="|")
            writer.writeheader()
            for row in data:
                # Exclude the 'embedding' field from being written to the CSV
                row = {key: value for key, value in row.items() if key != "embedding"}
                writer.writerow(row)


def write_json(file_path: str, data):
    with open(file_path, "w") as file:
        json.dump(data, file, indent=4)


def compute_similarity_edges(items_dict: dict, similarity_thresh=0.7) -> list:
    def sigmoid(x, k=15):
        return 1 / (1 + np.exp(-k * (x - similarity_thresh)))

    edges = []
    item_list = list(items_dict.values())
    embeddings = np.array([item["embedding"] for item in item_list])
    normalized_embeddings = normalize(embeddings, axis=1)
    similarities = util.cos_sim(normalized_embeddings, normalized_embeddings).numpy()

    for i in range(len(item_list)):
        for j in range(i + 1, len(item_list)):
            if similarities[i, j] > similarity_thresh:
                edges.append(
                    {
                        "source": item_list[i]["id"],
                        "target": item_list[j]["id"],
                        "weight": sigmoid(similarities[i, j]),
                    }
                )
    return edges


class GraphBuilder:
    def __init__(
        self,
        data_path,
        embedding_model: TextEmbedding,
        clustering_method: Clustering = KMeansClustering(),
    ):
        self.papers_dict = {}
        self.data_dict = {}
        self.edges_dict = {}
        self.data_path = data_path
        self.folders = os.listdir(self.data_path)
        self.model = embedding_model
        self.clustering = clustering_method

    def get_data(self, node_name):
        return self.data_dict.get(node_name, {})

    def extract_paper_data(self):
        for folder in self.folders:
            paper_file_name = os.path.join(self.data_path, folder, "Paper.json")
            if os.path.exists(paper_file_name):
                paper_data = load_json(paper_file_name)
                paper_data["id"] = hash_id(folder)
                if paper_data["id"] not in self.papers_dict:
                    self.papers_dict[paper_data["id"]] = (folder, paper_data)

    def extract_data(
        self, node_name: str, prop_list: List[str] = None, edge_name: str = None
    ):
        if node_name not in self.data_dict:
            data_dict = self.data_dict.setdefault(node_name, {})
        else:
            data_dict = self.data_dict[node_name]
        if not edge_name:
            edge_name = f"Paper_Has_{node_name}"
        if edge_name not in self.edges_dict:
            edges = self.edges_dict.setdefault(edge_name, [])
        else:
            edges = self.edges_dict[edge_name]

        for paper_id, (folder, _) in self.papers_dict.items():
            data_file_name = os.path.join(self.data_path, folder, f"{node_name}.json")
            if os.path.exists(data_file_name):
                data_items = load_json(os.path.join(data_file_name))
            else:
                logging.warning(f"File not found: {data_file_name}")
                continue

            if not isinstance(data_items, list):
                data_items = [data_items]

            for idx, item in enumerate(data_items):
                data_id = hash_id(f"{paper_id}_{idx}")

                if data_id not in data_dict:
                    data_dict[data_id] = {"id": data_id}
                    if prop_list:
                        combined_text_parts = []
                        for prop in prop_list:
                            value = item.get(prop, "")
                            combined_text_parts.append(value)
                            data_dict[data_id][prop] = value
                        combined_text = "_".join(combined_text_parts)
                        # extract the cluster key from the given properties, concatenate them and save it as the cluster key, used for embedding
                        data_dict[data_id]["cluster_key"] = combined_text
                    else:
                        data_dict[data_id].update(item)
                    edges.append(
                        {
                            "source": paper_id,
                            "target": data_id,
                        }
                    )

    def embed_data(self, node_name: str):
        data_dict = self.get_data(node_name)
        text_to_embed = [item["cluster_key"] for item in data_dict.values()]
        embeddings = self.model.embed(text_to_embed)
        for idx, item in enumerate(data_dict.values()):
            item["embedding"] = embeddings[idx]
            del item["cluster_key"]

    def cluster_data(self, node_name: str):
        data_dict = self.get_data(node_name)
        embeddings = np.array([item["embedding"] for item in data_dict.values()])
        clusters = self.clustering.cluster(embeddings)
        for idx, item in enumerate(data_dict.values()):
            item["cluster_id"] = node_name + "_" + str(clusters[idx])

    def extract_clustered_data(self, node_name: str, edge_name: str = None):
        if not edge_name:
            edge_name = f"Paper_Has_{node_name}"
        if edge_name not in self.edges_dict:
            edges = self.edges_dict.setdefault(edge_name, [])
        else:
            edges = self.edges_dict[edge_name]

        try:
            filename = os.path.join(
                self.data_path, f"{node_name}_{SUMMARIZED_SUFFIX}.json"
            )
            data_items = {}
            with open(filename, "r") as f:
                data_items = json.load(open(filename, "r"))

            if data_items:
                data_to_cluster = {}
                self.data_dict[node_name] = {}
                data_dict = self.data_dict[node_name]

                for item in data_items:
                    data_dict[item["cluster_id"]] = item["summary"]
                    for node_id in item["nodes"]:
                        data_to_cluster[node_id] = item["cluster_id"]

                new_edges = set()
                for edge in edges:
                    if edge["source"] in data_to_cluster:
                        new_edges.add((data_to_cluster[edge["source"]], edge["target"]))
                    elif edge["target"] in data_to_cluster:
                        new_edges.add((edge["source"], data_to_cluster[edge["target"]]))
                    else:
                        continue

                self.edges_dict[edge_name] = [
                    {"source": edge[0], "target": edge[1]} for edge in new_edges
                ]

        except Exception as e:
            return

    def build_graph(self):
        graph_path = os.path.join(self.data_path, "graph")
        os.makedirs(graph_path, exist_ok=True)
        gs_schemas = {"vertex_types": [], "edge_types": []}
        write_csv(
            os.path.join(graph_path, "Paper.csv"),
            [paper[1] for paper in self.papers_dict.values()],
        )

        paper_schema = {}
        for _, paper in self.papers_dict.values():
            paper_schema = {
                "type_name": "Paper",
                "properties": [],
                "primary_keys": ["id"],
            }
            for prop in paper.keys():
                paper_schema["properties"].append(
                    {
                        "property_name": prop,
                        "property_type": {"string": {"long_text": ""}},
                    }
                )
            break

        if paper_schema:
            gs_schemas["vertex_types"].append(paper_schema)

        node_schema = {}
        for node, data in self.data_dict.items():
            write_csv(
                os.path.join(graph_path, f"{node}.csv"),
                list(data.values()),
            )
            for item in data.values():
                node_schema = {
                    "type_name": node,
                    "properties": [],
                    "primary_keys": ["id"],
                }
                for prop in item.keys():
                    node_schema["properties"].append(
                        {
                            "property_name": prop,
                            # TODO may specify the type of the property
                            "property_type": {"string": {"long_text": ""}},
                        }
                    )
                break
            if node_schema:
                gs_schemas["vertex_types"].append(node_schema)

        for edge, data in self.edges_dict.items():
            write_csv(
                os.path.join(graph_path, f"{edge}.csv"),
                data,
                [
                    "source",
                    "target",
                ],
            )
            edge_schema = {
                "type_name": edge,
                "vertex_type_pair_relations": [
                    {
                        "source_vertex": "Paper",
                        # TODO only when people does not specify edge's name
                        "destination_vertex": edge.split("_")[2],
                        "relation": "MANY_TO_MANY",
                    }
                ],
                "properties": [],
                "primary_keys": [],
            }
            gs_schemas["edge_types"].append(edge_schema)

        write_json(os.path.join(graph_path, "schema.json"), gs_schemas)

        return gs_schemas

    def get_interactive_schema(self):
        schema_json = os.path.join(self.data_path, "graph", "schema.json")
        with open(schema_json, "r") as f:
            return json.load(f)

    # Must be called only after build graph
    def import_to_interactive(self, schema, name):
        def build_import_config_from_schema(schema, graph_path):
            import_config = {
                "loading_config": {
                    "data_source": {"scheme": "file"},
                    "import_option": "init",
                    "format": {"type": "csv"},
                },
                "vertex_mappings": [],
                "edge_mappings": [],
            }
            for vertex_type in schema["vertex_types"]:
                vertex_mapping = {
                    "type_name": vertex_type["type_name"],
                    "inputs": [f"@{graph_path}/{vertex_type['type_name']}.csv"],
                    "column_mappings": [],
                }

                # Map the vertex properties to CSV columns
                for index, prop in enumerate(vertex_type["properties"]):
                    vertex_mapping["column_mappings"].append(
                        {
                            "column": {
                                "index": index,
                                "name": prop["property_name"],
                            },
                            "property": prop["property_name"],
                        }
                    )

                import_config["vertex_mappings"].append(vertex_mapping)

            # Process edge mappings
            for edge_type in schema["edge_types"]:
                edge_mapping = {
                    "type_triplet": {
                        "edge": edge_type["type_name"],
                        "source_vertex": edge_type["vertex_type_pair_relations"][0][
                            "source_vertex"
                        ],
                        "destination_vertex": edge_type["vertex_type_pair_relations"][
                            0
                        ]["destination_vertex"],
                    },
                    "inputs": [f"@{graph_path}/{edge_type['type_name']}.csv"],
                    "source_vertex_mappings": [
                        {
                            "column": {
                                "index": 0,
                                "name": f"{edge_type['vertex_type_pair_relations'][0]['source_vertex']}.id",
                            },
                            "property": "id",
                        }
                    ],
                    "destination_vertex_mappings": [
                        {
                            "column": {
                                "index": 1,
                                "name": f"{edge_type['vertex_type_pair_relations'][0]['destination_vertex']}.id",
                            },
                            "property": "id",
                        }
                    ],
                    "column_mappings": [],
                }

                # Map the edge properties to CSV columns
                for index, prop in enumerate(edge_type["properties"]):
                    edge_mapping["column_mappings"].append(
                        {
                            "column": {
                                "index": index + 2,
                                "name": prop["property_name"],
                            },
                            "property": prop["property_name"],
                        }
                    )

                import_config["edge_mappings"].append(edge_mapping)

            return import_config

        driver = Driver()
        graph_id = ""
        with driver.session() as sess:
            graph_def = {
                "name": name,
                "description": f"This is a graph from graphy you dataset: {name}",
                "schema": schema,
            }
            create_graph_request = CreateGraphRequest.from_dict(graph_def)
            resp = sess.list_graphs()
            if resp.is_error():
                raise Exception(f"Failed to list graphs: {resp.get_status_message()}")
            else:
                for graph_info in resp.get_value():
                    if name == graph_info.name:
                        logging.info(f"Graph `{name}` already exists in Interactive")
                        return graph_info.id

            resp = sess.create_graph(create_graph_request)
            if resp.is_error():
                raise Exception(f"Failed to create graph: {resp.get_status_message()}")
            else:
                graph_id = resp.get_value().graph_id

            graph_path = os.path.join(self.data_path, "graph")
            import_config = build_import_config_from_schema(schema, graph_path)

            bulk_load_request = SchemaMapping.from_dict(import_config)
            resp = sess.bulk_loading(graph_id, bulk_load_request)

            if resp.is_error():
                raise Exception(f"Failed to import graph: {resp.get_status_message()}")
            else:
                job_id = resp.get_value().job_id

                while True:
                    resp = sess.get_job(job_id)
                    if resp.is_error():
                        raise Exception(
                            f"Failed to import graph: {resp.get_status_message()}"
                        )
                    status = resp.get_value().status
                    if status == "SUCCESS":
                        break
                    elif status == "FAILED":
                        raise Exception(f"Import job {job_id} failed")
                    else:
                        time.sleep(1)

            return graph_id

    def start_interactive_service(self, graph_id):
        driver = Driver()
        with driver.session() as sess:
            resp = sess.start_service(
                start_service_request=StartServiceRequest(graph_id=graph_id)
            )
            if resp.is_error():
                raise Exception(
                    f"Start service for {graph_id} failed: {resp.get_status_message()}"
                )

    def delete_interactive_service(self, graph_id):
        driver = Driver()
        with driver.session() as sess:
            resp = sess.stop_service()
            if resp.is_error():
                raise Exception(
                    f"Stop service for {graph_id} failed: {resp.get_status_message()}"
                )

            resp = sess.delete_graph(graph_id)
            if resp.is_error():
                raise Exception(
                    f"Delete graph {graph_id} failed: {resp.get_status_message()}"
                )
