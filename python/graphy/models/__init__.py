"""
  __init__.py for the models package
"""

from langchain_community.chat_models import ChatOllama
from langchain_openai import ChatOpenAI

from .model_context_size import models_tokens
from .embedding_model import (
    TextEmbedding,
    MyEmbedding,
    TfidfEmbedding,
    SentenceTransformerEmbedding,
)

import os

__all__ = [
    "LLM",
    "TextEmbedding",
    "MyEmbedding",
    "TfidfEmbedding",
    "SentenceTransformerEmbedding",
]

DEFAULT_LLM_MODEL_CONFIG = {
    "llm_model": "qwen-plus",
    "base_url": "https://dashscope.aliyuncs.com/compatible-mode/v1",
    "api_key": os.environ["DASHSCOPE_API_KEY"],  ### DO NOT commit,
    "model_kwargs": {
        "temperature": 0,
        "streaming": True,
    },
}


class LLM:
    def __init__(self, model, model_name, context_size, enable_streaming=False):
        self.model = model
        self.model_name = model_name
        self.context_size = context_size
        self.enable_streaming = enable_streaming


def set_llm_model(config_data: dict):
    if not config_data:
        return None
    llm_model_name = config_data.get("llm_model", "")
    base_url = config_data.get("base_url", "")
    api_key = config_data.get("api_key", "")
    if not llm_model_name:
        return None
    model_kwargs = config_data.get("model_kwargs", {})

    # Determine which model to use based on the model name
    if llm_model_name.startswith("ollama/"):
        # Case for Ollama
        model_name = llm_model_name.split("/", 1)[1]  # Extract actual model name
        llm_instance = ChatOllama(
            model=model_name,
            base_url=base_url,
            **model_kwargs,  # Pass additional configurations
        )
        context_size = models_tokens["ollama"].get(model_name, 8192)
    else:
        if not base_url:
            raise ValueError("`base_url` is required for OpenAI models")
        model_name = llm_model_name
        if not (
            model_name.startswith("qwen")
            or model_name.startswith("gpt")
            or model_name.startswith("o1")
        ):
            raise ValueError(f"Model not recognized yet: {model_name}")

        if not api_key:
            if model_name.startswith("qwen"):
                api_key = os.getenv("DASHSCOPE_API_KEY")
            elif model_name.startswith("gpt") or model_name.startswith("o1"):
                api_key = os.getenv("OPENAI_API_KEY")
            else:
                raise ValueError(f"API key not found for model: {model_name}")

        llm_instance = ChatOpenAI(
            model=llm_model_name,
            base_url=base_url,
            api_key=api_key,
            **model_kwargs,  # Pass additional configurations
        )
        context_size = models_tokens["openai"].get(model_name, 8192)

    return LLM(llm_instance, model_name, context_size)
