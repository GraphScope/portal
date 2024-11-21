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


class PaperNavigateEdge(BaseEdge):
    def __init__(
        self,
        source,
        target,
        paper_download_dir,
        name=None,
        arxiv_download_concurrency=8,
        scholar_download_concurrency=2,
        max_paper_num=-1,
        max_hop=1,
    ):
        super().__init__(source, target, name)

        self.paper_download_dir = paper_download_dir
        os.makedirs(self.paper_download_dir, exist_ok=True)

        self.arxiv_link_queue = Queue()
        self.scholar_link_queue = Queue()
        self.output_queue = Queue()
        self.arxiv_download_concurrency = arxiv_download_concurrency
        self.scholar_download_concurrency = scholar_download_concurrency
        self.max_paper_num = max_paper_num
        self.max_hop = max_hop

        self.hop_num_limits = {}
        self.hop_num = {}
        self.lock = threading.Lock()

        self.search_scholar = False

        self.paper_count_lock = threading.Lock()
        self.paper_num = 0

        self.remove_paper_task_lock = threading.Lock()

        self.count_lock = threading.Lock()
        self.counts = {
            "arxiv_request": 0,
            "arxiv_download": 0,
            "scholar_request": 0,
            "scholar_download": 0,
            "scholar": [],
        }

    def arxiv_download_worker(self):
        while not self.arxiv_link_queue.empty():
            info = self.arxiv_link_queue.get()

            if info is None:
                self.arxiv_link_queue.task_done()
                continue
            hop, link, parent_id = info

            if link is None or len(link) < 5:
                self.arxiv_link_queue.task_done()
                continue

            if self.max_paper_num != -1:
                if self.paper_num >= self.max_paper_num:
                    self.arxiv_link_queue.task_done()
                    continue

            logger.info(
                f"--------------  ARXIV DOWNLOAD WORKER: {link} {hop}-hop  ------------------"
            )

            arxiv_fetcher = ArxivFetcher(download_folder=self.paper_download_dir)
            download_list = arxiv_fetcher.download_paper(link, 1)

            if len(download_list) == 0:
                logger.info(f"PASS {link} to SCHOLAR FOR FURTHER SEARCH")
                if self.search_scholar:
                    self.scholar_link_queue.put((hop, link, parent_id))
            else:
                for download_info in download_list:
                    succ, path, exist = download_info
                    if succ and path is not None:
                        logger.info(f"SUCCESSFULLY GET PAPER {path}")
                        yield path, parent_id
                    else:
                        logger.info(f"PASS {link} to SCHOLAR FOR FURTHER SEARCH")
                        if self.search_scholar:
                            self.scholar_link_queue.put((hop, link, parent_id))
                    break

            self.arxiv_link_queue.task_done()

            logger.info(
                f"--------------  FINISH ARXIV WORKER: {link}  ------------------"
            )

        logger.info("QUIT ARXIV")
        logger.info(
            f"{self.output_queue.qsize()} {self.scholar_link_queue.qsize()} {self.arxiv_link_queue.qsize()}"
        )

    def scholar_download_worker(self):
        while True:
            info = self.scholar_link_queue.get()

            if info is None:
                self.scholar_link_queue.task_done()
                break
            hop, link, parent_id = info

            if link is None or len(link) < 5:
                self.scholar_link_queue.task_done()
                continue

            if self.max_paper_num != -1:
                if self.paper_num >= self.max_paper_num:
                    self.scholar_link_queue.task_done()
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
                    yield path, parent_id

            self.scholar_link_queue.task_done()

            logger.info(
                f"--------------  FINISH SCHOLAR WORKER: {link}  ------------------"
            )

        logger.info("QUIT SCHOLAR")

    def run_worker(self, worker_func):
        for result in worker_func():
            self.output_queue.put(result)

    @profiler.profile(name="PaperNavigateEdge")
    def execute(
        self, state: Dict[str, Any], input: DataGenerator = None
    ) -> DataGenerator:
        logger.debug("================= START NAVIGATE ==============")
        for paper in input:
            if not paper:
                continue
            parent_id = paper.get("data", {}).get("id", "")
            arxiv_tasks = set(paper.get("data", {}).get("reference", []))

            if len(parent_id) == 0 or len(arxiv_tasks) == 0:
                continue

            for arxiv_task in arxiv_tasks:
                self.arxiv_link_queue.put((1, arxiv_task, parent_id))

        with concurrent.futures.ThreadPoolExecutor(
            max_workers=self.arxiv_download_concurrency
        ) as arxiv_download_executor, concurrent.futures.ThreadPoolExecutor(
            max_workers=self.scholar_download_concurrency
        ) as scholar_download_executor:
            futures = []
            for _ in range(self.arxiv_download_concurrency):
                futures.append(
                    arxiv_download_executor.submit(
                        self.run_worker, self.arxiv_download_worker
                    )
                )

            if self.search_scholar:
                for _ in range(self.scholar_download_concurrency):
                    futures.append(
                        scholar_download_executor.submit(
                            self.run_worker, self.scholar_download_worker
                        )
                    )

            while (
                not self.arxiv_link_queue.empty()
                or not self.scholar_link_queue.empty()
                or not self.output_queue.empty()
            ):
                try:
                    paper_path, parent_id = self.output_queue.get(
                        timeout=0.1
                    )  # Attempt to get a result from the queue
                    yield {
                        "paper_file_path": paper_path,
                        "parent_id": parent_id,
                        "edge_name": self.name,
                    }
                    self.output_queue.task_done()
                except queue.Empty:
                    continue

            self.arxiv_link_queue.join()
            self.scholar_link_queue.join()
            self.output_queue.join()

            if self.search_scholar:
                for _ in range(self.scholar_download_concurrency):
                    self.scholar_link_queue.put(None)

        logger.debug("================= FINISH NAVIGATE ==============")
