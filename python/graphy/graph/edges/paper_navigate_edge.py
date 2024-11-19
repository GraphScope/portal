from base_edge import BaseEdge, EdgeType, DataGenerator
from utils import ArxivFetcher, ScholarFetcher
from config import WF_PDF_DOWNLOAD_DIR

from typing import Dict, List, Any
from utils.profiler import profiler
import logging
import threading
import shutil
import copy
import os

logger = logging.getLogger(__name__)


class PaperNavigateEdge(BaseEdge):
    def __init__(self, source, target, name=None):
        super().__init__(source, target, name)

        self.paper_download_dir = WF_PDF_DOWNLOAD_DIR
        self.add_fetched_paper_lock = threading.Lock()

    def arxiv_download_worker(self, state, arxiv_tasks):
        scholar_tasks = set()
        fetched_arxiv_paper = []

        arxiv_fetcher = ArxivFetcher(download_folder=self.paper_download_dir)
        for link in arxiv_tasks:
            if link is None or len(link) < 5:
                continue

            download_list = arxiv_fetcher.download_paper(link, 1)

            if len(download_list) == 0:
                logger.info(f"PASS {link} to SCHOLAR FOR FURTHER SEARCH")
                scholar_tasks.add(link)
            else:
                for download_info in download_list:
                    succ, path = download_info
                    if succ and path is not None:
                        if path not in fetched_arxiv_paper:
                            with self.add_fetched_paper_lock:
                                if path not in state["fetched_paper"]:
                                    fetched_arxiv_paper.append(path)
                                    state["fetched_paper"].add(path)
                                    logger.info(f"SUCCESSFULLY GET PAPER {path}")
                    else:
                        logger.info(f"PASS {link} to SCHOLAR FOR FURTHER SEARCH")
                        scholar_tasks.add(link)
                    break

        return scholar_tasks, fetched_arxiv_paper

    def scholar_download_worker(self, state, scholar_tasks):
        fetched_scholar_paper = []

        for link in scholar_tasks:
            if link is None or len(link) < 5:
                continue

            # time.sleep(random.uniform(1, 4))

            web_data_dir = os.path.join(
                self.paper_download_dir,
                "tmp",
                "webdata",
                # f"{str(uuid.uuid5(uuid.NAMESPACE_DNS, link))}",
            )

            scholar_fetcher = ScholarFetcher(
                download_folder=self.paper_download_dir, web_data_folder=web_data_dir
            )
            download_list = scholar_fetcher.download_paper(link, mode="exact")

            for download_info in download_list:
                succ, path = download_info
                if succ and path is not None:
                    if path not in fetched_scholar_paper:
                        with self.add_fetched_paper_lock:
                            if path not in state["fetched_paper"]:
                                fetched_scholar_paper.append(path)
                                state["fetched_paper"].add(path)
                                logger.info(f"SUCCESSFULLY GET PAPER {path}")

        return fetched_scholar_paper

    @profiler.profile(name="PaperNavigateEdge")
    def execute(
        self, state: Dict[str, Any], input: DataGenerator = None
    ) -> DataGenerator:
        with self.add_fetched_paper_lock:
            if "fetched_paper" not in state:
                state["fetched_paper"] = set()

        scholar_dict = {}

        for paper in input:
            arxiv_tasks = set()
            parent_id = paper.get("data", {}).get("id", "")
            arxiv_tasks = paper.get("data", {}).get("reference", set())

            if len(parent_id) == 0 or len(arxiv_tasks) == 0:
                continue

            scholar_tasks, fetched_arxiv_paper = self.arxiv_download_worker(
                state, arxiv_tasks
            )

            yield [(parent_id, x) for x in fetched_arxiv_paper]

            scholar_dict[parent_id] = scholar_tasks

            logger.info("=================== OBTAINED ARXIVS =================")
            logger.info([(parent_id, x) for x in fetched_arxiv_paper])

        # for parent_id, tasks in scholar_dict.items():
        #     if len(tasks) == 0:
        #         continue
        #     fetched_scholar_paper = self.scholar_download_worker(tasks)
        #     yield [(parent_id, x) for x in fetched_scholar_paper]
