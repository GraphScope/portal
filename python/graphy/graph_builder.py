from utils.data_extractor import GraphBuilder

import argparse


def parse_arguments():
    parser = argparse.ArgumentParser(
        description="Build and import data into GraphScope Interactive."
    )
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
        required=True,
        help="Path to save the generated graph.",
    )
    parser.add_argument(
        "-g",
        "--gs-instance-name",
        type=str,
        default=None,
        help="Name of graph instance to import to GraphScope Interactive. Default is None (no import).",
    )
    return parser.parse_args()


if __name__ == "__main__":

    args = parse_arguments()
    input = args.input
    output = args.output
    gs_instance_name = args.gs_instance_name

    # Initialize and execute the graph builder
    graph_builder = GraphBuilder(input, output)
    if input:
        graph_builder.extract_data()
        schema = graph_builder.build_graph(output_path=args.output)
    else:
        schema = graph_builder.get_interactive_schema()
    if gs_instance_name:
        graph_id = graph_builder.import_to_interactive(schema, gs_instance_name)
        graph_builder.start_interactive_service(graph_id)
