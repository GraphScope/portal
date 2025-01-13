# utils.py

from sklearn.preprocessing import normalize
from gs_interactive.client.driver import Driver
from gs_interactive.models import *

from db import JsonFileStore
from utils import Paper
from utils.cryptography import id_generator

import uuid
import json
import csv
import os
import re
import time
import logging

DEFAULT_DELIMITER = "|"


def load_json(file_path: str) -> dict:
    with open(file_path, "r") as file:
        json_data = json.load(file)
        if "data" in json_data:
            return json_data["data"]
        else:
            return json_data


def list_to_str(lst: list) -> str:
    return ",".join(lst) if lst else ""


def write_csv(file_path: str, data: list, headers: list = None):
    if headers is None:
        if data and len(data) > 0:
            headers = list(data[0].keys())

    header_set = set(headers)

    if len(data) > 0:
        with open(file_path, "w", newline="") as file:
            writer = csv.DictWriter(
                file, fieldnames=headers, delimiter=DEFAULT_DELIMITER
            )
            writer.writeheader()
            for row in data:
                if header_set:
                    missing_fields = (
                        header_set - row.keys()
                    )  # Find missing fields in the row
                    redundant_fields = row.keys() - header_set
                    if missing_fields:
                        # Add missing fields with empty values in one go
                        row.update({field: "" for field in missing_fields})
                    for field in redundant_fields:
                        del row[field]  # Remove field from the row
                    if "authors" in row and "author" in header_set:
                        if len(row["authors"]) > 0:
                            row["author"] = row["authors"][0]
                try:
                    writer.writerow(row)
                except Exception as e:
                    print(f"Error: {e}")
                    continue


def write_json(file_path: str, data):
    with open(file_path, "w") as file:
        json.dump(data, file, indent=4)


def list_json_files(folder_path: str):
    """
    List all JSON files in the given folder.

    Args:
        folder_path (str): Path to the folder containing JSON files.

    """
    inputs = []
    try:
        for file_name in os.listdir(folder_path):
            if file_name.endswith(".json") and not file_name.startswith("_"):
                inputs.append(file_name)
    except FileNotFoundError:
        print(f"Error: Folder '{folder_path}' does not exist.")
    except Exception as e:
        print(f"An error occurred: {e}")

    return inputs


def sanitize_data(data: dict) -> dict:
    """
    Sanitize a dictionary by removing \n and \t characters from string values.

    Args:
        data (dict): The dictionary to sanitize.

    Returns:
        dict: The sanitized dictionary.
    """
    sanitized_data = {}
    for key, value in data.items():
        if isinstance(value, str):
            # Clean string values
            clean_value = re.sub(
                r"[\n\r\t" + re.escape(DEFAULT_DELIMITER) + r"]", " ", value
            ).strip()
            clean_value = clean_value.replace("\x0c", "\\f")
            sanitized_data[key] = clean_value
        elif isinstance(value, dict):
            # Recursively sanitize nested dictionaries
            sanitized_data[key] = sanitize_data(value)
        elif isinstance(value, list):
            # Recursively sanitize items in lists
            sanitized_data[key] = [
                sanitize_data(item) if isinstance(item, dict) else item
                for item in value
            ]
        else:
            # Keep other types as is
            sanitized_data[key] = value
    return sanitized_data


