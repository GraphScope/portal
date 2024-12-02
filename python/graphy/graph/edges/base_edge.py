from graph.types import DataGenerator

from abc import ABC, abstractmethod
from enum import Enum, auto
from typing import Dict, Any


class EdgeType(Enum):
    """
    Enumeration of the types of edges in the workflow.
    """

    BASE = auto()
    NAVIGATOR = auto()


class AbstractEdge(ABC):

    @classmethod
    @abstractmethod
    def from_dict(cls, edge_conf: Dict[str, Any], persist_store=None):
        """
        Initializes the edge from a dictionary.

        Args:
            data (Dict[str, Any]): The dictionary containing the edge's data.
        """
        pass

    @abstractmethod
    def execute(
        self, state: Dict[str, Any], input: DataGenerator = None
    ) -> DataGenerator:
        """
        Executes the edge's logic.

        Args:
            state (Dict[str, Any]): The input state for the node.

        Returns:
            Dict[str, Any]: The output state after executing the edge.
        """
        pass


class BaseEdge(AbstractEdge):
    def __init__(
        self,
        source: str,
        target: str,
        name: str = None,
        edge_type: EdgeType = EdgeType.BASE,
    ):
        if not name:
            self.name = f"{source}-{target}"
        else:
            self.name = name
        self.source = source
        self.target = target
        self.edge_type = edge_type

    @classmethod
    def from_dict(cls, edge_conf: Dict[str, Any], persist_store=None):
        return cls(
            source=edge_conf.get("source", None),
            target=edge_conf.get("target", None),
            name=edge_conf.get("name", None),
            edge_type=EdgeType.BASE,
        )

    def execute(
        self, state: Dict[str, Any], input: DataGenerator = None
    ) -> DataGenerator:
        pass

    def __repr__(self) -> str:
        return f"Edge: {self.name}, Source: {self.source}, Target: {self.target}, Type: {self.edge_type}"
