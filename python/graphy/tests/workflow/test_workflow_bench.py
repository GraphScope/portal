import os

import pytest
import pytest_benchmark
import config

from langchain_community.chat_models import ChatOllama, ChatOpenAI

from db.base_store import JsonFileStore
from chromadb.utils import embedding_functions

from models import set_llm_model
from apps.demo_app import prepare_process, run_process

CURRENT_PATH = os.path.dirname(os.path.abspath(__file__))
INPUT_FOLDER = os.path.join(CURRENT_PATH, "../../inputs/samples")
DEFAULT_EMBEDDING_MODEL = embedding_functions.DefaultEmbeddingFunction()
DEFAULT_WORKFLOW = {
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
}


def get_llm_model_config(model_name):
    if model_name == "qwen-plus":
        return {
            "llm_model": "qwen-plus",
            "base_url": "https://dashscope.aliyuncs.com/compatible-mode/v1",
            "api_key": os.environ["DASHSCOPE_API_KEY"],
            "model_kwargs": {"stop": "<|eot_id|>"},
        }
    elif model_name == "llama3.1":
        return {
            "llm_model": "ollama/llama3.1",
            "base_url": "http://localhost:11434",
        }
    else:
        # Add more models if needed in the benchmark
        raise ValueError(f"Unsupported model name: {model_name}")


def get_llm_model(model_name):
    if model_name == "qwen-plus":
        return ChatOpenAI(
            model_name="qwen-plus",
            base_url="https://dashscope.aliyuncs.com/compatible-mode/v1",
            api_key=os.environ["DASHSCOPE_API_KEY"],
            model_kwargs={"stop": "<|eot_id|>"},
            streaming=True,
        )
    elif model_name == "llama3.1":
        return ChatOllama(
            model="llama3.1",
            base_url="http://localhost:11434",
            stop=["<|eot_id|>"],
        )
    else:
        # Add more models if needed in the benchmark
        raise ValueError(f"Unsupported model name: {model_name}")


@pytest.mark.parametrize("max_workers", [1, 2, 4])
def test_run_with_parallelisms(benchmark, max_workers):
    global WF_OUTPUT_DIR
    config.WF_OUTPUT_DIR = os.path.join(config.WF_DATA_DIR, f"output-{max_workers}")
    persist_store = JsonFileStore(config.WF_OUTPUT_DIR)
    default_llm_model = get_llm_model("llama3.1")
    wf_dict = prepare_process(
        INPUT_FOLDER,
        default_llm_model,
        DEFAULT_EMBEDDING_MODEL,
        DEFAULT_WORKFLOW,
        persist_store,
        max_token_size=4096,
    )

    benchmark(
        run_process,
        wf_dict,
        persist_store,
        max_workers=max_workers,
        enable_profiler=False,
    )


@pytest.mark.parametrize("model_name", ["llama3.1", "qwen-plus"])
def test_run_with_llms(benchmark, model_name):
    global WF_OUTPUT_DIR
    config.WF_OUTPUT_DIR = os.path.join(config.WF_DATA_DIR, f"output-{model_name}")
    llm_model = get_llm_model(model_name)
    persist_store = JsonFileStore(config.WF_OUTPUT_DIR)
    wf_dict = prepare_process(
        INPUT_FOLDER,
        llm_model,
        DEFAULT_EMBEDDING_MODEL,
        DEFAULT_WORKFLOW,
        persist_store,
        max_token_size=4096,
    )

    benchmark(
        run_process,
        wf_dict,
        persist_store,
        max_workers=1,
        enable_profiler=False,
    )
