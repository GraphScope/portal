from utils.data_extractor import GraphBuilder

import argparse

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Build and extract data into a graph.")
    parser.add_argument(
        "-i",
        "--input",
        type=str,
        help="Path to the input data file or directory containing the data.",
    )
    parser.add_argument(
        "-o",
        "--output",
        type=str,
        help="Path to save the generated graph.",
    )

    args = parser.parse_args()

    # Initialize and execute the graph builder
    graph_builder = GraphBuilder(args.input_data)
    graph_builder.extract_data()
    graph_builder.build_graph(output_path=args.output_path)
