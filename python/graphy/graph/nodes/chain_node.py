from .base_node import BaseNode, NodeType, NodeCache, DataGenerator
from memory import CachedMemoryBlock, MemoryBlock
from config import WF_STATE_CACHE_KEY, WF_STATE_MEMORY_KEY
from utils.json_parser import JsonOutputParserFormatter


from typing import Any, Dict, List, Generator

from langchain_core.runnables import Runnable
from langchain_core.exceptions import OutputParserException
from langchain_core.prompts import PromptTemplate
from langchain_core.language_models.llms import BaseLLM
from langchain_core.pydantic_v1 import BaseModel
from langchain_core.output_parsers import StrOutputParser
from utils.profiler import profiler

import logging

logger = logging.getLogger(__name__)


class BaseChainNode(BaseNode):
    def __init__(
        self,
        node_name: str,
        llm: BaseLLM,
        parser_llm: BaseLLM,
        json_format: BaseModel = None,
        query_template: str = "",
        max_token_size: int = 8192,
        dependent_nodes=[],
        is_debugging: bool = False,
        enable_streaming: bool = False,
    ):
        BaseNode.__init__(self, node_name)
        self.llm = llm
        self.parser_llm = parser_llm
        self.json_format = json_format
        self.query_template = query_template
        self.max_token_size = max_token_size
        self.dependent_nodes = dependent_nodes
        self.is_debugging = is_debugging
        self.enable_streaming = enable_streaming

        generate_template = """
        User:
        {input}

        Memory:
        {memory}

        Answer:
        """

        self.generate_prompt = PromptTemplate(
            template=generate_template,
            input_variables=["memory", "input"],
        )

        if self.json_format:
            self.json_parser = JsonOutputParserFormatter(
                self.json_format, self.parser_llm
            )
        else:
            self.json_parser = None

        self.generate_chain = self.generate_prompt | llm
        self.memory = ""
        self.query = ""

    def make_query(self, state) -> str:
        query = self.query_template
        response_map = {}
        memory_manager = state.get(WF_STATE_MEMORY_KEY, None)
        for node in self.dependent_nodes:
            response_map[node] = ""
            node_cache: NodeCache = state.get(WF_STATE_CACHE_KEY, {}).get(node)
            if node_cache:
                cached_response = node_cache.get_response()
                if cached_response:
                    if memory_manager:
                        memory_manager.clear_memory()
                        memory_manager.add_memory_block(
                            CachedMemoryBlock(
                                self.llm,
                                response=cached_response,
                            )
                        )
                        response_map.update({node: memory_manager.get_memory_str()})
                    else:
                        response_map.update({node: cached_response})
        query = query.format(**response_map)

        self.query = query

    def get_memory(self) -> str:
        return self.memory

    def get_query(self) -> str:
        return self.query

    def run(self, memory: str, query: str) -> Generator[Dict[str, Any], None, None]:
        if self.enable_streaming:
            chain = self.generate_chain
            if self.json_parser:
                chain = chain | self.json_parser.get_parser_chain()
            for output in chain.stream({"memory": memory, "input": query}):
                yield output
        else:
            output = self.generate_chain.invoke({"memory": memory, "input": query})
            if self.json_parser:
                yield self.json_parser.parse(output)

    @profiler.profile(name="ChainNodeExecution")
    def execute(
        self,
        state: Dict[str, Any],
        _input: DataGenerator = None,
    ) -> DataGenerator:
        if self.query == "":
            self.make_query(state)

        memory_string = ""
        memory_manager = state.get(WF_STATE_MEMORY_KEY, None)

        if memory_manager:
            memory_string = memory_manager.get_memory_str()
            logger.debug(f"Memory blocks: {memory_manager.get_memory_blocks()}")

        output_generator = self.run(memory_string, self.query)
        self.memory = memory_string
        for output in output_generator:
            if output:
                yield output
            else:
                logger.warning(f"Received `None` while processing node: {self.name}")


class MemoryChainNode(BaseChainNode):
    def __init__(
        self,
        node_name: str,
        llm: BaseLLM,
        parser_llm: BaseLLM,
        json_format: BaseModel,
        query_template: str = "",
        max_token_size: int = 8192,
        dependent_nodes=[],
        where=None,
        block_config=None,
        is_debugging: bool = False,
        enable_streaming: bool = False,
    ):
        BaseChainNode.__init__(
            self,
            node_name,
            llm,
            parser_llm,
            json_format,
            query_template,
            max_token_size,
            dependent_nodes,
            is_debugging,
            enable_streaming,
        )
        self.where = where
        self.block_config = block_config

    @profiler.profile(name="MemoryChainNodeExecution")
    def execute(
        self, state: Dict[str, Any], _input: DataGenerator = None
    ) -> DataGenerator:
        self.make_query(state)
        memory_manager = state.get(WF_STATE_MEMORY_KEY, None)

        if memory_manager:
            memory_manager.clear_memory()
            memory_manager.update_config(self.block_config)
            memory_manager.retrieve_memory_blocks(
                self.query, self.where, self.max_token_size
            )
        else:
            logger.warning("Memory manager is not provided in the state.")

        yield from super().execute(state, _input)
