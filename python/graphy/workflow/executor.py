from abc import ABC, abstractmethod
from concurrent.futures import ThreadPoolExecutor, Future
from queue import Queue, Empty
from typing import List, Dict, Any
from graph.types import DataType, DataGenerator
from graph.nodes import BaseNode, NodeType
from graph.edges import BaseEdge
import threading
import logging

logger = logging.getLogger(__name__)


class WorkflowExecutor(ABC):
    """
    Abstract base class for Workflow Executors.
    """

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


class Task:
    """
    Represents a unit of work in the workflow execution.

    Attributes:
        input (DataGenerator): The input data for the task.
        executor (Union[BaseNode, BaseEdge]): The executor responsible for processing the task.
    """

    def __init__(self, input: DataGenerator, executor: Any):
        self.input = input  # Input data for the task
        self.executor = executor  # Executor (node/edge) for this task

    def __repr__(self):
        return f"Task(executor={self.executor})"


class ThreadPoolWorkflowExecutor(WorkflowExecutor):
    """
    WorkflowExecutor implementation using ThreadPoolExecutor with parallel execution.
    """

    def __init__(self, workflow, max_workers: int = 4, max_inspectors: int = 100):
        self.workflow = workflow
        self.task_queue = Queue()
        self.executor = ThreadPoolExecutor(max_workers=max_workers)
        self.lock = threading.Lock()
        self.active_futures = set()
        self.state = workflow.state
        self.max_inspectors = max_inspectors
        self.processed_inspectors = 0

    def execute(self, initial_inputs: List[DataType]):
        """
        Execute the workflow starting with the initial inputs.

        Args:
            initial_inputs (List[DataType]): The initial input data.
        """
        # Add initial tasks to the queue
        first_node = self.workflow.graph.get_first_node()
        if not first_node:
            raise ValueError("No nodes found in the workflow graph.")

        for input_data in initial_inputs:
            self.task_queue.put(Task(iter([input_data]), first_node))

        try:
            while not self.task_queue.empty() or self.active_futures:
                # Submit tasks to executor
                while not self.task_queue.empty():
                    task = self.task_queue.get()
                    future = self.executor.submit(self._process_task, task)
                    self.active_futures.add(future)
                    future.add_done_callback(self._on_task_complete)

                # Wait for any task to complete
                completed_futures = [f for f in self.active_futures if f.done()]
                for future in completed_futures:
                    self.active_futures.remove(future)

        finally:
            self.executor.shutdown(wait=True)

    def _on_task_complete(self, future: Future):
        """
        Callback for task completion to handle downstream tasks.
        """
        try:
            downstream_tasks = future.result()
            for task in downstream_tasks:
                self.task_queue.put(task)
        except Exception as e:
            logger.error(f"Task failed with error: {e}")

    def _process_task(self, task: Task) -> List[Task]:
        """
        Process a single task.

        Args:
            task (Task): The task to process.

        Returns:
            List[Task]: Downstream tasks to enqueue.
        """
        downstream_tasks = []
        executor = task.executor

        if isinstance(executor, BaseNode):  # Node task
            logger.info(f"Executing node: {executor}")
            results = executor.execute(self.state, task.input)

            for result in results:
                if executor.node_type == NodeType.INSPECTOR:
                    with self.lock:
                        self.processed_inspectors += 1
                        if self.processed_inspectors >= self.max_inspectors:
                            logger.info(
                                f"Reached max inspectors limit '{self.max_inspectors}', stopping execution"
                            )
                            return []
                for edge in self.workflow.graph.get_adjacent_edges(executor.name):
                    downstream_tasks.append(Task(iter([result]), edge))

        elif isinstance(executor, BaseEdge):  # Edge task
            logger.info(f"Executing edge: {executor.name}")
            results = executor.execute(self.state, task.input)

            for result in results:
                target_node = self.workflow.graph.get_node(executor.target)
                downstream_tasks.append(Task(iter([result]), target_node))

        else:
            raise ValueError(f"Invalid executor type: {executor}")

        return downstream_tasks
