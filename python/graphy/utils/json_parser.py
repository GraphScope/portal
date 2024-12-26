from typing import Generator, Optional, Any, Iterator, Dict
from enum import Enum, auto

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
