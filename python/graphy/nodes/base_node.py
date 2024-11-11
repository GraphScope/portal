from typing import Dict, Any, List, Generator
from enum import Enum, auto

import json
import logging

logger = logging.getLogger(__name__)


class NodeType(Enum):
    """
    Enumeration of the types of nodes in the workflow.
    """

    BASE = auto()
    EXPANSION = auto()


class BaseNode:
    """
    Base class representing a node in the workflow.

    Attributes:
        name (str): The name of the node.
        node_type (NodeType): The type of the node (e.g., "base", "placeholder", "expansion").
    """

    def __init__(self, name: str, node_type: NodeType = NodeType.BASE):
        self.name = name
        self.node_type = node_type
        self.memory = ""
        self.query = ""

    def set_name(self, new_name):
        self.name = new_name

    def get_node_key(self) -> str:
        return self.name

    def get_memory(self) -> str:
        return self.memory

    def get_query(self) -> str:
        return self.query

    def pre_execute(self, state: Dict[str, Any] = None):
        """define pre-execution logic"""
        logger.info(f"Executing node: {self.get_node_key()}")

    def post_execute(self, output: Dict[str, Any] = None):
        """define post-execution logic"""
        logger.info(f"Complete executing node: {self.get_node_key()}")

    def execute(self, state: Dict[str, Any]) -> Generator[Dict[str, Any], None, None]:
        """
        Executes the node's logic.

        Args:
            state (Dict[str, Any]): The input state for the node.

        Returns:
            Dict[str, Any]: The output state from the node.
        """

        yield {}

    def __str__(self) -> str:
        return f"Node: {self.name}, Type: {self.node_type}"


# Ensure the BaseNode class is inherited properly if there are methods or attributes in BaseNode that are required.


class ExpansionNode(BaseNode):
    """An expansion node can be expanded to multiple nodes after expansion."""

    def __init__(self, name: str):
        super().__init__(name, NodeType.EXPANSION)
        self.expand_nodes = []
        self.expand_node_descriptions = {}

    def set_expand_nodes(
        self, expand_nodes: List[str], descriptions: Dict[str, str] = None
    ):
        self.expand_nodes = expand_nodes
        if descriptions:
            self.expand_node_descriptions = {
                key.lower(): value for key, value in descriptions.items()
            }

    def get_expand_nodes(self) -> List[str]:
        return self.expand_nodes

    def get_descriptions(self) -> Dict[str, str] | None:
        return self.expand_node_descriptions


class CacheType(Enum):
    """
    Enumeration of the types of memory extract method
    """

    QUERY_ONLY = auto()
    RESPONSE_ONLY = auto()
    QUERY_AND_RESPONSE = auto()
    EXTRACT_ALL = auto()


class QueryResponse(json.JSONEncoder):
    def __init__(self, query: str = None, response: str = None):
        self.query = query
        self.response = response

    def to_dict(self):
        return {"query": self.query, "response": self.response}

    def default(self, obj):
        if hasattr(obj, "to_dict"):
            return obj.to_dict()
        return super().default(obj)

    def __str__(self):
        return f"USER_query: {self.query} \n AI_response: {self.response}"


class NodeCache(json.JSONEncoder):
    """
    A class to record the query, response and context memory of a node in the workflow.
    """

    def __init__(self, name):
        self.name = name
        self.chat_history = []
        self.context = []

    def add_chat_cache(self, query, response):
        self.chat_history.append(QueryResponse(query, response))

    def get_response(self):
        if len(self.chat_history) == 0:
            return ""
        elif len(self.chat_history) == 1:
            return self.chat_history[0].response
        else:
            return "\t".join([item.response for item in self.chat_history])

    def add_context_cache(self, used_memory):
        self.context.append(used_memory)

    def get_memory_str(self, extract_type: CacheType) -> str:
        if extract_type == CacheType.QUERY_ONLY:
            return "\n".join([item.query for item in self.chat_history])
        elif extract_type == CacheType.RESPONSE_ONLY:
            return "\n".join([item.response for item in self.chat_history])
        elif extract_type == CacheType.QUERY_AND_RESPONSE:
            return "\n".join([str(item) for item in self.chat_history])
        else:
            return self.__str__()

    def to_dict(self):
        return {
            "name": self.name,
            "chat_history": [item.to_dict() for item in self.chat_history],
            "context": self.context,
        }

    def default(self, obj):
        if hasattr(obj, "to_dict"):
            return obj.to_dict()
        return super().default(obj)

    def __str__(self):
        parts = ["\n".join([str(item) for item in self.chat_history])]
        parts.append("\n".join(self.context))
        return "\n".join(parts)
