from abc import ABC, abstractmethod
from typing import Dict, Any

from concurrent.futures import ThreadPoolExecutor, as_completed
from queue import Queue
from typing import Dict, Any, List, Generator

from graph.types import DataType


class WorkflowExecutor(ABC):
    """
    Abstract class for a Workflow Executor.
    """

    def __init__(self, workflow):
        self.workflow = workflow

    @abstractmethod
    def execute(self, initial_inputs: List[DataType]) -> Dict[str, Any]:
        """
        Execute the workflow starting with the initial inputs.

        Args:
            initial_inputs (List[DataType]): The initial input data.

        Returns:
            Dict[str, Any]: Final state after workflow execution.
        """
        pass

    @abstractmethod
    def _execute_node(self, node, input_data: DataType, state: Dict[str, Any]):
        """
        Execute a node.

        Args:
            node: The node to execute.
            input_data (DataType): Input data for the node.
            state (Dict[str, Any]): Workflow state.
        """
        pass

    @abstractmethod
    def _execute_edge(self, edge, input_data: DataType, state: Dict[str, Any]):
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

    def execute(self, initial_inputs: List[DataType]) -> Dict[str, Any]:
        """
        Execute the workflow starting with the initial inputs.

        Args:
            initial_inputs (List[DataType]): The initial input data.

        Returns:
            Dict[str, Any]: Final state after workflow execution.
        """
        state = self.workflow.state

        # Add all initial inputs to the task queue with the first node
        first_node = self.workflow.graph.get_node_names()[0]
        for input_data in initial_inputs:
            self.task_queue.put((input_data, first_node))

        futures = []
        results = []

        # Process tasks in the queue
        while not self.task_queue.empty():
            input_data, target = self.task_queue.get()

            if isinstance(target, str):  # Node
                node = self.workflow.graph.get_node(target)
                future = self.executor.submit(
                    self._execute_node, node, input_data, state
                )
            else:  # Edge
                edge = target
                future = self.executor.submit(
                    self._execute_edge, edge, input_data, state
                )

            futures.append(future)

        # Wait for all tasks to complete
        for future in as_completed(futures):
            results.append(future.result())

        self.executor.shutdown(wait=True)
        return state

    def _execute_node(
        self, node, input_data: DataType, state: Dict[str, Any]
    ) -> Generator:
        """
        Execute a node and generate tasks for its adjacent edges.
        """
        node_output = node.execute(state, iter([input_data]))
        for output in node_output:
            adjacent_edges = self.workflow.graph.get_adjacent_edges(node.name)
            for edge in adjacent_edges:
                self.task_queue.put((output, edge))
            yield output

    def _execute_edge(
        self, edge, input_data: DataType, state: Dict[str, Any]
    ) -> Generator:
        """
        Execute an edge and generate tasks for its target node.
        """
        edge_output = edge.execute(state, iter([input_data]))
        for output in edge_output:
            target_node = self.workflow.graph.get_node(edge.target)
            self.task_queue.put((output, target_node))
            yield output
