from .base_node import BaseNode, NodeType, NodeCache, DataGenerator
from .chain_node import BaseChainNode
from .pdf_extract_node import PDFExtractNode
from memory.llm_memory import VectorDBHierarchy, PaperReadingMemoryManager
from models import LLM
from prompts import TEMPLATE_ACADEMIC_RESPONSE
from config import (
    WF_STATE_MEMORY_KEY,
    WF_STATE_EXTRACTOR_KEY,
    WF_STATE_CACHE_KEY,
    WF_IMAGE_DIR,
)
from extractor import PaperExtractor
from db import PersistentStore
from utils.profiler import profiler

from langchain_core.pydantic_v1 import BaseModel, Field, create_model
from langchain_core.language_models.llms import BaseLLM
from langchain_core.embeddings import Embeddings
from langchain_core.exceptions import OutputParserException
from typing import Any, Dict, List

import json
import os
import re
import traceback
import logging

logger = logging.getLogger(__name__)


class Desc(BaseModel):
    description: str = Field(description="A detailed description of the content.")


class NameDesc(BaseModel):
    name: str = Field(description=("A short name that describes the given content."))
    description: str = Field(description="A detailed description of the content.")


class NameDescListFormat(BaseModel):
    data: List[NameDesc] = Field(
        description=("The list of contents that contain name and description.")
    )


def process_id(base_name: str) -> str:
    # Replace invalid characters with underscores
    id_name = re.sub(r"[^a-zA-Z0-9_-]", "_", base_name)

    # Ensure it does not contain two consecutive periods
    id_name = re.sub(r"\.\.+", ".", id_name)

    # Ensure it starts with an alphanumeric character
    id_name = re.sub(r"^[^a-zA-Z0-9]+", "", id_name)

    # Trim to 63 characters
    if len(id_name) > 63:
        id_name = id_name[:63]

    # Ensure it ends with an alphanumeric character
    id_name = re.sub(r"[^a-zA-Z0-9]+$", "", id_name)

    # Ensure it has at least 3 characters
    if len(id_name) < 3:
        id_name = f"{hash(base_name)}_{id_name}"

    return id_name


def try_fix_json(raw_json: str):
    """
    Attempts to clean and parse malformed JSON strings by extracting the content
    between the first '{' and the last '}'.

    Args:
        raw_json (str): The malformed JSON string.

    Returns:
        dict: A fixed and parsed JSON object, or None if fixing fails.
    """
    try:
        # Identify the first '{' and the last '}'
        start_index = raw_json.find("{")
        end_index = raw_json.rfind("}")

        # Ensure valid indices are found
        if start_index == -1 or end_index == -1 or start_index >= end_index:
            raise OutputParserException(
                f"Failed to parse JSON: {e}", llm_output=raw_json
            )

        # Extract and clean the JSON substring
        json_content = raw_json[start_index : end_index + 1]

        # Attempt to parse the extracted JSON
        return json.loads(json_content)
    except json.JSONDecodeError as e:
        raise OutputParserException(f"Failed to parse JSON: {e}", llm_output=raw_json)


class ProgressInfo:
    def __init__(self, number=0, completed=0):
        self.number = number
        self.completed = completed

    def add(self, others: "ProgressInfo"):
        self.number += others.number
        self.completed += others.completed

    def increase(self):
        self.number += 1

    def decrease(self):
        self.number -= 1

    def complete(self):
        if self.completed < self.number:
            self.completed += 1
        else:
            logging.error(
                f"Completed: {self.completed} cannot exceed Number: {self.number}"
            )

    def get_percentage(self) -> float:
        if self.number == 0:
            return 0.0
        else:
            return 100 * self.completed / float(self.number)

    def backpedal(self):
        if self.completed > 0:
            self.completed -= 1

    def __str__(self):
        return f"{self.number}, {self.completed}"

    def __repr__(self) -> str:
        return f"ProgressInfo [ Number: {self.number}, Completed: {self.completed} ]"

    def __eq__(self, other):
        if isinstance(other, ProgressInfo):
            return self.completed == other.completed and self.number == other.number
        return False


