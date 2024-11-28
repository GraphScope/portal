from .base_edge import BaseEdge, EdgeType, DataGenerator
from utils import ArxivFetcher, ScholarFetcher

from enum import Enum, auto
from typing import Dict, List, Any
from utils.profiler import profiler
import logging
import threading
import shutil
import copy
import os
from queue import Queue
import queue
import concurrent.futures

logger = logging.getLogger(__name__)


class ReferenceExtractStateMode(Enum):
    """
    Enumeration of the layer names of vectordb.
    """

    AppendIfExists = auto()
    SkipIfExists = auto()


class ResourceAllocator:
    def __init__(self, initial_amount):
        # Shared resource initialized to a given amount
        self.available = initial_amount
        # Condition variable to coordinate thread access
        self.condition = threading.Condition()

    def request(self, amount):
        with self.condition:
            # Wait until the requested amount is available
            while self.available < amount:
                self.condition.wait()
            # Deduct the requested amount
            self.available -= amount
            logger.info(f"Allocated {amount}, remaining: {self.available}")

    def release(self, amount):
        with self.condition:
            # Increase the available resource
            self.available += amount
            logger.info(f"Released {amount}, remaining: {self.available}")
            # Notify waiting threads that resources might be available
            self.condition.notify_all()


class PaperNavigateEdge(BaseEdge):
    def __init__(
        self,
        source,
        target,
        paper_download_dir,
        persist_store=None,
        name=None,
        download_concurrency=1,
        finish_signal="REF_DONE",
        max_thread_num=24,
        ref_mode=ReferenceExtractStateMode.SkipIfExists,
    ):
        super().__init__(source, target, name)
        logger.info("initialize of paper navigaete edge")

        self.paper_download_dir = paper_download_dir
        os.makedirs(self.paper_download_dir, exist_ok=True)

        self.download_concurrency = download_concurrency

        self.persist_store = persist_store

        self.finish_signal = finish_signal
        self.max_thread_num = max_thread_num
        self.ref_mode = ref_mode

        self.thread_allocator = ResourceAllocator(self.max_thread_num)

    def download_worker(self, link_queue):
        logger.error("Error: Download Worker Undefined.")
        pass

    def run_worker(self, worker_func, link_queue, output_queue):
        for result in worker_func(link_queue):
            output_queue.put(result)

    @profiler.profile(name="PaperNavigateEdge")
    def execute(
        self, state: Dict[str, Any], input: DataGenerator = None
    ) -> DataGenerator:
        link_queue = Queue()
        output_queue = Queue()

        logger.debug("================= START NAVIGATE ==============")
        for paper in input:
            if not paper:
                continue

            data_id = paper.get("data", {}).get("data_id", "")
            if not data_id:
                continue

            if (
                self.persist_store.get_state(data_id, self.finish_signal)
                and self.ref_mode == ReferenceExtractStateMode.SkipIfExists
            ):
                # This means that the data has already processed
                logger.info(f"Reference of ID '{data_id}' already obtained.")

                reference_paths = self.persist_store.get_state(
                    data_id, self.finish_signal
                )
                references = reference_paths.get("data", [])
                for reference_info in references:
                    yield reference_info
                continue

            parent_id = paper.get("data", {}).get("id", "")
            tasks = set(paper.get("data", {}).get("reference", []))

            if len(parent_id) == 0 or len(tasks) == 0:
                continue

            for task in tasks:
                link_queue.put((task, parent_id, data_id))

        if not link_queue.empty():
            self.thread_allocator.request(amount=self.download_concurrency)
            try:
                records = {}
                with concurrent.futures.ThreadPoolExecutor(
                    max_workers=self.download_concurrency
                ) as download_executor:
                    futures = []
                    for _ in range(self.download_concurrency):
                        futures.append(
                            download_executor.submit(
                                self.run_worker,
                                self.download_worker,
                                link_queue,
                                output_queue,
                            )
                        )

                    while (
                        link_queue.unfinished_tasks != 0
                        or output_queue.unfinished_tasks != 0
                    ):
                        try:
                            paper_path, parent_id, parent_data_id = output_queue.get(
                                timeout=0.1
                            )  # Attempt to get a result from the queue
                            output_json = {
                                "paper_file_path": paper_path,
                                "parent_id": parent_id,
                                "edge_name": self.name,
                            }
                            yield output_json

                            records.setdefault(parent_data_id, []).append(output_json)
                            output_queue.task_done()
                        except queue.Empty:
                            continue

                    link_queue.join()
                    output_queue.join()

                for parent_data_id in records:
                    cur_result = {"data": []}
                    if self.ref_mode == ReferenceExtractStateMode.AppendIfExists:
                        original_ref = self.persist_store.get_state(
                            parent_data_id, self.finish_signal
                        )
                        if original_ref:
                            if "data" in original_ref and original_ref["data"]:
                                cur_result = original_ref

                    cur_result["data"].extend(records[parent_data_id])
                    if len(records[parent_data_id]) > 0:
                        self.persist_store.save_state(
                            parent_data_id, self.finish_signal, cur_result
                        )
            except Exception as e:
                logger.error(f"Get Paper Error: {e}")
            finally:
                self.thread_allocator.release(amount=self.download_concurrency)

        logger.debug("================= FINISH NAVIGATE ==============")


