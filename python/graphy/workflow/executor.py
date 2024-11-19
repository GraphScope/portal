from abc import ABC, abstractmethod
from typing import Dict, Any

from concurrent.futures import ThreadPoolExecutor, as_completed
from queue import Queue
from typing import Dict, Any, List, Generator

from graph.types import DataType

import logging

logger = logging.getLogger(__name__)


class WorkflowExecutor(ABC):
    """
    Abstract class for a Workflow Executor.
    """

    def __init__(self, workflow):
        self.workflow = workflow

    @abstractmethod
    def execute(self, initial_inputs: List[DataType]):
        """
        Execute the workflow starting with the initial inputs.

        Args:
            initial_inputs (List[DataType]): The initial input data.

        Returns:
            Dict[str, Any]: Final state after workflow execution.
        """
        pass

    @abstractmethod
    def _execute_node_task(self, node, input_data: DataType, state: Dict[str, Any]):
        """
        Execute a node.

        Args:
            node: The node to execute.
            input_data (DataType): Input data for the node.
            state (Dict[str, Any]): Workflow state.
        """
        pass

    @abstractmethod
    def _execute_edge_task(self, edge, input_data: DataType, state: Dict[str, Any]):
        """
        Execute an edge.

        Args:
            edge: The edge to execute.
            input_data (DataType): Input data for the edge.
            state (Dict[str, Any]): Workflow state.
        """
        pass


class ThreadPoolWorkflowExecutor(WorkflowExecutor):
    """
    WorkflowExecutor implementation using ThreadPoolExecutor.
    """

    def __init__(self, workflow, max_workers: int = 4):
        super().__init__(workflow)
        self.task_queue = Queue()
        self.executor = ThreadPoolExecutor(max_workers=max_workers)

    def execute(self, initial_inputs: List[DataType]):
        """
        Execute the workflow starting with the initial inputs.

        Args:
            initial_inputs (List[DataType]): The initial input data.

        Returns:
            Dict[str, Any]: Final state after workflow execution.
        """
        state = self.workflow.state

        # Add all initial inputs to the task queue with the first node
        first_node = self.workflow.graph.get_first_node_name()
        assert first_node, "Workflow graph has no start node."
        for input_data in initial_inputs:
            self.task_queue.put(
                (iter([input_data]), first_node)
            )  # Wrap input in a generator

        futures = []

        while not self.task_queue.empty():
            input_gen, target = self.task_queue.get()

            if isinstance(target, str):  # Node
                logger.info(f"Executing node: {target}")
                node = self.workflow.graph.get_node(target)
                assert node, f"Node {target} not found in the graph."
                future = self.executor.submit(
                    self._execute_node_task, node, input_gen, state
                )

            else:  # Edge
                edge = target
                logger.info(f"Executing edge: {edge.name}")
                future = self.executor.submit(
                    self._execute_edge_task, edge, input_gen, state
                )

            futures.append(future)

        # Wait for all tasks to complete
        for future in as_completed(futures):
            downstream_tasks = future.result()
            for downstream_task in downstream_tasks:
                self.task_queue.put(downstream_task)

        self.executor.shutdown(wait=True)

    def _execute_node_task(self, node, input_gen, state):
        """
        Execute a node task and generate downstream tasks.

        Args:
            node (BaseNode): The node to execute.
            input_gen (DataGenerator): The input generator.
            state (Dict[str, Any]): The current workflow state.

        Returns:
            List[Tuple[DataGenerator, BaseEdge]]: Downstream tasks for adjacent edges.
        """
        results = node.execute(state, input_gen)
        downstream_tasks = []

        for result in results:
            # Create tasks for all adjacent edges
            for edge in self.workflow.graph.get_adjacent_edges(node.name):
                downstream_tasks.append((iter([result]), edge))

        return downstream_tasks

    def _execute_edge_task(self, edge, input_gen, state):
        """
        Execute an edge task and generate downstream tasks.

        Args:
            edge (BaseEdge): The edge to execute.
            input_gen (DataGenerator): The input generator.
            state (Dict[str, Any]): The current workflow state.

        Returns:
            List[Tuple[DataGenerator, BaseNode]]: Downstream tasks for target nodes.
        """
        results = edge.execute(state, input_gen)
        downstream_tasks = []

        for result in results:
            # Create tasks for the target node
            target_node = self.workflow.graph.get_node(edge.target)
            downstream_tasks.append((iter([result]), target_node))

        return downstream_tasks