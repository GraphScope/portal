from typing import Generator, Optional, Any, Iterator, Dict
from enum import Enum, auto
import json

from llama_cpp import LogitsProcessorList, Llama
from lmformatenforcer import CharacterLevelParser, JsonSchemaParser
from lmformatenforcer.integrations.llamacpp import (
    build_llamacpp_logits_processor,
    build_token_enforcer_tokenizer_data,
)
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import PromptTemplate

import logging

logger = logging.getLogger(__name__)


class JsonParserType(Enum):
    """
    Enumeration of the types of json parser.
    """

    LANGCHAIN_FORMATTER_PARSER = auto()
    LLAMACPP_PARSER = auto()
    HUGGINGFACE_ENFORCER_PARSER = auto()


class JsonFormatter:
    def __init__(self) -> None:
        self.parser_chain = None

    def get_parser_chain(self):
        return self.parser_chain

    def parse(self, input: str):
        pass


class JsonOutputParserFormatter(JsonFormatter):
    def __init__(self, json_format, llm) -> None:
        super().__init__()

        self.llm = llm
        self.parser = JsonOutputParser(pydantic_object=json_format)

        self.parser_template = """{format_instructions}
        User: Transform the following content into JSON format: '{input}'
        Assistant:"""

        self.parser_prompt = PromptTemplate(
            template=self.parser_template,
            input_variables=["input"],
            partial_variables={
                "format_instructions": self.parser.get_format_instructions()
            },
        )

        self.parser_chain = self.parser_prompt | self.llm | self.parser

    def parse(self, input: str):
        return self.parser_chain.invoke({"input": input})


class JsonOutputParserLLamaCpp(JsonFormatter):
    def __init__(self, json_format, llm) -> None:
        super().__init__()

        self.llm = llm
        self.tokenizer_data = build_token_enforcer_tokenizer_data(self.llm)

        self.json_format = json_format

        logger.debug("## INIT LLAMA CPP ###")

    def llamacpp_with_character_level_parser(
        self, prompt: str, character_level_parser: Optional[CharacterLevelParser]
    ) -> str:
        logits_processors: Optional[LogitsProcessorList] = None
        if character_level_parser:
            logits_processors = LogitsProcessorList(
                [
                    build_llamacpp_logits_processor(
                        self.tokenizer_data, character_level_parser
                    )
                ]
            )

        output = self.llm(prompt, logits_processor=logits_processors, max_tokens=100)
        text: str = output["choices"][0]["text"]
        return text

    def get_parser_prompt(self, input: str):
        return f"Please transform the following text to JSON format: {input}"

    def parse(self, input: str):
        prompt = self.get_parser_prompt(input=input)
        return self.llamacpp_with_character_level_parser(
            prompt, JsonSchemaParser(self.json_format.schema_json())
        )