@profiler.profile(name="PaperNavigateArxivEdge")
class PaperNavigateArxivEdge(PaperNavigateEdge):
    def __init__(
        self,
        source,
        target,
        paper_download_dir,
        persist_store=None,
        name=None,
        arxiv_download_concurrency=4,
        finish_signal="_ARXIV_REF_DONE",
        max_thread_num=24,
        ref_mode=ReferenceExtractStateMode.SkipIfExists,
    ):
        super().__init__(
            source,
            target,
            paper_download_dir,
            persist_store,
            name,
            arxiv_download_concurrency,
            finish_signal,
            max_thread_num,
            ref_mode,
        )
        logger.info("initialize of arxiv paper navigate edge")

    def download_worker(self, link_queue):
        while not link_queue.empty():
            info = link_queue.get()

            if info is None:
                link_queue.task_done()
                continue
            link, parent_id, parent_data_id = info

            if link is None or len(link) < 5:
                link_queue.task_done()
                continue

            logger.info(
                f"--------------  ARXIV DOWNLOAD WORKER: {link}  ------------------"
            )

            arxiv_fetcher = ArxivFetcher(download_folder=self.paper_download_dir)
            download_list = arxiv_fetcher.download_paper(link, 1)

            if len(download_list) == 0:
                logger.info(f"PASS {link} to SCHOLAR FOR FURTHER SEARCH")
            else:
                for download_info in download_list:
                    succ, path, exist = download_info
                    if succ and path is not None:
                        logger.info(f"SUCCESSFULLY GET PAPER {path}")
                        yield path, parent_id, parent_data_id
                    else:
                        logger.info(f"PASS {link} to SCHOLAR FOR FURTHER SEARCH")
                    break

            link_queue.task_done()

            logger.info(
                f"--------------  FINISH ARXIV WORKER: {link}  ------------------"
            )

        logger.info("QUIT ARXIV")


@profiler.profile(name="PaperNavigateScholarEdge")
class PaperNavigateScholarEdge(PaperNavigateEdge):
    def __init__(
        self,
        source,
        target,
        paper_download_dir,
        persist_store=None,
        name=None,
        scholar_download_concurrency=4,
        finish_signal="_SCHOLAR_REF_DONE",
        max_thread_num=8,
        ref_mode=ReferenceExtractStateMode.SkipIfExists,
    ):
        super().__init__(
            source,
            target,
            paper_download_dir,
            persist_store,
            name,
            scholar_download_concurrency,
            finish_signal,
            max_thread_num,
            ref_mode,
        )
        logger.info("initialize of arxiv paper navigate edge")

    def download_worker(self, scholar_link_queue):
        while True:
            info = scholar_link_queue.get()

            if info is None:
                scholar_link_queue.task_done()
                break
            link, parent_id, parent_data_id = info

            if link is None or len(link) < 5:
                scholar_link_queue.task_done()
                continue

            logger.info(
                f"--------------  SCHOLAR DOWNLOAD WORKER: {link}  ------------------"
            )

            # time.sleep(random.uniform(1, 4))

            web_data_dir = os.path.join(
                self.paper_download_dir,
                "tmp",
                "webdata",
                # f"{str(uuid.uuid5(uuid.NAMESPACE_DNS, link))}",
            )

            # web_data_dir = os.path.join(
            #     self.paper_pool_dir,
            #     "webdata",
            # )

            scholar_fetcher = ScholarFetcher(
                download_folder=self.paper_download_dir, web_data_folder=web_data_dir
            )
            download_list = scholar_fetcher.download_paper(link, mode="exact")

            for download_info in download_list:
                succ, path, exist = download_info
                if succ and path is not None:
                    logger.info(f"SUCCESSFULLY GET PAPER {path}")
                    yield path, parent_id, parent_data_id

            scholar_link_queue.task_done()

            logger.info(
                f"--------------  FINISH SCHOLAR WORKER: {link}  ------------------"
            )

        logger.info("QUIT SCHOLAR")
