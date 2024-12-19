import pytest

from models import set_llm_model, models_tokens
from langchain_community.chat_models import ChatOllama
from langchain_openai import ChatOpenAI


class TestConfigureLLM:
    @pytest.mark.parametrize(
        "llm_config, expected_data",
        [
            (
                {"llm_model": "ollama/llama2"},
                (ChatOllama, models_tokens["ollama"]["llama2"], "llama2"),
            ),
            (
                {
                    "llm_model": "qwen-plus",
                    "api_key": "random_key",
                    "base_url": "https://dashscope.aliyuncs.com/compatible-mode/v1",
                },
                (ChatOpenAI, models_tokens["openai"]["qwen-plus"], "qwen-plus"),
            ),
        ],
    )
    def test_create_llm(self, llm_config, expected_data):
        llm = set_llm_model(llm_config)
        assert isinstance(llm.model, expected_data[0])
        assert llm.context_size == expected_data[1]
        assert llm.model_name == expected_data[2]
