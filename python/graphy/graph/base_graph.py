from typing import List, Dict
from .edges import BaseEdge
from .nodes import BaseNode


class BaseGraph:
    """
    Base class representing a simple graph structure with nodes and edges.
    """

    def __init__(self):
        self.node_names = []
        self.nodes: Dict[str, BaseNode] = {}
        self.edges: Dict[str, BaseEdge] = {}
        self.adjacency_list: Dict[str, List[str]] = {}

    def get_node_names(self) -> List[str]:
        """Returns a list of all node names in the graph."""
        return self.node_names

    def get_first_node_name(self) -> None | str:
        """Returns the name of the first node in the graph."""
        if not self.node_names:
            return None
        else:
            return self.node_names[0]

    def get_first_node(self) -> None | BaseNode:
        """Returns the first node in the graph."""
        first_node_name = self.get_first_node_name()
        if first_node_name:
            return self.get_node(first_node_name)
        else:
            return None

    def add_node(self, node: BaseNode):
        """Adds a node to the graph."""
        if node.name in self.nodes:
            raise ValueError(f"Node {node.name} already exists.")
        self.node_names.append(node.name)
        self.nodes[node.name] = node
        self.adjacency_list[node.name] = []

    def get_node(self, node_name: str) -> BaseNode:
        """Returns a node from the graph."""
        return self.nodes.get(node_name)

    def remove_node_by_name(self, node_name: str):
        """Removes a node and its associated edges from the graph."""
        if node_name not in self.nodes:
            raise ValueError(f"Node {node_name} does not exist.")
        # Remove edges associated with this node
        for edge_name in self.adjacency_list[node_name]:
            self.edges.pop(edge_name, None)
        del self.adjacency_list[node_name]
        del self.nodes[node_name]
        self.node_names.remove(node_name)

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

    def get_adjacent_nodes(self, node_name: str) -> List[BaseNode]:
        """Returns a list of edges adjacent to a given node."""
        return [
            self.get_node(self.edges[edge].target)
            for edge in self.adjacency_list.get(node_name, [])
        ]

    def nodes_count(self) -> int:
        return len(self.node_names)

    def edges_count(self) -> int:
        return len(self.edges)

    def __repr__(self):
        return f"Nodes: {self.nodes}, Edges: {self.edges}, Adjacency List: {self.adjacency_list}"
