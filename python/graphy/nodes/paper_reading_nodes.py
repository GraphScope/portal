from nodes import BaseChainNode
from prompts import TEMPLATE_ACADEMIC_RESPONSE

from langchain_core.pydantic_v1 import BaseModel, Field
from langchain_core.language_models.llms import BaseLLM

from typing import Any, Dict, List, Generator
import logging

logger = logging.getLogger(__name__)


class Desc(BaseModel):
    description: str = Field(description="A detailed description of the content.")


class NameDesc(BaseModel):
    name: str = Field(description=("A short name that describes the given content."))
    description: str = Field(description="A detailed description of the content.")


class NameDescListFormat(BaseModel):
    data: List[NameDesc] = Field(
        description=("The list of contents that contain name and description.")
    )


class ExtractNode(BaseChainNode):
    def __init__(
        self,
        node_name: str,
        llm: BaseLLM,
        parser_llm: BaseLLM,
        output_format: BaseModel,
        input_query: str,
        memory_manager=None,
        max_token_size: int = 8192,
        enable_streaming: bool = False,
        block_config=None,
        where: dict = None,
    ):
        BaseChainNode.__init__(
            self,
            node_name,
            llm,
            parser_llm,
            output_format,
            memory_manager=memory_manager,
            query_template=input_query,
            max_token_size=max_token_size,
            enable_streaming=enable_streaming,
        )
        self.where = where
        self.block_config = block_config
        self.query_dependency = ""
        self.dependent_nodes = []

    def add_dependent_node(self, dependent_node):
        self.dependent_nodes.append(dependent_node)
        self.query_dependency = (
            self.query_dependency
            + "**"
            + dependent_node
            + "**:\n"
            + "{"
            + dependent_node
            + "}\n"
        )
        self.query_template = self.query_dependency + self.query_template

    def execute(self, state: Dict[str, Any]) -> Generator[Dict[str, Any], None, None]:
        self.make_query(state)

        if self.memory_manager:
            self.memory_manager.clear_memory()
            self.memory_manager.update_config(self.block_config)
            self.memory_manager.retrieve_memory_blocks(
                self.query, self.where, self.max_token_size
            )

        # Format query for paper reading
        self.query = TEMPLATE_ACADEMIC_RESPONSE.format(user_query=self.query)
        yield from super().execute(state)
