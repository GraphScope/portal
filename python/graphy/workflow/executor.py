from abc import ABC, abstractmethod
from typing import Dict, Any, Union

from concurrent.futures import ThreadPoolExecutor, as_completed
from queue import Queue
from typing import Dict, Any, List, Generator

from graph.types import DataType, DataGenerator
from graph.nodes import BaseNode
from graph.edges import BaseEdge

import asyncio
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


class Task:
    """
    Represents a unit of work in the workflow execution.

    Attributes:
        data (DataGenerator): The input data for the task.
        executor (Union[BaseNode, BaseEdge, str]): The executor responsible for processing the task.
            Can be a node name (str), a BaseNode, or a BaseEdge.
    """

    def __init__(self, data: DataGenerator, executor: Union[BaseNode, BaseEdge]):
        self.data = data  # Input data for the task
        self.executor = executor  # Executor (node/edge) for this task

    def __repr__(self):
        return f"Task(executor={self.executor}, data={list(self.data)[:5]}...)"  # Limit repr for large data


class ThreadPoolWorkflowExecutor(WorkflowExecutor):
    """
    WorkflowExecutor implementation using ThreadPoolExecutor with asynchronous execution.
    """

    def __init__(self, workflow, max_workers: int = 4):
        super().__init__(workflow)
        self.task_queue = asyncio.Queue()
        self.executor = ThreadPoolExecutor(max_workers=max_workers)

    async def execute(self, initial_inputs: List[DataType]):
        """
        Execute the workflow starting with the initial inputs.

        Args:
            initial_inputs (List[DataType]): The initial input data.

        Returns:
            Dict[str, Any]: Final state after workflow execution.
        """
        state = self.workflow.state

        # Add all initial inputs to the task queue with the first node
        first_node = self.workflow.graph.get_first_node()
        if not first_node:
            raise ValueError("No nodes found in the workflow graph.")
        for input_data in initial_inputs:
            await self.task_queue.put(Task(iter([input_data]), first_node))

        # Start processing tasks asynchronously
        tasks = [
            asyncio.create_task(self._process_task(state))
            for _ in range(self.executor._max_workers)
        ]

        # Wait for all tasks to complete
        await self.task_queue.join()
        await asyncio.gather(*tasks)

        # Shutdown the executor
        self.executor.shutdown(wait=True)

    async def _process_task(self, state: Dict[str, Any]):
        """
        Process a single task from the task queue.

        Args:
            state (Dict[str, Any]): The current workflow state.
        """
        while not self.task_queue.empty():
            task = await self.task_queue.get()
            logger.debug(f"======= GET TASK {task.executor} ========")

            if isinstance(task.executor, BaseNode):  # Node
                node = task.executor
                logger.info(f"Executing node: {node}")
                if not node:
                    raise ValueError(f"Node not found in the graph.")

                # Execute the node in the thread pool
                downstream_tasks = await asyncio.to_thread(
                    self._execute_node_task, node, task.input, state
                )

                # Add downstream tasks to the queue
                for down_task in downstream_tasks:
                    logger.debug(f"ADD EDGE TASK {down_task}")
                    await self.task_queue.put(down_task)

            elif isinstance(task.executor, BaseEdge):  # Edge
                edge = task.executor
                logger.info(f"Executing edge: {edge.name}")

                # Execute the edge in the thread pool
                downstream_tasks = await asyncio.to_thread(
                    self._execute_edge_task, edge, task.input, state
                )

                # Add downstream tasks to the queue
                for down_task in downstream_tasks:
                    await self.task_queue.put(down_task)

            # Mark the task as done
            logger.debug(f"======= FINISH TASK {task.executor} ========")
            self.task_queue.task_done()

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
        logger.debug(f"================== EXECUTE Node {node} =================")
        results = node.execute(state, input_gen)
        downstream_tasks = []

        for result in results:
            # Create tasks for all adjacent edges
            for edge in self.workflow.graph.get_adjacent_edges(node.name):
                downstream_tasks.append(Task(iter([result]), edge))

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
        logger.debug(f"================== EXECUTE Edge {edge} =================")

        results = edge.execute(state, input_gen)
        downstream_tasks = []

        for result in results:
            # Create tasks for the target node
            logger.debug(
                f"#################### ADD TASK {(iter([result]), edge.target)} ###################"
            )
            downstream_tasks.append(
                Task(iter([result]), self.workflow.graph.get_node(edge.target))
            )

        return downstream_tasks
