from typing import List, Dict, Any, Type

from apps.paper_reading import SurveyPaperReading
from graph.types import DataType
from graph.nodes import NodeType
from workflow import BaseWorkflow
from workflow.executor import WorkflowExecutor, Task

import ray
import logging
import time
import traceback

logger = logging.getLogger(__name__)


@ray.remote
class WorkflowWorker:
    """
    Remote Ray worker that processes a portion of the workflow.
    """

    def __init__(self, workflow_json: Dict[str, Any]):
        """
        Initialize the worker with the workflow configuration.

        Args:
            workflow_json (Dict[str, Any]): JSON containing the workflow configuration.
        """
        self.workflow = SurveyPaperReading.from_dict(workflow_json)

    def execute_task(self, task: Task) -> List[Dict[str, Any]]:
        """
        Execute a single task (either a node or edge).

        Args:
            task (Dict[str, Any]): A dictionary containing the input data and the executor.

        Returns:
            List[Dict[str, Any]]: Results of the task execution.
        """
        executor = task["executor"]
        executor_type = task["executor_type"]  # "node" or "edge"
        input_data = task["input"]
        if executor_type == "node":
            logger.info(f"Executing node: {executor}")
            node = self.workflow.graph.get_node(executor)
            try:
                results = list(node.execute(self.workflow.state, iter([input_data])))
                message = "Execution successful"
                status_code = 200  # HTTP-style status code for success
            except Exception as e:
                logger.error(f"Error executing node {executor}: {e}")
                full_traceback = traceback.format_exc()
                results = []
                message = f"Execution failed: {str(e)}\nTraceback:\n{full_traceback}"
                status_code = 500  # HTTP-style status code for error

            return {
                "results": results,
                "executor": executor,
                "executor_type": executor_type,
                "message": message,
                "status_code": status_code,
            }
        else:
            logger.info(f"Executing edge: {executor}")
            edge = self.workflow.graph.get_edge(executor)
            try:
                results = list(edge.execute(self.workflow.state, iter([input_data])))
                message = "Execution successful"
                status_code = 200  # HTTP-style status code for success
            except Exception as e:
                logger.error(f"Error executing edge {executor}: {e}")
                full_traceback = traceback.format_exc()
                results = []
                message = f"Execution failed: {str(e)}\nTraceback:\n{full_traceback}"
                status_code = 500  # HTTP-style status code for error

            return {
                "results": results,
                "executor": executor,
                "executor_type": executor_type,
                "message": message,
                "status_code": status_code,
            }


class RayWorkflowExecutor(WorkflowExecutor):
    """
    WorkflowExecutor implementation using Ray for parallel execution.
    """

    def __init__(
        self,
        workflow_json: Dict[str, Any],
        workflow_class: Type[BaseWorkflow],
        max_workers: int = 4,
        max_inspectors: int = 100,
    ):
        """
        Initialize the RayWorkflowExecutor.

        Args:
            workflow_json (Dict[str, Any]): JSON containing the workflow configuration.
            max_workers (int): Maximum number of parallel workers.
        """
        self.workflow_json = workflow_json
        self.workflow = workflow_class.from_dict(workflow_json)
        self.max_workers = max_workers
        self.max_inspectors = max_inspectors
        self.processed_inspectors = 0
        self.workers = [
            WorkflowWorker.remote(workflow_json) for _ in range(max_workers)
        ]
        self.active_futures = set()

    def execute(self, initial_inputs: List[DataType]):
        """
        Execute the workflow with the given initial inputs.

        Args:
            initial_inputs (List[DataType]): List of initial inputs.

        Returns:
            Dict[str, Any]: Final workflow state.
        """
        first_node_name = self.workflow.graph.get_first_node_name()
        # Initialize the task queue
        task_queue = [
            {
                "input": input_data,
                "executor": first_node_name,
                "executor_type": "node",
            }
            for input_data in initial_inputs
        ]
        # While there are tasks to process
        while task_queue or self.active_futures:
            # Handle task submission
            while task_queue and self.workers:
                task = task_queue.pop(0)
                logger.debug(f"Dequeued task: {task}")
                worker = self.workers.pop(0)  # Get an available worker
                future = worker.execute_task.remote(task)
                self.active_futures.add((future, worker))

            # Handle task completion
            if self.active_futures:
                ready_futures, _ = ray.wait(
                    [f[0] for f in self.active_futures], num_returns=1
                )
                for ready_future in ready_futures:
                    # Find the corresponding worker
                    future_worker_pair = next(
                        (
                            pair
                            for pair in self.active_futures
                            if pair[0] == ready_future
                        ),
                        None,
                    )
                    if future_worker_pair:
                        future, worker = future_worker_pair
                        self.workers.append(worker)  # Return the worker to the pool
                        logger.debug(f"Worker returned to pool: {worker}")
                        self.active_futures.remove(
                            future_worker_pair
                        )  # Remove from active
                        task_result = ray.get(future)

                        # Generate downstream tasks
                        executor = task_result["executor"]
                        executor_type = task_result["executor_type"]
                        results = task_result["results"]
                        message = task_result["message"]
                        status_code = task_result["status_code"]

                        if status_code != 200:
                            logger.error(f"Task failed with error: {message}")
                            continue

                        if executor_type == "node":
                            executor_node = self.workflow.graph.get_node(executor)
                            if executor_node.node_type == NodeType.INSPECTOR:
                                self.processed_inspectors += 1
                            next_executor_type = "edge"
                            next_executors = [
                                edge.name
                                for edge in self.workflow.graph.get_adjacent_edges(
                                    executor
                                )
                            ]
                        elif executor_type == "edge":
                            next_executor_type = "node"
                            next_executors = [
                                self.workflow.graph.get_edge(executor).target
                            ]
                        else:
                            raise ValueError(f"Unknown executor type: {executor_type}")

                        if self.processed_inspectors >= self.max_inspectors:
                            # Do not add more tasks
                            logger.info(
                                f"Reached maximum number of inspectors: {self.max_inspectors}"
                            )
                            continue
                        for result in results:
                            for next_executor in next_executors:
                                task_queue.append(
                                    {
                                        "input": result,
                                        "executor": next_executor,
                                        "executor_type": next_executor_type,
                                    }
                                )
            else:
                # No tasks are ready; wait briefly to avoid busy-waiting
                time.sleep(0.1)