class ExtractNode(BaseChainNode):
    def __init__(
        self,
        node_name: str,
        llm: BaseLLM,
        parser_llm: BaseLLM,
        output_format: BaseModel,
        input_query: str,
        max_token_size: int = 8192,
        enable_streaming: bool = False,
        block_config=None,
        where: dict = None,
    ):
        BaseChainNode.__init__(
            self,
            node_name,
            llm,
            parser_llm,
            output_format,
            query_template=input_query,
            max_token_size=max_token_size,
            enable_streaming=enable_streaming,
        )
        self.where = where
        self.block_config = block_config
        self.query_dependency = ""
        self.dependent_nodes = []

    @classmethod
    def from_dict(
        cls,
        node_dict: Dict[str, Any],
        llm_model: BaseLLM,
        parser_model: BaseLLM,
        max_token_size: int = 8192,
        enable_streaming: bool = False,
    ) -> "ExtractNode":
        """
        Creates an ExtractNode instance from a dictionary.

        Args:
            node_dict: Dictionary containing node configuration.
            llm_model: The LLM model to be used.
            parser_model: The parser model to be used.
            max_token_size: Maximum token size for the node.
            enable_streaming: Flag to enable or disable streaming.

        Returns:
            ExtractNode: An initialized ExtractNode instance.
        """
        # Build output schema
        items = {}
        for item in node_dict["output_schema"]["item"]:
            item_type = item["type"]
            if item_type == "string":
                items[item["name"]] = (str, Field(description=item["description"]))
            elif item_type == "int":
                items[item["name"]] = (int, Field(description=item["description"]))
            else:
                raise ValueError(f"Unsupported type: {item_type}")

        ItemClass = create_model(node_dict["name"] + "ItemClass", **items)

        # Determine the type of data (array or single)
        if node_dict["output_schema"]["type"] == "array":
            item_type = {
                "data": (
                    List[ItemClass],
                    Field(description=node_dict["output_schema"]["description"]),
                )
            }
        elif node_dict["output_schema"]["type"] == "single":
            item_type = {
                "data": (
                    ItemClass,
                    Field(description=node_dict["output_schema"]["description"]),
                )
            }
        else:
            raise ValueError(
                f"Unsupported output schema type: {node_dict['output_schema']['type']}"
            )

        NodeClass = create_model(node_dict["name"] + "NodeClass", **item_type)

        if "extract_from" not in node_dict or not node_dict["extract_from"]:
            where = None
        else:
            condition_dict = {}
            # remove '' in []
            exact_constraints = [
                s for s in node_dict["extract_from"].get("exact", []) if s
            ]
            match_constraints = [
                s for s in node_dict["extract_from"].get("match", []) if s
            ]

            exact_constraints_num = len(exact_constraints)
            match_constraints_num = len(match_constraints)

            if exact_constraints_num > 0:
                if match_constraints_num == 0:
                    where = {
                        "conditions": {
                            "section": {
                                "$in": ["paper_meta", "abstract"] + exact_constraints
                            }
                        },
                        "return": "all",
                        "result_num": -1,
                        "subquery": "{slot}",
                    }
                else:
                    condition_dict["$or"] = []
            else:
                if match_constraints_num == 0:
                    where = None
                else:
                    condition_dict["$or"] = []

            if "$or" in condition_dict:
                if exact_constraints_num > 0:
                    condition_dict["$or"].append(
                        {
                            "section": {
                                "$in": ["paper_meta", "abstract"] + exact_constraints
                            }
                        }
                    )
                if match_constraints_num > 0:
                    for match_constraint in match_constraints:
                        condition_dict["$or"].append(
                            {
                                "sec_name": {
                                    "$in": {
                                        "conditions": {
                                            "type": VectorDBHierarchy.FirstLayer.value
                                        },
                                        "return": "documents",
                                        "subquery": match_constraint,
                                        "result_num": 1,
                                    }
                                }
                            }
                        )

                if len(condition_dict["$or"]) == 1:
                    condition_dict = condition_dict["$or"][0]
                where = {
                    "conditions": condition_dict,
                    "return": "all",
                    "result_num": -1,
                    "subquery": "{slot}",
                }

        # Create and return the ExtractNode instance
        return cls(
            node_name=node_dict["name"],
            llm=llm_model,
            parser_llm=parser_model,
            output_format=NodeClass,
            input_query=node_dict["query"],
            max_token_size=max_token_size,
            enable_streaming=enable_streaming,
            block_config=None,
            where=where,
        )

    def add_dependent_node(self, dependent_node):
        self.dependent_nodes.append(dependent_node)
        self.query_dependency = (
            self.query_dependency
            + "**"
            + dependent_node
            + "**:\n"
            + "{"
            + dependent_node
            + "}\n"
        )
        self.query_template = self.query_dependency + self.query_template

    @profiler.profile(name="PaperExtractExecution")
    def execute(
        self, state: Dict[str, Any], _input: DataGenerator = None
    ) -> DataGenerator:
        self.make_query(state)
        memory_manager = state.get(WF_STATE_MEMORY_KEY, None)

        if memory_manager:
            memory_manager.clear_memory()
            memory_manager.update_config(self.block_config)
            memory_manager.retrieve_memory_blocks(
                self.query, self.where, self.max_token_size
            )
        else:
            logger.warning("Memory manager is not provided in the state.")

        # Format query for paper reading
        self.query = TEMPLATE_ACADEMIC_RESPONSE.format(user_query=self.query)

        yield from super().execute(state, _input)


