import pytest
import requests
import json
import os

from utils.cryptography import encrypt_key, decrypt_key

# Base URL for the API server
BASE_URL = "http://127.0.0.1:9999"

# Sample dataset_id and file path for tests
DATASET_ID = "8547eb64-a106-5d09-8950-8a47fb9292dc"
SAMPLE_FILE_PATH = "inputs/samples/graphrag.pdf"


@pytest.fixture(scope="module")
def setup_dataset():
    # Create the dataset
    with open(SAMPLE_FILE_PATH, "rb") as file:
        response = requests.post(f"{BASE_URL}/api/dataset", files={"file": file})

    assert response.status_code == 200

    data = response.json()
    assert data["data"]["dataset_id"] == DATASET_ID

    # Yield dataset_id for tests and cleanup afterward
    yield DATASET_ID


def test_get_dataset_metadata(setup_dataset):
    response = requests.get(
        f"{BASE_URL}/api/dataset", params={"dataset_id": DATASET_ID}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["data"]["id"] == DATASET_ID


def test_create_llm_config(setup_dataset):
    payload = {
        "dataset_id": DATASET_ID,
        "llm_model": "qwen-plus",
        "base_url": "https://dashscope.aliyuncs.com/compatible-mode/v1",
        "api_key": "xxx",
        "model_kwargs": {"streaming": True},
    }
    response = requests.post(f"{BASE_URL}/api/llm/config", json=payload)
    assert response.status_code == 200


def test_get_llm_config(setup_dataset):
    response = requests.get(
        f"{BASE_URL}/api/llm/config", params={"dataset_id": DATASET_ID}
    )
    assert response.status_code == 200
    data = response.json()
    assert decrypt_key(data["data"]["api_key"]) == "xxx"


def test_create_llm_config(setup_dataset):
    payload = {
        "dataset_id": DATASET_ID,
        "llm_model": "qwen-plus",
        "base_url": "https://dashscope.aliyuncs.com/compatible-mode/v1",
        "api_key": os.environ.get("DASHSCOPE_API_KEY", "TEST_KEY"),
        "model_kwargs": {"streaming": True},
    }
    response = requests.post(f"{BASE_URL}/api/llm/config", json=payload)
    assert response.status_code == 200


def test_get_llm_config(setup_dataset):
    response = requests.get(
        f"{BASE_URL}/api/llm/config", params={"dataset_id": DATASET_ID}
    )
    assert response.status_code == 200
    data = response.json()
    assert decrypt_key(data["data"]["api_key"]) == os.environ.get(
        "DASHSCOPE_API_KEY", "TEST_KEY"
    )


def test_create_workflow_config(setup_dataset):
    workflow_json = {
        "dataset_id": DATASET_ID,
        "workflow_json": {
            "nodes": [
                {"name": "Paper"},
                {
                    "name": "Contribution",
                    "query": "**Question**:\nList all contributions of the paper...",
                    "extract_from": ["1"],
                    "output_schema": {
                        "type": "array",
                        "description": "A list of contributions.",
                        "item": [
                            {
                                "name": "original",
                                "type": "string",
                                "description": "The original contribution sentences.",
                            },
                            {
                                "name": "summary",
                                "type": "string",
                                "description": "The summary of the contribution.",
                            },
                        ],
                    },
                },
                {
                    "name": "Challenge",
                    "query": "**Question**:\nPlease summarize some challenges in this paper...",
                    "extract_from": [],
                    "output_schema": {
                        "type": "array",
                        "description": "A list of challenges...",
                        "item": [
                            {
                                "name": "name",
                                "type": "string",
                                "description": "The summarized name of the challenge.",
                            },
                            {
                                "name": "description",
                                "type": "string",
                                "description": "The description of the challenge.",
                            },
                            {
                                "name": "solution",
                                "type": "string",
                                "description": "The solution of the challenge.",
                            },
                        ],
                    },
                },
            ],
            "edges": [
                {"source": "Paper", "target": "Contribution"},
                {"source": "Contribution", "target": "Challenge"},
            ],
        },
    }
    response = requests.post(
        f"{BASE_URL}/api/dataset/workflow/config", json=workflow_json
    )
    assert response.status_code == 200


def test_get_workflow_config(setup_dataset):
    response = requests.get(
        f"{BASE_URL}/api/dataset/workflow/config", params={"dataset_id": DATASET_ID}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["data"]["dataset_id"] == DATASET_ID
    assert len(data["data"]["workflow_json"]["nodes"]) == 3
    assert len(data["data"]["workflow_json"]["edges"]) == 2


@pytest.mark.skip(reason="requires LLM connection")
def test_extract(setup_dataset):
    response = requests.post(
        f"{BASE_URL}/api/dataset/extract",
        json={"dataset_id": DATASET_ID, "thread_num": 1},
    )
    print(response.json())
    assert response.status_code == 200


@pytest.mark.skip(reason="requires LLM connection")
def test_get_extracted_data(setup_dataset):
    response = requests.get(
        f"{BASE_URL}/api/dataset/extract", params={"dataset_id": DATASET_ID}
    )
    print(response.json())
    assert response.status_code == 200

    response = requests.get(
        f"{BASE_URL}/api/dataset/extract",
        params={"dataset_id": DATASET_ID, "workflow_node_names": "Challenge"},
    )
    print(response.json())
    assert response.status_code == 200


@pytest.mark.skip(reason="requires LLM connection")
def test_graphy_data(setup_dataset):
    response = requests.post(
        f"{BASE_URL}/api/dataset/graphy", json={"dataset_id": DATASET_ID}
    )
    print(response)
    assert response.status_code == 200


@pytest.mark.skip(reason="requires LLM connection")
def test_get_graphy_data(setup_dataset):
    response = requests.get(
        f"{BASE_URL}/api/dataset/graphy", params={"dataset_id": DATASET_ID}
    )
    print(response)
    assert response.status_code == 200


def test_delete_dataset(setup_dataset):
    # Clean up by deleting the dataset
    response = requests.delete(f"{BASE_URL}/api/dataset/{DATASET_ID}")
    assert response.status_code == 200
