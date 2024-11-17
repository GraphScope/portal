from typing import List, Dict
from .base_edge import BaseEdge
from .nodes import BaseNode


class BaseGraph:
    """
    Base class representing a simple graph structure with nodes and edges.
    """

    def __init__(self):
        self.nodes: Dict[str, BaseNode] = {}
        self.edges: Dict[str, BaseEdge] = {}
        self.adjacency_list: Dict[str, List[str]] = {}

    def get_node_names(self) -> List[str]:
        """Returns a list of all node names in the graph."""
        return list(self.nodes.keys())

    def add_node(self, node: BaseNode):
        """Adds a node to the graph."""
        if node.name in self.nodes:
            raise ValueError(f"Node {node.name} already exists.")
        self.nodes[node.name] = node
        self.adjacency_list[node.name] = []

    def remove_node_by_name(self, node_name: str):
        """Removes a node and its associated edges from the graph."""
        if node_name not in self.nodes:
            raise ValueError(f"Node {node_name} does not exist.")
        # Remove edges associated with this node
        for edge_name in self.adjacency_list[node_name]:
            self.edges.pop(edge_name, None)
        del self.adjacency_list[node_name]
        del self.nodes[node_name]

        # Remove any edges pointing to this node
        for source, edges in self.adjacency_list.items():
            self.adjacency_list[source] = [
                e for e in edges if self.edges[e].target != node_name
            ]

    def add_edge(self, edge: BaseEdge):
        """Adds an edge to the graph."""
        if edge.name in self.edges:
            raise ValueError(f"Edge {edge.name} already exists.")
        if edge.source not in self.nodes or edge.target not in self.nodes:
            raise ValueError("Both source and target nodes must exist in the graph.")
        self.edges[edge.name] = edge
        self.adjacency_list[edge.source].append(edge.name)

    def remove_edge_by_name(self, edge_name: str):
        """Removes an edge from the graph."""
        if edge_name not in self.edges:
            raise ValueError(f"Edge {edge_name} does not exist.")
        edge = self.edges[edge_name]
        self.adjacency_list[edge.source].remove(edge_name)
        del self.edges[edge_name]

    def get_adjacent_edges(self, node_name: str) -> List[BaseEdge]:
        """Returns a list of edges adjacent to a given node."""
        return [self.edges[edge] for edge in self.adjacency_list.get(node_name, [])]

    def __repr__(self):
        return f"Nodes: {self.nodes.keys()}, Edges: {self.adjacency_list}"