class GraphBuilder:
    def __init__(
        self,
        data_path,
        persist_store=None,
    ):
        self.facts_dict = {}
        self.dimensions_dict = {}
        self.edges_dict = {}
        self.data_path = data_path
        if not persist_store:
            self.persist_store = JsonFileStore(data_path)
        else:
            self.persist_store = persist_store

    def get_data(self, node_name):
        return self.dimensions_dict.get(node_name, {})

    def extract_data(self, dimension_node_names=[]):
        total_edges_dict = {}
        for folder in self.persist_store.get_total_data():
            print("Process folder: ", folder)
            paper_data = self.persist_store.get_state(folder, "PaperNew")
            if not paper_data:
                paper_data = self.persist_store.get_state(folder, "Paper")
            edge_data = self.persist_store.get_state(folder, "_Edges")
            if paper_data:
                paper_data = paper_data.get("data", {})
                paper_data["node_type"] = "Fact"
                # id must present
                if not paper_data.get("id", ""):
                    # this is a bug of inconsistent data
                    if "title" in paper_data:
                        paper_data["id"] = id_generator(paper_data["title"])
                    else:
                        continue
                # some hacking messy stuff
                if "reference" in paper_data:
                    del paper_data["reference"]
                if "cited_by" in paper_data:
                    del paper_data["cited_by"]
                if "data_id" in paper_data:
                    del paper_data["data_id"]
                # These present in old data
                if "abstract" in paper_data:
                    del paper_data["abstract"]
                if "primary_class" in paper_data:
                    del paper_data["primary_class"]

                paper_id = paper_data["id"]
                if not dimension_node_names:
                    dimension_node_names = self.persist_store.get_total_states(folder)
                    try:
                        dimension_node_names.remove("Paper")
                        dimension_node_names.remove("PaperNew")
                        dimension_node_names.remove("REF_DONE")
                    except ValueError:
                        pass  # Do nothing if "Paper" or REF_DONE is not in the list
                for node_name in dimension_node_names:
                    self._extract_dimension_data(
                        paper_id, paper_data, folder, node_name
                    )
                if paper_id not in self.facts_dict:
                    self.facts_dict[paper_id] = sanitize_data(paper_data)
            if edge_data:
                for edge_name, edge_pairs in edge_data.items():
                    source_nodes_set = set()
                    for pair in edge_pairs:
                        source, _ = pair.split("|")
                        source_nodes_set.add(source)

                    formatted_edges = [
                        {"source": source, "target": paper_id}
                        for source in source_nodes_set
                    ]
                    total_edges_dict.setdefault(edge_name, []).extend(formatted_edges)

        for name, edges in total_edges_dict.items():
            edge_vec = self.edges_dict.setdefault(name, [])
            for edge in edges:
                # the edge can only be appended if both vertices present as fact nodes
                if (
                    edge["source"] != edge["target"]
                    and edge["source"] in self.facts_dict
                    and edge["target"] in self.facts_dict
                ):
                    edge_vec.append(edge)

    def _extract_dimension_data(
        self,
        paper_id: str,
        paper_data: dict,
        folder: str,
        node_name: str,
        edge_name: str = None,
    ):
        data_items = self.persist_store.get_state(folder, node_name)

        if data_items:
            data_items = data_items.get("data", {})
            if not isinstance(data_items, list):
                if len(data_items) == 1:  # If there's only one item, update directly
                    paper_data.update({node_name: next(iter(data_items.values()))})
                elif isinstance(data_items, dict):  # Otherwise, handle dictionary
                    for key, val in data_items.items():
                        paper_data.update({f"{node_name}_{key}": val})
                else:
                    print(f"Error: Invalid data format for {node_name} in {folder}")
            else:
                if node_name not in self.dimensions_dict:
                    dimensions_dict = self.dimensions_dict.setdefault(node_name, {})
                else:
                    dimensions_dict = self.dimensions_dict[node_name]
                if not edge_name:
                    edge_name = f"Paper_Has_{node_name}"
                if edge_name not in self.edges_dict:
                    edges = self.edges_dict.setdefault(edge_name, [])
                else:
                    edges = self.edges_dict[edge_name]
                for idx, item in enumerate(data_items):
                    data_id = id_generator(f"{paper_id}_{node_name}_{idx}")

                    if data_id not in dimensions_dict:
                        dimensions_dict[data_id] = {
                            "id": data_id,
                            "node_type": "Dimension",
                        }
                        dimensions_dict[data_id].update(sanitize_data(item))
                        edges.append(
                            {
                                "source": paper_id,
                                "target": data_id,
                            }
                        )

    def build_graph(self, output_path=None):
        if output_path:
            graph_path = os.path.join(output_path, "_graph")
        else:
            graph_path = os.path.join(self.data_path, "_graph")
        os.makedirs(graph_path, exist_ok=True)
        gs_schemas = {"vertex_types": [], "edge_types": []}
        paper_headers = Paper.header()
        paper_headers.remove("reference")
        paper_headers.remove("cited_by")
        paper_headers.append("node_type")
        paper_headers.append("Topic")
        paper_headers.append("Background_problem_definition")
        paper_headers.append("Background_problem_value")
        paper_headers.append("Background_existing_solutions")

        write_csv(
            os.path.join(graph_path, "Paper.csv"),
            list(self.facts_dict.values()),
            headers=paper_headers,
        )

        paper_schema = {}
        for paper in self.facts_dict.values():
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
        for node, data in self.dimensions_dict.items():
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
            if "_" not in edge:
                target_name = "Paper"
            else:
                # Ensure edge has enough parts when split
                parts = edge.split("_")
                if len(parts) >= 3:
                    target_name = parts[2]
                else:
                    target_name = "None"

            edge_schema = {
                "type_name": edge,
                "vertex_type_pair_relations": [
                    {
                        "source_vertex": "Paper",
                        "destination_vertex": target_name,
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

            graph_path = os.path.join(self.data_path, "_graph")
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
