import os
import json
import time
import logging
import sys

from gs_interactive.client.driver import Driver
from gs_interactive.models import *


def get_interactive_schema(path):
    graph_path = os.path.join(path, "_graph")
    schema_json = os.path.join(graph_path, "schema.json")
    with open(schema_json, "r") as f:
        return json.load(f)


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
                "destination_vertex": edge_type["vertex_type_pair_relations"][0][
                    "destination_vertex"
                ],
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


def import_to_interactive(path, name):
    driver = Driver()
    graph_id = ""
    schema = get_interactive_schema(path)
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

        graph_path = os.path.join(path, "_graph")
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


def start_interactive_service(graph_id):
    driver = Driver()
    with driver.session() as sess:
        resp = sess.start_service(
            start_service_request=StartServiceRequest(graph_id=graph_id)
        )
        if resp.is_error():
            raise Exception(
                f"Start service for {graph_id} failed: {resp.get_status_message()}"
            )


def delete_interactive_service(graph_id):
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


logging.basicConfig(
    level=logging.INFO,
    format="[%(asctime)s] {%(pathname)s:%(lineno)d} %(levelname)s - %(message)s",
    handlers=[logging.StreamHandler()],
)


if __name__ == "__main__":
    path = sys.argv[1]
    graph_name = sys.argv[2]
    graph_id = import_to_interactive(path, graph_name)
    start_interactive_service(graph_id)
