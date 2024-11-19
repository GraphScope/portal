from enum import Enum, auto
from typing import Dict, List, Any

from graph.types import DataGenerator


class EdgeType(Enum):
    """
    Enumeration of the types of edges in the workflow.
    """

    BASE = auto()
    NAVIGATOR = auto()


class BaseEdge:
    def __init__(self, source: str, target: str, name: str = None):
        if not name:
            self.name = f"{source}-{target}"
        else:
            self.name = name
        self.source = source
        self.target = target
        self.edge_type = EdgeType.BASE

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

    def __repr__(self) -> str:
        return f"Edge: {self.name}, Source: {self.source}, Target: {self.target}, Type: {self.edge_type}"
