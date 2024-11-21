import pytest

from utils.data_extractor import GraphBuilder


def test_graphy_data():
    input_data = "inputs/graphy_raw_data"
    graph_builder = GraphBuilder(input_data)

    graph_builder.extract_fact_data()

    assert len(graph_builder.facts_dict) == 12
    assert len(graph_builder.dimensions_dict.keys()) == 5
    for name in ["Background", "Contribution", "Challenge", "Experiment", "Solution"]:
        assert name in graph_builder.dimensions_dict

    # each dimension + one reference
    assert len(graph_builder.edges_dict.keys()) == 6

    # graph_builder.build_graph()
