from .base_node import BaseNode, NodeCache, DataGenerator
from memory.llm_memory import VectorDBHierarchy
from prompts.paper_reading_prompts import TEMPLATE_ACADEMIC_RESPONSE
from memory import CachedMemoryBlock
from config import WF_STATE_CACHE_KEY, WF_STATE_MEMORY_KEY
from utils.json_parser import JsonOutputParserFormatter
from utils.profiler import profiler

from typing import Any, Dict, List, Generator
from langchain_core.prompts import PromptTemplate
from langchain_core.language_models.llms import BaseLLM
from langchain_core.pydantic_v1 import BaseModel, Field, create_model


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
            if not memory_string:
                logger.warning(
                    f"Memory string is empty while processing node: {self.name}"
                )
                return

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


class PaperDimensionExtractNode(BaseChainNode):
    def __init__(
        self,
        node_name: str,
        llm: BaseLLM,
        parser_llm: BaseLLM,
        output_format: BaseModel,
        input_query: str,
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
            query_template=input_query,
            max_token_size=max_token_size,
            enable_streaming=enable_streaming,
        )
        self.where = where
        self.block_config = block_config
        self.query_dependency = ""
        self.dependent_nodes = []

    @classmethod
    def from_dict(
        cls,
        node_dict: Dict[str, Any],
        llm_model: BaseLLM,
        parser_model: BaseLLM,
        max_token_size: int = 8192,
        enable_streaming: bool = False,
    ) -> "PaperDimensionExtractNode":
        """
        Creates an PaperDimensionExtractNode instance from a dictionary.

        Args:
            node_dict: Dictionary containing node configuration.
            llm_model: The LLM model to be used.
            parser_model: The parser model to be used.
            max_token_size: Maximum token size for the node.
            enable_streaming: Flag to enable or disable streaming.

        Returns:
            PaperDimensionExtractNode: An initialized PaperDimensionExtractNode instance.
        """
        # Build output schema
        items = {}
        for item in node_dict["output_schema"]["item"]:
            item_type = item["type"]
            if item_type == "string":
                items[item["name"]] = (str, Field(description=item["description"]))
            elif item_type == "int":
                items[item["name"]] = (int, Field(description=item["description"]))
            else:
                raise ValueError(f"Unsupported type: {item_type}")

        ItemClass = create_model(node_dict["name"] + "ItemClass", **items)

        # Determine the type of data (array or single)
        if node_dict["output_schema"]["type"] == "array":
            item_type = {
                "data": (
                    List[ItemClass],
                    Field(description=node_dict["output_schema"]["description"]),
                )
            }
        elif node_dict["output_schema"]["type"] == "single":
            item_type = {
                "data": (
                    ItemClass,
                    Field(description=node_dict["output_schema"]["description"]),
                )
            }
        else:
            raise ValueError(
                f"Unsupported output schema type: {node_dict['output_schema']['type']}"
            )

        NodeClass = create_model(node_dict["name"] + "NodeClass", **item_type)

        if "extract_from" not in node_dict or not node_dict["extract_from"]:
            where = None
        else:
            if isinstance(node_dict["extract_from"], list):
                node_dict["extract_from"] = {"exact": node_dict["extract_from"]}
            condition_dict = {}
            # remove '' in []
            exact_constraints = [
                s for s in node_dict["extract_from"].get("exact", []) if s
            ]
            match_constraints = [
                s for s in node_dict["extract_from"].get("match", []) if s
            ]

            exact_constraints_num = len(exact_constraints)
            match_constraints_num = len(match_constraints)

            if exact_constraints_num > 0:
                if match_constraints_num == 0:
                    where = {
                        "conditions": {
                            "section": {
                                "$in": ["paper_meta", "abstract"] + exact_constraints
                            }
                        },
                        "return": "all",
                        "result_num": -1,
                        "subquery": "{slot}",
                    }
                else:
                    condition_dict["$or"] = []
            else:
                if match_constraints_num == 0:
                    where = None
                else:
                    condition_dict["$or"] = []

            if "$or" in condition_dict:
                if exact_constraints_num > 0:
                    condition_dict["$or"].append(
                        {
                            "section": {
                                "$in": ["paper_meta", "abstract"] + exact_constraints
                            }
                        }
                    )
                if match_constraints_num > 0:
                    for match_constraint in match_constraints:
                        condition_dict["$or"].append(
                            {
                                "sec_name": {
                                    "$in": {
                                        "conditions": {
                                            "type": VectorDBHierarchy.FirstLayer.value
                                        },
                                        "return": "documents",
                                        "subquery": match_constraint,
                                        "result_num": 1,
                                    }
                                }
                            }
                        )

                if len(condition_dict["$or"]) == 1:
                    condition_dict = condition_dict["$or"][0]
                where = {
                    "conditions": condition_dict,
                    "return": "all",
                    "result_num": -1,
                    "subquery": "{slot}",
                }

        # Create and return the PaperDimensionExtractNode instance
        return cls(
            node_name=node_dict["name"],
            llm=llm_model,
            parser_llm=parser_model,
            output_format=NodeClass,
            input_query=node_dict["query"],
            max_token_size=max_token_size,
            enable_streaming=enable_streaming,
            block_config=None,
            where=where,
        )

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

    @profiler.profile(name="PaperExtractExecution")
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

        # Format query for paper reading
        self.query = TEMPLATE_ACADEMIC_RESPONSE.format(user_query=self.query)

        yield from super().execute(state, _input)
