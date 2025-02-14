from config import WF_STATE_CACHE_KEY, WF_STATE_EXTRACTOR_KEY, WF_STATE_MEMORY_KEY
from db.base_store import PersistentStore
from graph.nodes.base_node import BaseNode, NodeCache, NodeType
from graph.types import DataGenerator, DataType
from memory.llm_memory import PaperReadingMemoryManager
from models import LLM
from utils.profiler import profiler

from typing import Any, Dict, List
from langchain_core.embeddings import Embeddings
from langchain_core.exceptions import OutputParserException
from langchain_core.language_models.llms import BaseLLM

import logging
import json
import re
import traceback

logger = logging.getLogger(__name__)


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
        json_content = re.sub(r'(?<!\\)\\(?![bfnrtv"\\/])', r"\\\\", json_content)

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

    def is_done(self) -> bool:
        return self.completed == self.number

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


class DAGInspectorNode(BaseNode):
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
        is_skip_all = len(skipped_nodes) == 1 and skipped_nodes[0] == "*"

        all_nodes = set(self.graph.get_node_names())
        persist_states = set(self.persist_store.get_total_states(data_id))
        if all_nodes.issubset(persist_states):
            # This means that the data has already processed
            logger.info(f"Input with ID '{data_id}' already processed.")
            self.progress["total"].add(
                ProgressInfo(self.graph.nodes_count(), self.graph.nodes_count())
            )
            for node in all_nodes:
                self.progress[node].add(ProgressInfo(1, 1))

            self.persist_store.save_state(data_id, "_DONE", {"done": True})

            return

        # global progress for all data
        self.progress["total"].add(ProgressInfo(self.graph.nodes_count(), 0))
        for node in all_nodes:
            self.progress[node].add(ProgressInfo(1, 0))

        while next_nodes:
            current_node = next_nodes.pop()  # Run in DFS order
            if current_node.name in skipped_nodes or is_skip_all:
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
                    # execute pdf extraction anyway
                    if current_node.name == first_node.name:
                        next(current_node.execute(state))
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

    @profiler.profile(name="DAGInspectorExecution")
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

        pass

    def __repr__(self):
        return f"Node: {self.name}, Type: {self.node_type}, Graph: {self.graph}"