class PaperInspector(BaseNode):
    def __init__(
        self,
        name: str,
        graph,
        llm_model: LLM,
        embeddings_model: Embeddings,
        vectordb,
        persist_store: PersistentStore,
    ):
        super().__init__(name, NodeType.INSPECTOR)
        self.graph = graph
        self.llm_model = llm_model
        self.embeddings_model = embeddings_model
        self.vectordb = vectordb
        self.persist_store = persist_store
        self.progress = {"total": ProgressInfo(0, 0)}
        for node in self.graph.get_node_names():
            self.progress[node] = ProgressInfo(0, 0)

    @classmethod
    def from_dict(
        cls,
        name: str,
        graph_dict: Dict[str, Any],
        llm_model: BaseLLM,
        parser_model: BaseLLM,
        embeddings_model: Embeddings,
        vectordb,
        persist_store: PersistentStore,
    ) -> "PaperInspector":
        from graph.edges.base_edge import BaseEdge
        from graph.base_graph import BaseGraph

        nodes_dict = {}
        nodes = []
        edges = []
        start_node = "Paper"

        for node in graph_dict["nodes"]:
            if node["name"] == start_node:  # node_0 = pdf_extract
                nodes_dict[node["name"]] = PDFExtractNode(
                    embeddings_model,
                    start_node,
                )
            else:
                extract_node = ExtractNode.from_dict(
                    node,
                    llm_model.model,
                    parser_model.model,
                    llm_model.context_size,
                    llm_model.enable_streaming,
                )
                nodes_dict[node["name"]] = extract_node

        for _, value in nodes_dict.items():
            nodes.append(value)
        for edge in graph_dict["edges"]:
            edges.append(BaseEdge(edge["source"], edge["target"]))
            if edge["source"] != start_node:
                nodes_dict[edge["target"]].add_dependent_node(edge["source"])

        graph = BaseGraph()
        # Add all nodes
        for node in nodes:
            graph.add_node(node)

        # Add all edges
        for edge in edges:
            graph.add_edge(edge)

        return cls(name, graph, llm_model, embeddings_model, vectordb, persist_store)

    def get_progress(self, node_name: str = "") -> ProgressInfo:
        if not node_name:
            return self.progress["total"]
        else:
            return self.progress.get(node_name, ProgressInfo(0, 0))

    def persist_edge_states(self, data_id, source_id, target_id, edge_name):
        if source_id and target_id:
            edges = self.persist_store.get_state(data_id, "_Edges")
            if not edges:
                edges = {}
            # edges.setdefault(edge_name, set()).add(f"{source_id}|{target_id}")
            if edge_name in edges:
                edges_set = set(edges[edge_name])
                edges_set.add(f"{source_id}|{target_id}")
                edges[edge_name] = list(edges_set)
            else:
                edges[edge_name] = [f"{source_id}|{target_id}"]
            self.persist_store.save_state(data_id, "_Edges", edges)

    def run_through(
        self,
        data_id,
        state,
        parent_id=None,
        edge_name="Navigator",
        continue_on_error: bool = True,
        skipped_nodes: List[str] = [],
    ):
        """
        Runs through the workflow and executes all nodes.

        Args:
            continue_on_error (bool): Whether to continue execution on error.
            is_persist (bool): Whether to dump the output as a persistent state
            skipped_nodes (List[str]): The list of nodes to skip.

        Yields:
            DataGenerator: Outputs generated by the workflow nodes.
        """

        first_node = self.graph.get_first_node()
        next_nodes = [first_node]
        is_persist = True

        while next_nodes:
            current_node = next_nodes.pop()  # Run in DFS order
            if current_node.name in skipped_nodes:
                # update global progress
                self.progress[current_node.name].complete()
                self.progress["total"].complete()
                continue

            last_output = None
            try:
                current_node.pre_execute(state)
                persist_results = self.persist_store.get_state(
                    data_id, current_node.name
                )
                if persist_results:
                    logger.info(f"Found persisted data for node '{current_node.name}'")
                    last_output = persist_results
                    is_persist = False
                else:
                    # Execute the current node
                    output_generator = current_node.execute(state)
                    for output in output_generator:
                        logger.debug(f"'{current_node.name}' produces: {output}")
                        last_output = output
                    is_persist = True
            except OutputParserException as e:
                logger.warning(
                    f"OutputParserException while executing node '{current_node.name}': {e}\nAttempting to fix JSON..."
                )
                try:
                    fixed_json = try_fix_json(e.llm_output)
                    if fixed_json:
                        logger.info(
                            f"Successfully fixed JSON for node '{current_node.name}'"
                        )
                        last_output = fixed_json
                        is_persist = True
                    else:
                        logger.error(
                            f"Failed to fix JSON for node '{current_node.name}'"
                        )
                        if not continue_on_error:
                            raise ValueError(
                                f"Error executing node '{current_node.name}': {e}"
                            )
                except Exception as fix_error:
                    logger.error(
                        f"Exception while fixing JSON for node '{current_node.name}': {fix_error}"
                    )
                    if not continue_on_error:
                        raise ValueError(
                            f"Error executing node '{current_node.name}': {fix_error}"
                        )

            except Exception as e:
                full_traceback = traceback.format_exc()
                logger.error(
                    f"Error executing node '{current_node.name}': {e}\nTraceback:\n{full_traceback}"
                )
                if not continue_on_error:
                    raise ValueError(f"Error executing node '{current_node.name}': {e}")
            finally:
                # Cache the output
                if last_output:
                    logger.debug(
                        f"The final result of '{current_node.name}': {last_output}"
                    )
                    node_caches: dict = state.get(WF_STATE_CACHE_KEY, {})
                    if node_caches:
                        node_cache: NodeCache = node_caches.setdefault(
                            current_node.name, NodeCache(current_node.name)
                        )
                        node_cache.add_chat_cache("", last_output)
                    # update global progress
                    self.progress[current_node.name].complete()
                    self.progress["total"].complete()

                    # Persist the output and queries if applicable
                    if is_persist and self.persist_store:
                        self.persist_store.save_state(
                            data_id, current_node.name, last_output
                        )
                        if current_node.get_query():
                            input_query = f"**************QUERY***************: \n {current_node.get_query()} \
                                **************MEMORY**************: \n {current_node.get_memory()}"
                            self.persist_store.save_data(
                                data_id, f"query_{current_node.name}", input_query
                            )
                        if current_node.name == first_node.name and parent_id:
                            curr_id = last_output.get("data", {}).get("id", "")
                            self.persist_edge_states(
                                data_id, parent_id, curr_id, edge_name
                            )

                current_node.post_execute(last_output)

            # Add adjacent nodes to the processing queue
            for next_node in reversed(self.graph.get_adjacent_nodes(current_node.name)):
                next_nodes.append(next_node)

    @profiler.profile(name="PaperInspectorExecution")
    def execute(
        self, state: Dict[str, Any], input: DataGenerator = None
    ) -> DataGenerator:
        """
        Executes the node's logic.

        Args:
            state (Dict[str, Any]): The input state for the node.
            input (DataGenerator): The input data generator.

        Returns:
            DataGenerator: The output data generator from the node.
        """

        for input_data in input:
            paper_file_path = input_data.get("paper_file_path", None)
            parent_id = input_data.get("parent_id", None)
            edge_name = input_data.get("edge_name", "Navigator")
            logger.info(f"Executing {self.name} for paper: {paper_file_path}")

            if not paper_file_path:
                logger.error("No 'paper_file_path' provided in input data.")
                continue
            try:
                # Initialize the paper extractor and other components
                pdf_extractor = PaperExtractor(paper_file_path)
                base_name = pdf_extractor.get_meta_data().get("title", "").lower()
                if not base_name:  # If no title, fallback to filename
                    base_name = os.path.basename(paper_file_path).split(".")[0]
                data_id = process_id(base_name)
                pdf_extractor.set_img_path(f"{WF_IMAGE_DIR}/{data_id}")

                first_node_name = self.graph.get_first_node_name()

                all_nodes = self.graph.get_node_names()
                persist_states = self.persist_store.get_states(data_id, all_nodes)
                if len(all_nodes) == len(persist_states):
                    # This means that the data has already processed
                    logger.info(f"Input with ID '{data_id}' already processed.")
                    self.progress["total"].add(
                        ProgressInfo(self.graph.nodes_count(), self.graph.nodes_count())
                    )
                    for node in self.graph.get_node_names():
                        self.progress[node].add(ProgressInfo(1, 1))

                    paper_data = self.persist_store.get_state(data_id, first_node_name)
                    curr_id = paper_data.get("data", {}).get("id", "")
                    self.persist_edge_states(data_id, parent_id, curr_id, edge_name)

                    yield paper_data

                else:
                    # global progress for all data
                    self.progress["total"].add(
                        ProgressInfo(self.graph.nodes_count(), 0)
                    )
                    for node in self.graph.get_node_names():
                        self.progress[node].add(ProgressInfo(1, 0))

                    state[data_id] = {
                        WF_STATE_CACHE_KEY: {},
                        WF_STATE_EXTRACTOR_KEY: pdf_extractor,
                        WF_STATE_MEMORY_KEY: PaperReadingMemoryManager(
                            self.llm_model.model,
                            self.embeddings_model,
                            data_id,
                            self.llm_model.context_size,
                            self.vectordb,
                        ),
                    }

                    self.run_through(data_id, state[data_id], parent_id, edge_name)
                    is_done = (
                        self.progress["total"].completed
                        == self.progress["total"].number
                    )
                    # Mark the data as DONE
                    if is_done:
                        self.persist_store.save_state(data_id, "_DONE", {"done": True})
                        # clean state
                        state[data_id][WF_STATE_CACHE_KEY].clear()
                        state[data_id][WF_STATE_MEMORY_KEY].clear_memory()
                        state[data_id][WF_STATE_MEMORY_KEY].close()
                        state.pop(data_id)

                    yield self.persist_store.get_state(data_id, first_node_name)

            except Exception as e:
                logger.error(f"Error processing the paper: {e}")
                # clean state
                state[data_id][WF_STATE_CACHE_KEY].clear()
                state[data_id][WF_STATE_MEMORY_KEY].clear_memory()
                state[data_id][WF_STATE_MEMORY_KEY].close()
                state.pop(data_id)
                continue

    def __repr__(self):
        return f"Node: {self.name}, Type: {self.node_type}, Graph: {self.graph}"
