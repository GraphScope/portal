from .base_edge import BaseEdge, EdgeType, DataGenerator
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

    def arxiv_download_worker(self, arxiv_tasks):
        arxiv_fetcher = ArxivFetcher(download_folder=self.paper_download_dir)
        for link in arxiv_tasks:
            if link is None or len(link) < 5:
                continue
            download_list = arxiv_fetcher.download_paper(link, 1)
            if len(download_list) == 0:
                logger.info(f"PASS {link} to SCHOLAR FOR FURTHER SEARCH")
                yield link, None
            else:
                for download_info in download_list:
                    succ, path, exist = download_info
                    if succ and path is not None:
                        logger.info(f"SUCCESSFULLY GET PAPER {path}")
                        yield None, path
                    else:
                        if not exist:
                            logger.info(f"PASS {link} to SCHOLAR FOR FURTHER SEARCH")
                            yield link, None
                    break

    def scholar_download_worker(self, scholar_tasks):
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
                succ, path, exist = download_info
                if succ and path is not None:
                    logger.info(f"SUCCESSFULLY GET PAPER {path}")
                    yield path

    @profiler.profile(name="PaperNavigateEdge")
    def execute(
        self, state: Dict[str, Any], input: DataGenerator = None
    ) -> DataGenerator:
        scholar_dict = {}

        ref_count = 0

        for paper in input:
            if not paper:
                continue
            parent_id = paper.get("data", {}).get("id", "")
            arxiv_tasks = set(paper.get("data", {}).get("reference", []))

            if len(parent_id) == 0 or len(arxiv_tasks) == 0:
                continue

            for scholar_task, paper_path in self.arxiv_download_worker(arxiv_tasks):
                if scholar_task:
                    scholar_dict.setdefault(parent_id, []).append(scholar_task)

                if paper_path:
                    logger.debug(
                        f" ============= OUTPUT {(parent_id, paper_path)} RESULT =============="
                    )

                    ref_count += 1

                    yield {
                        "paper_file_path": paper_path,
                        "parent_id": parent_id,
                        "edge_name": self.name,
                    }
