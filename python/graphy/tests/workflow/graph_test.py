import pytest
from graph import BaseGraph
from graph.edges import BaseEdge
from graph.nodes import BaseNode


def test_add_node():
    graph = BaseGraph()
    node = BaseNode(name="Node1")
    graph.add_node(node)
    assert "Node1" in graph.nodes


def test_add_duplicate_node():
    graph = BaseGraph()
    node = BaseNode(name="Node1")
    graph.add_node(node)
    with pytest.raises(ValueError):
        graph.add_node(node)


def test_add_edge():
    graph = BaseGraph()
    node1 = BaseNode(name="Node1")
    node2 = BaseNode(name="Node2")
    graph.add_node(node1)
    graph.add_node(node2)

    edge = BaseEdge(name="Edge1", source="Node1", target="Node2")
    graph.add_edge(edge)

    assert "Edge1" in graph.edges
    assert "Edge1" in graph.adjacency_list["Node1"]


def test_add_edge_invalid_nodes():
    graph = BaseGraph()
    edge = BaseEdge(name="Edge1", source="Node1", target="Node2")
    with pytest.raises(ValueError):
        graph.add_edge(edge)


def test_remove_node():
    graph = BaseGraph()
    node = BaseNode(name="Node1")
    graph.add_node(node)
    graph.remove_node_by_name("Node1")

    assert "Node1" not in graph.nodes
    assert "Node1" not in graph.adjacency_list


def test_remove_edge():
    graph = BaseGraph()
    node1 = BaseNode(name="Node1")
    node2 = BaseNode(name="Node2")
    graph.add_node(node1)
    graph.add_node(node2)

    edge = BaseEdge(name="Edge1", source="Node1", target="Node2")
    graph.add_edge(edge)
    graph.remove_edge_by_name("Edge1")

    assert "Edge1" not in graph.edges
    assert "Edge1" not in graph.adjacency_list["Node1"]


def test_get_adjacency_edges():
    graph = BaseGraph()
    node1 = BaseNode(name="Node1")
    node2 = BaseNode(name="Node2")
    graph.add_node(node1)
    graph.add_node(node2)

    edge = BaseEdge(name="Edge1", source="Node1", target="Node2")
    graph.add_edge(edge)

    adjacency_edges = graph.get_adjacent_edges("Node1")
    assert len(adjacency_edges) == 1
    assert adjacency_edges[0].name == "Edge1"
