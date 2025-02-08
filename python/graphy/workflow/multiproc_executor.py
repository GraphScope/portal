import logging
import time
import traceback
import threading

from multiprocessing import Process, Queue
from multiprocessing.managers import SyncManager
from typing import Dict, Any, Type, List

# These imports are assumed to exist in your project.
from graph.types import DataType
from graph.nodes import NodeType
from workflow import BaseWorkflow
from workflow.executor import WorkflowExecutor

logger = logging.getLogger(__name__)


# Define your custom progress class.
class ProgressInfo:
    def __init__(self):
        self.curr_submitted_tasks = 0
        self.curr_submitted_node_tasks = 0
        self.curr_submitted_edge_tasks = 0
        self.total_submitted_tasks = 0
        self.total_submitted_node_tasks = 0
        self.total_submitted_edge_tasks = 0

    def __repr__(self) -> str:
        return (
            f"ProgressInfo ["
            f" current_submitted_tasks (*, node, edge)=({self.curr_submitted_tasks}, {self.curr_submitted_node_tasks}, {self.curr_submitted_edge_tasks});"
            f" total_submitted_tasks (*, node, edge)=({self.total_submitted_tasks}, {self.total_submitted_node_tasks}, {self.total_submitted_edge_tasks})"
            f"]"
        )

    # Optionally, add methods to update the counters.
    def update(self, is_node_task: bool = True, is_increment: bool = True):
        if is_increment:
            if is_node_task:
                self.curr_submitted_node_tasks += 1
                self.total_submitted_node_tasks += 1
            else:
                self.curr_submitted_edge_tasks += 1
                self.total_submitted_edge_tasks += 1
            self.curr_submitted_tasks += 1
            self.total_submitted_tasks += 1
        else:
            if is_node_task:
                self.curr_submitted_node_tasks -= 1
            else:
                self.curr_submitted_edge_tasks -= 1
            self.curr_submitted_tasks -= 1

    # define getters
    def get_curr_submitted_tasks(self) -> int:
        return self.curr_submitted_tasks

    def get_curr_submitted_node_tasks(self) -> int:
        return self.curr_submitted_node_tasks

    def get_curr_submitted_edge_tasks(self) -> int:
        return self.curr_submitted_edge_tasks

    def get_total_submitted_tasks(self) -> int:
        return self.total_submitted_tasks

    def get_total_submitted_node_tasks(self) -> int:
        return self.total_submitted_node_tasks

    def get_total_submitted_edge_tasks(self) -> int:
        return self.total_submitted_edge_tasks


class ProgressManager(SyncManager):
    pass


ProgressManager.register("ProgressInfo", ProgressInfo)


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
        max_queue_size: int = 1000,
    ):
        self.workflow_json = workflow_json
        self.workflow = workflow_class.from_dict(workflow_json)
        self.workflow_class = workflow_class
        self.max_workers = max_workers
        self.max_inspectors = max_inspectors
        self.max_queue_size = max_queue_size
        self.processed_inspectors = 0

    def execute(self, initial_inputs: List[DataType]):
        # Define a maximum size for our queues to help control memory usage.
        # max_queue_size = max(self.max_queue_size, len(initial_inputs) * 10)
        # Use native multiprocessing Queues with a maxsize.
        logger.debug(f"Max queue size: {self.max_queue_size}")
        task_queue = Queue(maxsize=self.max_queue_size)
        result_queue = Queue(maxsize=self.max_queue_size)

        with ProgressManager() as manager:
            progress = manager.ProgressInfo()
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
                        if (
                            max_reached.value
                            and progress.get_curr_submitted_tasks() <= 0
                        ):
                            break
                        continue

                    progress.update(result["executor_type"] == "node", False)

                    logger.debug(f"Consume result: {result}")
                    logger.info(
                        f"Check Progress: {progress}, Max Reached: {max_reached.value}"
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
                            progress,
                        )

            consumer_thread = threading.Thread(target=consumer)
            consumer_thread.start()

            # Submit initial tasks to the first node.
            first_node = self.workflow.graph.get_first_node_name()
            for data in initial_inputs:
                task_queue.put(
                    {"input": data, "executor": first_node, "executor_type": "node"}
                )

                progress.update(True, True)

            # Main loop: wait until all tasks have been processed.
            try:
                while (
                    progress.get_curr_submitted_tasks() > 0 or not result_queue.empty()
                ):
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
        progress: ProgressInfo,
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
                progress.update(next_type == "node", True)
