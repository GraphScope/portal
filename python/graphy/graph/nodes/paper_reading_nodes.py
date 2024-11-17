from .base_node import BaseNode, NodeType, NodeCache
from .chain_node import BaseChainNode, DataGenerator
from .pdf_extract_node import PDFExtractNode
from graph.base_graph import BaseGraph
from graph.base_edge import BaseEdge
from memory.llm_memory import VectorDBHierarchy
from prompts import TEMPLATE_ACADEMIC_RESPONSE
from config import WF_STATE_MEMORY_KEY

from langchain_core.pydantic_v1 import BaseModel, Field, create_model
from langchain_core.language_models.llms import BaseLLM
from langchain_core.embeddings import Embeddings

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


def create_inspector_graph(
    graph_dict: Dict[str, Any],
    llm_model: BaseLLM,
    parser_model: BaseLLM,
    embeddings_model: Embeddings,
    max_token_size: int = 8192,
    enable_streaming: bool = False,
) -> BaseGraph:
    nodes_dict = {}
    nodes = []
    edges = []
    start_node = "Paper"

    for node in graph_dict["nodes"]:
        if node["name"] == start_node:  # node_0 = pdf_extract
            nodes_dict[node["name"]] = PDFExtractNode(
                embeddings_model,
                start_node,
            )
        else:
            extract_node = ExtractNode.from_dict(
                node,
                llm_model,
                parser_model,
                max_token_size,
                enable_streaming,
            )
            nodes_dict[node["name"]] = extract_node

    for _, value in nodes_dict.items():
        nodes.append(value)
    for edge in graph_dict["edges"]:
        edges.append(BaseEdge(edge["source"], edge["target"]))
        if edge["source"] != start_node:
            nodes_dict[edge["target"]].add_dependent_node(edge["source"])

    graph = BaseGraph()
    # Add all nodes
    for node in nodes:
        graph.add_node(node)

    # Add all edges
    for edge in edges:
        graph.add_edge(edge)

    return graph


class ExtractNode(BaseChainNode):
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
    ) -> "ExtractNode":
        """
        Creates an ExtractNode instance from a dictionary.

        Args:
            node_dict: Dictionary containing node configuration.
            llm_model: The LLM model to be used.
            parser_model: The parser model to be used.
            max_token_size: Maximum token size for the node.
            enable_streaming: Flag to enable or disable streaming.

        Returns:
            ExtractNode: An initialized ExtractNode instance.
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

        # Build `where` conditions
        extract_from = node_dict.get("extract_from")
        where = None
        if isinstance(extract_from, str):
            where_conditions = extract_from.split("|")
            condition_dict = (
                {
                    "sec_name": {
                        "$in": {
                            "conditions": {"type": VectorDBHierarchy.FirstLayer.value},
                            "return": "documents",
                            "subquery": where_conditions[0],
                            "result_num": 1,
                        }
                    }
                }
                if len(where_conditions) == 1
                else {
                    "$or": [
                        {
                            "sec_name": {
                                "$in": {
                                    "conditions": {
                                        "type": VectorDBHierarchy.FirstLayer.value
                                    },
                                    "return": "documents",
                                    "subquery": condition,
                                    "result_num": 1,
                                }
                            }
                        }
                        for condition in where_conditions
                    ]
                }
            )
            where = {
                "conditions": condition_dict,
                "return": "all",
                "result_num": -1,
                "subquery": "{slot}",
            }
        elif isinstance(extract_from, list):
            where = {
                "conditions": {
                    "section": {"$in": ["paper_meta", "abstract"] + extract_from}
                },
                "return": "all",
                "result_num": -1,
                "subquery": "{slot}",
            }

        # Create and return the ExtractNode instance
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


class PaperInspector(BaseNode):
    def __init__(self, name: str, graph: BaseGraph):
        super().__init__(name, NodeType.INSPECTOR)
        self.graph = graph
