from nodes import BaseNode, NodeType, NodeCache
from memory import CachedMemoryBlock, MemoryBlock
from config import WF_STATE_CACHE_KEY
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
        memory_manager=None,
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
        self.memory_manager = memory_manager
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
        for node in self.dependent_nodes:
            response_map[node] = ""
            node_cache: NodeCache = state.get(WF_STATE_CACHE_KEY, {}).get(node)
            if node_cache:
                cached_response = node_cache.get_response()
                if cached_response:
                    if self.memory_manager:
                        self.memory_manager.clear_memory()
                        self.memory_manager.add_memory_block(
                            CachedMemoryBlock(
                                self.llm,
                                response=cached_response,
                            )
                        )
                        response_map.update(
                            {node: self.memory_manager.get_memory_str()}
                        )
                    else:
                        response_map.update({node: cached_response})
        query = query.format(**response_map)

        self.query = query

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
    def execute(self, state: Dict[str, Any]) -> Generator[Dict[str, Any], None, None]:
        if self.query == "":
            self.make_query(state)

        memory_string = ""

        if self.memory_manager:
            memory_string = self.memory_manager.get_memory_str()
            logger.debug(f"Memory blocks: {self.memory_manager.get_memory_blocks()}")

        output_generator = self.run(memory_string, self.query)
        self.memory = memory_string
        for output in output_generator:
            if output:
                yield output
            else:
                logger.warn(f"Received `None` while processing node: {self.name}")


class MemoryChainNode(BaseChainNode):
    def __init__(
        self,
        node_name: str,
        llm: BaseLLM,
        parser_llm: BaseLLM,
        json_format: BaseModel,
        memory_manager=None,
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
            memory_manager,
            query_template,
            max_token_size,
            dependent_nodes,
            is_debugging,
            enable_streaming,
        )
        self.where = where
        self.block_config = block_config

    def execute(self, state: Dict[str, Any]) -> Generator[Dict[str, Any], None, None]:
        self.make_query(state)

        if self.memory_manager:
            self.memory_manager.clear_memory()
            self.memory_manager.update_config(self.block_config)
            self.memory_manager.retrieve_memory_blocks(
                self.query, self.where, self.max_token_size
            )

        yield from super().execute(state)


class AdvancedRAGNode(BaseChainNode):
    def __init__(
        self,
        node_name: str,
        llm: BaseLLM,
        parser_llm: BaseLLM,
        json_format: BaseModel,
        memory_manager=None,
        query_template: str = "",
        max_token_size: int = 8192,
        dependent_nodes=[],
        where=None,
        is_debugging: bool = False,
        enable_streaming: bool = False,
    ):
        super().__init__(
            node_name,
            llm,
            parser_llm,
            json_format,
            memory_manager,
            query_template,
            max_token_size,
            dependent_nodes,
            is_debugging,
            enable_streaming,
        )
        self.where = where

    def generate_queries(self):
        template = """Given the context, your task is to generate at least six diverse sentences
            to retrieve relevant documents from a vector database for answering the user query.
            Note that the information from the context must be used to generate these sentences.
            By generating multiple perspectives on the user query based on the context, your goal
            is to help the user overcome some of the limitations of the distance-based similarity search.
            Focus on extracting specific details about proposed solutions, methodologies, or unique techniques.
            MUST only include the six sentences.Provide these sentences separated by newlines.

            The original query is delimited by XML tags <ORIGINAL_QUERY></ORIGINAL_QUERY> as follows:
            <ORIGINAL_QUERY>
            {query}
            </ORIGINAL_QUERY>
            """
        prompt_perspectives = PromptTemplate.from_template(template)

        generate_queries = (
            prompt_perspectives
            | self.llm
            | StrOutputParser()
            | (
                lambda x: [
                    query.strip() for query in x.split("\n")[1:] if query.strip()
                ]
            )
        )

        return generate_queries

    def retrieve_relevant_chunks(self, distance_threshold=None) -> Runnable:
        class RetrieveChunks(Runnable):
            def __init__(self, memory_manager, max_token_size, where):
                self.memory_manager = memory_manager
                self.max_token_size = max_token_size
                self.where = where
                self.distance_threshold = distance_threshold

            def invoke(
                self, queries: List[str], config: Dict[str, Any] = None
            ) -> List[str]:
                logger.info(f"Retrieving relevant chunks for queries: {queries}")
                self.memory_manager.clear_memory()
                for query in queries:
                    self.memory_manager.retrieve_memory_blocks(
                        query, self.where, self.max_token_size, self.distance_threshold
                    )
                return self.memory_manager.get_memory_blocks()

        return RetrieveChunks(self.memory_manager, self.max_token_size, self.where)

    def execute(self, state: Dict[str, Any]) -> Generator[Dict[str, Any], None, None]:
        self.make_query(state)

        (self.generate_queries() | self.retrieve_relevant_chunks()).invoke(
            {"query": self.query}
        )

        yield from super().execute(state)
