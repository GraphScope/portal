from .base_edge import BaseEdge, EdgeType, DataGenerator
from utils import ArxivFetcher, ScholarFetcher

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
            print(f"Allocated {amount}, remaining: {self.available}")

    def release(self, amount):
        with self.condition:
            # Increase the available resource
            self.available += amount
            print(f"Released {amount}, remaining: {self.available}")
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
        arxiv_download_concurrency=4,
        scholar_download_concurrency=2,
        max_paper_num=-1,
        max_hop=1,
    ):
        super().__init__(source, target, name)
        print("initialize of paper navigaete edge")

        self.paper_download_dir = paper_download_dir
        os.makedirs(self.paper_download_dir, exist_ok=True)

        self.arxiv_download_concurrency = arxiv_download_concurrency
        self.scholar_download_concurrency = scholar_download_concurrency
        self.max_paper_num = max_paper_num
        self.max_hop = max_hop

        self.search_scholar = False

        self.paper_num = 0
        self.persist_store = persist_store
        self.thread_allocator = ResourceAllocator(initial_amount=24)

    def arxiv_download_worker(self, arxiv_link_queue, scholar_link_queue, output_queue):
        while not arxiv_link_queue.empty():
            info = arxiv_link_queue.get()

            if info is None:
                arxiv_link_queue.task_done()
                continue
            hop, link, parent_id, parent_data_id = info

            if link is None or len(link) < 5:
                arxiv_link_queue.task_done()
                continue

            if self.max_paper_num != -1:
                if self.paper_num >= self.max_paper_num:
                    arxiv_link_queue.task_done()
                    continue

            logger.info(
                f"--------------  ARXIV DOWNLOAD WORKER: {link} {hop}-hop  ------------------"
            )

            arxiv_fetcher = ArxivFetcher(download_folder=self.paper_download_dir)
            download_list = arxiv_fetcher.download_paper(link, 1)

            if len(download_list) == 0:
                logger.info(f"PASS {link} to SCHOLAR FOR FURTHER SEARCH")
                if self.search_scholar:
                    scholar_link_queue.put((hop, link, parent_id, parent_data_id))
            else:
                for download_info in download_list:
                    succ, path, exist = download_info
                    if succ and path is not None:
                        logger.info(f"SUCCESSFULLY GET PAPER {path}")
                        yield path, parent_id, parent_data_id
                    else:
                        logger.info(f"PASS {link} to SCHOLAR FOR FURTHER SEARCH")
                        if self.search_scholar:
                            scholar_link_queue.put(
                                (hop, link, parent_id, parent_data_id)
                            )
                    break

            arxiv_link_queue.task_done()

            logger.info(
                f"--------------  FINISH ARXIV WORKER: {link}  ------------------"
            )

        logger.info("QUIT ARXIV")
        logger.info(
            f"{output_queue.qsize()} {scholar_link_queue.qsize()} {arxiv_link_queue.qsize()}"
        )

    def scholar_download_worker(self, arxiv_link_queue, scholar_link_queue):
        while True:
            info = scholar_link_queue.get()

            if info is None:
                scholar_link_queue.task_done()
                break
            hop, link, parent_id, parent_data_id = info

            if link is None or len(link) < 5:
                scholar_link_queue.task_done()
                continue

            if self.max_paper_num != -1:
                if self.paper_num >= self.max_paper_num:
                    scholar_link_queue.task_done()
                    continue

            logger.info(
                f"--------------  SCHOLAR DOWNLOAD WORKER: {link} {hop}-hop  ------------------"
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

    def run_worker(
        self, worker_func, arxiv_link_queue, scholar_link_queue, output_queue
    ):
        for result in worker_func(arxiv_link_queue, scholar_link_queue, output_queue):
            output_queue.put(result)

    @profiler.profile(name="PaperNavigateEdge")
    def execute(
        self, state: Dict[str, Any], input: DataGenerator = None
    ) -> DataGenerator:
        arxiv_link_queue = Queue()
        scholar_link_queue = Queue()
        output_queue = Queue()

        logger.debug("================= START NAVIGATE ==============")
        for paper in input:
            if not paper:
                continue

            data_id = paper.get("data", {}).get("data_id", "")
            if not data_id:
                continue

            if self.persist_store.get_state(data_id, "REF_DONE"):
                # This means that the data has already processed
                logger.info(f"Reference of ID '{data_id}' already obtained.")

                reference_paths = self.persist_store.get_state(data_id, "REF_DONE")
                references = reference_paths.get("data", [])
                for reference_info in references:
                    yield reference_info
                continue

            parent_id = paper.get("data", {}).get("id", "")
            arxiv_tasks = set(paper.get("data", {}).get("reference", []))

            if len(parent_id) == 0 or len(arxiv_tasks) == 0:
                continue

            for arxiv_task in arxiv_tasks:
                arxiv_link_queue.put((1, arxiv_task, parent_id, data_id))

        self.thread_allocator.request(amount=self.arxiv_download_concurrency)

        if not arxiv_link_queue.empty():
            records = {}
            with concurrent.futures.ThreadPoolExecutor(
                max_workers=self.arxiv_download_concurrency
            ) as arxiv_download_executor:
                # , concurrent.futures.ThreadPoolExecutor(
                #     max_workers=self.scholar_download_concurrency
                # ) as scholar_download_executor:
                futures = []
                for _ in range(self.arxiv_download_concurrency):
                    futures.append(
                        arxiv_download_executor.submit(
                            self.run_worker,
                            self.arxiv_download_worker,
                            arxiv_link_queue,
                            scholar_link_queue,
                            output_queue,
                        )
                    )

                # if self.search_scholar:
                #     for _ in range(self.scholar_download_concurrency):
                #         futures.append(
                #             scholar_download_executor.submit(
                #                 self.run_worker,
                #                 self.scholar_download_worker,
                #                 arxiv_link_queue,
                #                 scholar_link_queue,
                #                 output_queue,
                #             )
                #         )

                while (
                    arxiv_link_queue.unfinished_tasks != 0
                    or scholar_link_queue.unfinished_tasks != 0
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

                arxiv_link_queue.join()
                scholar_link_queue.join()
                output_queue.join()

                if self.search_scholar:
                    for _ in range(self.scholar_download_concurrency):
                        scholar_link_queue.put(None)

            self.thread_allocator.release(amount=self.arxiv_download_concurrency)

            for parent_data_id in records:
                if len(records[parent_data_id]) > 0:
                    self.persist_store.save_state(
                        parent_data_id, "REF_DONE", {"data": records[parent_data_id]}
                    )

        logger.debug("================= FINISH NAVIGATE ==============")
