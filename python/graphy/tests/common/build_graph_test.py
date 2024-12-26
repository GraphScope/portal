import pytest
import os

from tempfile import TemporaryDirectory

from utils.data_extractor import GraphBuilder


def test_graphy_data():
    input_data = "inputs/graphy_raw_data"
    temp_dir = TemporaryDirectory()
    output_path = os.path.join(temp_dir.name, "graphyourdata", "build_graph_test")
    graph_builder = GraphBuilder(input_data)

    graph_builder.extract_data()

    assert len(graph_builder.facts_dict) == 12
    assert len(graph_builder.dimensions_dict.keys()) == 4
    for name in ["Contribution", "Challenge", "Experiment", "Solution"]:
        assert name in graph_builder.dimensions_dict
    # each dimension + one reference
    assert len(graph_builder.edges_dict.keys()) == 5

    graph_builder.build_graph(output_path)

    assert os.path.exists(os.path.join(output_path, "_graph", "schema.json"))
    assert os.path.exists(os.path.join(output_path, "_graph", "Paper.csv"))
    assert os.path.exists(os.path.join(output_path, "_graph", "Contribution.csv"))
    assert os.path.exists(
        os.path.join(output_path, "_graph", "Paper_Has_Contribution.csv")
    )
    assert os.path.exists(os.path.join(output_path, "_graph", "Challenge.csv"))
    assert os.path.exists(
        os.path.join(output_path, "_graph", "Paper_Has_Challenge.csv")
    )
    assert os.path.exists(os.path.join(output_path, "_graph", "Experiment.csv"))
    assert os.path.exists(
        os.path.join(output_path, "_graph", "Paper_Has_Experiment.csv")
    )
    assert os.path.exists(os.path.join(output_path, "_graph", "Solution.csv"))
    assert os.path.exists(os.path.join(output_path, "_graph", "Paper_Has_Solution.csv"))
    assert os.path.exists(os.path.join(output_path, "_graph", "Reference.csv"))

    temp_dir.cleanup()
