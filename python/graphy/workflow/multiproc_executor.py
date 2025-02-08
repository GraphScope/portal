import logging
import time
import traceback
import threading

from multiprocessing import Process, Manager, Queue
from typing import Dict, Any, Type, List

# These imports are assumed to exist in your project.
from graph.types import DataType
from graph.nodes import NodeType
from workflow import BaseWorkflow
from workflow.executor import WorkflowExecutor

logger = logging.getLogger(__name__)


def worker_function(
    workflow_json: Dict[str, Any],
    workflow_class: Type[BaseWorkflow],
    task_queue: Queue,
    result_queue: Queue,
):
    """
    Worker function executed in a separate process to handle tasks.

    Args:
        workflow_json: Workflow configuration.
        task_queue: Queue to receive tasks from.
        result_queue: Queue to send results to.
    """
    # Recreate the workflow object from the provided configuration.
    workflow = workflow_class.from_dict(workflow_json)
    while True:
        task = task_queue.get()
        if task is None:  # Sentinel to terminate
            break
        logger.debug(f"Received task: {task}")

        executor = task["executor"]
        executor_type = task["executor_type"]
        input_data = task["input"]

        try:
            if executor_type == "node":
                node = workflow.graph.get_node(executor)
                results = list(node.execute(workflow.state, iter([input_data])))
            elif executor_type == "edge":
                edge = workflow.graph.get_edge(executor)
                results = list(edge.execute(workflow.state, iter([input_data])))
            else:
                raise ValueError(f"Unknown executor type: {executor_type}")
            message = "Execution successful"
            status_code = 200
        except Exception as e:
            logger.error(f"Error executing {executor_type} {executor}: {e}")
            results = []
            message = (
                f"Execution failed: {str(e)}\nTraceback:\n{traceback.format_exc()}"
            )
            status_code = 500

        # If the result_queue is full, put() will block, which naturally applies backpressure.
        result_queue.put(
            {
                "results": results,
                "executor": executor,
                "executor_type": executor_type,
                "message": message,
                "status_code": status_code,
            }
        )


class MultiprocWorkflowExecutor(WorkflowExecutor):
    """
    WorkflowExecutor using Python multiprocessing with memory and termination control.
    """

    def __init__(
        self,
        workflow_json: Dict[str, Any],
        workflow_class: Type[BaseWorkflow],
        max_workers: int = 4,
        max_inspectors: int = 100,
    ):
        self.workflow_json = workflow_json
        self.workflow = workflow_class.from_dict(workflow_json)
        self.workflow_class = workflow_class
        self.max_workers = max_workers
        self.max_inspectors = max_inspectors
        self.processed_inspectors = 0

    def execute(self, initial_inputs: List[DataType]):
        # Define a maximum size for our queues to help control memory usage.
        max_queue_size = max(1000, len(initial_inputs) * 10)
        # Use native multiprocessing Queues with a maxsize.
        task_queue = Queue(maxsize=max_queue_size)
        result_queue = Queue(maxsize=max_queue_size)

        with Manager() as manager:
            submitted_tasks = manager.Value("i", 0)
            submitted_node_tasks = manager.Value("n", 0)
            submitted_edge_tasks = manager.Value("e", 0)
            max_reached = manager.Value("b", False)

            # Start worker processes.
            workers = [
                Process(
                    target=worker_function,
                    args=(
                        self.workflow_json,
                        self.workflow_class,
                        task_queue,
                        result_queue,
                    ),
                )
                for _ in range(self.max_workers)
            ]
            for w in workers:
                w.start()

            # Start a dedicated consumer thread to process results as they arrive.
            def consumer():
                # Continuously get results and generate downstream tasks.
                while True:
                    try:
                        # Wait up to 1 second for a result.
                        result = result_queue.get(timeout=1)
                    except Exception:
                        # Timeout reached; if no tasks remain and termination is signaled, break.
                        if max_reached.value and submitted_tasks.value <= 0:
                            break
                        continue

                    submitted_tasks.value -= 1
                    if result["executor_type"] == "node":
                        submitted_node_tasks.value -= 1
                    else:
                        submitted_edge_tasks.value -= 1

                    logger.debug(f"Consume result: {result}")
                    logger.debug(
                        f"Check Progress: submitted_tasks = {submitted_tasks.value}, submitted_node_tasks = {submitted_node_tasks.value}, \
                            submitted_edge_tasks = {submitted_edge_tasks.value}, max_reached = {max_reached.value}"
                    )

                    if result["status_code"] != 200:
                        logger.error(f"Task failed: {result['message']}")
                        continue

                    # If the executor was a node and the node is of INSPECTOR type,
                    # update the inspector counter.
                    if result["executor_type"] == "node":
                        node = self.workflow.graph.get_node(result["executor"])
                        if node.node_type == NodeType.INSPECTOR:
                            self.processed_inspectors += 1
                            if self.processed_inspectors >= self.max_inspectors:
                                logger.info(
                                    f"Reached max inspectors ({self.max_inspectors})"
                                )
                                max_reached.value = True

                    # Generate new downstream tasks if we have not reached termination.
                    if not max_reached.value:
                        self._generate_downstream_tasks(
                            result["executor_type"],
                            result["executor"],
                            result["results"],
                            task_queue,
                            submitted_tasks,
                            submitted_node_tasks,
                            submitted_edge_tasks,
                        )

            consumer_thread = threading.Thread(target=consumer)
            consumer_thread.start()

            # Submit initial tasks to the first node.
            first_node = self.workflow.graph.get_first_node_name()
            for data in initial_inputs:
                task_queue.put(
                    {"input": data, "executor": first_node, "executor_type": "node"}
                )
                submitted_tasks.value += 1
                submitted_node_tasks.value += 1

            # Main loop: wait until all tasks have been processed.
            try:
                while submitted_tasks.value > 0 or not result_queue.empty():
                    time.sleep(0.1)
            finally:
                # Signal termination.
                max_reached.value = True

                # Wait for the consumer thread to finish.
                consumer_thread.join(timeout=1)

                # Cleanly terminate all worker processes.
                for _ in range(self.max_workers):
                    task_queue.put(None)
                for w in workers:
                    w.join(timeout=1)

                # Drain any remaining items in the queues.
                while not task_queue.empty():
                    task_queue.get()
                while not result_queue.empty():
                    result_queue.get()

    def _generate_downstream_tasks(
        self,
        executor_type: str,
        executor: str,
        results: List[Any],
        task_queue: Queue,
        submitted_tasks,
        submitted_node_tasks,
        submitted_edge_tasks,
    ):
        """
        Generate and enqueue downstream tasks based on results from the last executor.
        """
        if executor_type == "node":
            next_type = "edge"
            next_executors = [
                edge.name for edge in self.workflow.graph.get_adjacent_edges(executor)
            ]
        else:
            next_type = "node"
            next_executors = [self.workflow.graph.get_edge(executor).target]

        for data in results:
            for next_exec in next_executors:
                task_queue.put(
                    {"input": data, "executor": next_exec, "executor_type": next_type}
                )
                submitted_tasks.value += 1
                if next_type == "node":
                    submitted_node_tasks.value += 1
                else:
                    submitted_edge_tasks.value += 1
