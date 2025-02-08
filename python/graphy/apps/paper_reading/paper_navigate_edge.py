from graph.edges.base_edge import AbstractEdge, EdgeType
from graph.types import DataGenerator
from utils import ArxivFetcher, ScholarFetcher, PubMedFetcher
from config import WF_OUTPUT_DIR
from db import PersistentStore, JsonFileStore

from enum import Enum, auto
from typing import Dict, Any, Type
from utils.profiler import profiler
import logging
import threading
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


class PaperNavigateEdge(AbstractEdge):
    def __init__(
        self,
        source: str,
        target: str,
        paper_download_dir: str,
        name: str = None,
        persist_store: PersistentStore = None,
        download_concurrency=1,
        finish_signal="_REF_DONE",
        max_thread_num=12,
        ref_mode=ReferenceExtractStateMode.SkipIfExists,
        meta_folder_dir="",
        key_name="reference",
    ):
        super().__init__(source, target, name, EdgeType.NAVIGATOR)
        self.paper_download_dir = paper_download_dir
        os.makedirs(self.paper_download_dir, exist_ok=True)

        self.download_concurrency = download_concurrency
        self.persist_store = persist_store
        self.finish_signal = finish_signal
        self.max_thread_num = max_thread_num
        self.ref_mode = ref_mode
        self.meta_folder_dir = meta_folder_dir
        self.key_name = key_name

        self.thread_allocator = ResourceAllocator(self.max_thread_num)

    def download_worker(self, link_queue):
        """Default worker, must be overridden by subclasses."""
        raise NotImplementedError("Subclasses must implement 'download_worker'.")

    def run_worker(self, worker_func, link_queue, output_queue):
        for result in worker_func(link_queue):
            output_queue.put(result)

    @classmethod
    def from_dict(cls: Type["PaperNavigateEdge"], edge_conf, persist_store=None):
        name = edge_conf.get("name", "")
        source = edge_conf.get("source", "")
        target = edge_conf.get("target", "")
        method = edge_conf.get("method", "arxiv")
        args = edge_conf.get("args", {})
        if not persist_store:
            persist_store = JsonFileStore(WF_OUTPUT_DIR)
        if not source or not target:
            raise ValueError("Both 'source' and 'target' must be defined in an edge.")

        paper_download_dir = os.path.join(
            persist_store.output_folder,
            "_NAVIGATOR",
            name,
        )
        meta_folder_dir = os.path.join("_META_FOLDER", name)
        finish_signal = args.get("finish_signal", "_REF_DONE")
        max_thread_num = args.get("max_thread_num", 12)
        ref_mode = args.get("ref_mode", "skip").lower()
        if ref_mode == "skip":
            ref_mode = ReferenceExtractStateMode.SkipIfExists
        elif ref_mode == "append":
            ref_mode = ReferenceExtractStateMode.AppendIfExists
        else:
            ref_mode = ReferenceExtractStateMode.SkipIfExists
        key_name = args.get("key_name", "reference").lower()

        if method == "scholar":
            return PaperNavigateScholarEdge(
                source=source,
                target=target,
                paper_download_dir=paper_download_dir,
                name=name,
                scholar_download_concurrency=4,
                persist_store=persist_store,
                finish_signal=finish_signal,
                max_thread_num=max_thread_num,
                ref_mode=ref_mode,
                meta_folder_dir=meta_folder_dir,
                key_name=key_name,
            )
        elif method == "pubmed":
            return PaperNavigatePubMedEdge(
                source=source,
                target=target,
                paper_download_dir=paper_download_dir,
                name=name,
                persist_store=persist_store,
                pubmed_download_concurrency=3,
                finish_signal=finish_signal,
                max_thread_num=max_thread_num,
                ref_mode=ref_mode,
                meta_folder_dir=meta_folder_dir,
                key_name=key_name,
            )
        else:
            return PaperNavigateArxivEdge(
                source=source,
                target=target,
                paper_download_dir=paper_download_dir,
                name=name,
                persist_store=persist_store,
                arxiv_download_concurrency=4,
                finish_signal=finish_signal,
                max_thread_num=max_thread_num,
                ref_mode=ref_mode,
                meta_folder_dir=meta_folder_dir,
                key_name=key_name,
            )

    @profiler.profile(name="PaperNavigateEdge")
    def execute(
        self, state: Dict[str, Any], input: DataGenerator = None
    ) -> DataGenerator:
        link_queue = Queue()
        output_queue = Queue()

        logger.info(f"================= START NAVIGATE ==============")
        paper_data_id_list = []
        for paper in input:
            if not paper:
                continue

            data_id = paper.get("data", {}).get("data_id", "")
            if not data_id:
                continue

            reference_hist = self.persist_store.get_state(data_id, self.finish_signal)

            if reference_hist:
                # This means that the data has already processed
                logger.info(f"{self.name} of ID '{data_id}' already obtained.")

                references = reference_hist.get("data", [])
                for reference_info in references:
                    yield reference_info

                if self.ref_mode == ReferenceExtractStateMode.SkipIfExists:
                    continue

            parent_id = paper.get("data", {}).get("id", "")
            tasks = paper.get("data", {}).get(self.key_name, [])

            if len(parent_id) == 0 or len(tasks) == 0:
                continue

            paper_data_id_list.append(data_id)

            succeed_tasks = []
            if reference_hist:
                succeed_tasks = reference_hist.get("task", [])

            for task in tasks:
                if task not in succeed_tasks:
                    link_queue.put((task, parent_id, data_id))

        records = {}
        succ_records = {}
        if not link_queue.empty():
            self.thread_allocator.request(amount=self.download_concurrency)
            try:
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
                            paper_path, meta_path, parent_id, parent_data_id, task = (
                                output_queue.get(timeout=0.1)
                            )  # Attempt to get a result from the queue
                            output_json = {
                                "paper_file_path": paper_path,
                                "paper_meta_path": meta_path,
                                "parent_id": parent_id,
                                "edge_name": self.name,
                            }

                            yield output_json

                            records.setdefault(parent_data_id, []).append(output_json)
                            succ_records.setdefault(parent_data_id, []).append(task)
                            output_queue.task_done()
                        except queue.Empty:
                            continue

                    link_queue.join()
                    output_queue.join()
            except Exception as e:
                logger.error(f"Get Paper Error: {e}")
            finally:
                self.thread_allocator.release(amount=self.download_concurrency)

        for parent_data_id in paper_data_id_list:
            cur_result = {"data": [], "task": []}
            if self.ref_mode == ReferenceExtractStateMode.AppendIfExists:
                original_info = self.persist_store.get_state(
                    parent_data_id, self.finish_signal
                )
                if original_info:
                    if "data" in original_info and original_info["data"]:
                        cur_result["data"] = original_info["data"]
                    if "task" in original_info and original_info["task"]:
                        cur_result["task"] = original_info["task"]

            if parent_data_id in records:
                cur_result["data"].extend(records[parent_data_id])
                cur_result["task"].extend(succ_records[parent_data_id])

            if cur_result:
                self.persist_store.save_state(
                    parent_data_id, self.finish_signal, cur_result
                )

        logger.info("================= FINISH NAVIGATE ==============")


@profiler.profile(name="PaperNavigateArxivEdge")
class PaperNavigateArxivEdge(PaperNavigateEdge):
    def __init__(
        self,
        source: str,
        target: str,
        paper_download_dir: str,
        name: str = None,
        persist_store: PersistentStore = None,
        arxiv_download_concurrency=4,
        finish_signal="_ARXIV_REF_DONE",
        max_thread_num=12,
        ref_mode=ReferenceExtractStateMode.SkipIfExists,
        meta_folder_dir="",
        key_name="reference",
    ):
        logger.info("initialize of `PaperNavigateArxivEdge`")
        super().__init__(
            source=source,
            target=target,
            name=name,
            persist_store=persist_store,
            download_concurrency=arxiv_download_concurrency,
            paper_download_dir=paper_download_dir,
            finish_signal=finish_signal,
            max_thread_num=max_thread_num,
            ref_mode=ref_mode,
            meta_folder_dir=meta_folder_dir,
            key_name=key_name,
        )

    @classmethod
    def from_dict(cls, edge_conf, persist_store=None):
        name = edge_conf.get("name", "")
        source = edge_conf.get("source", "")
        target = edge_conf.get("target", "")
        args = edge_conf.get("args", {})
        if not persist_store:
            persist_store = JsonFileStore(WF_OUTPUT_DIR)
        if not source or not target:
            raise ValueError("Both 'source' and 'target' must be defined in an edge.")

        paper_download_dir = os.path.join(
            persist_store.output_folder,
            "_NAVIGATOR",
            name,
        )
        meta_folder_dir = os.path.join("_META_FOLDER", name)
        finish_signal = args.get("finish_signal", "REF_DONE")
        max_thread_num = args.get("max_thread_num", 12)
        ref_mode = args.get("ref_mode", "skip").lower()
        if ref_mode == "skip":
            ref_mode = ReferenceExtractStateMode.SkipIfExists
        elif ref_mode == "append":
            ref_mode = ReferenceExtractStateMode.AppendIfExists
        else:
            ref_mode = ReferenceExtractStateMode.SkipIfExists
        key_name = args.get("key_name", "reference").lower()
        return cls(
            source=source,
            target=target,
            name=name,
            persist_store=persist_store,
            paper_download_dir=paper_download_dir,
            finish_signal=finish_signal,
            max_thread_num=max_thread_num,
            ref_mode=ref_mode,
            meta_folder_dir=meta_folder_dir,
            key_name=key_name,
        )

    def download_worker(self, link_queue):
        while not link_queue.empty():
            info = link_queue.get()

            if info is None:
                link_queue.task_done()
                continue
            link, parent_id, parent_data_id = info

            if link is None:
                link_queue.task_done()
                continue

            if type(link) is dict:
                link = link.get("citation", None)

            if link is None or len(link) < 5:
                link_queue.task_done()
                continue

            logger.info(
                f"--------------  ARXIV DOWNLOAD WORKER: {link}  ------------------"
            )

            arxiv_fetcher = ArxivFetcher(
                persist_store=self.persist_store,
                download_folder=self.paper_download_dir,
                meta_folder=self.meta_folder_dir,
            )
            download_list = arxiv_fetcher.download_paper(link, 5)

            if len(download_list) == 0:
                logger.info(f"PASS {link} to SCHOLAR FOR FURTHER SEARCH")
            else:
                for download_info in download_list:
                    succ, path, meta_path, exist = download_info
                    if succ:
                        logger.info(f"SUCCESSFULLY GET PAPER {path}")
                        yield path, meta_path, parent_id, parent_data_id, link
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
        source: str,
        target: str,
        paper_download_dir: str,
        name: str = None,
        persist_store: PersistentStore = None,
        scholar_download_concurrency=4,
        finish_signal="_SCHOLAR_REF_DONE",
        max_thread_num=8,
        ref_mode=ReferenceExtractStateMode.SkipIfExists,
        meta_folder_dir="",
        key_name="reference",
    ):
        logger.info("initialize of `PaperNavigateScholarEdge`")
        super().__init__(
            source=source,
            target=target,
            name=name,
            persist_store=persist_store,
            download_concurrency=scholar_download_concurrency,
            paper_download_dir=paper_download_dir,
            finish_signal=finish_signal,
            max_thread_num=max_thread_num,
            ref_mode=ref_mode,
            meta_folder_dir=meta_folder_dir,
            key_name=key_name,
        )

    @classmethod
    def from_dict(cls, edge_conf, persist_store=None):
        name = edge_conf.get("name", "")
        source = edge_conf.get("source", "")
        target = edge_conf.get("target", "")
        args = edge_conf.get("args", {})
        if not persist_store:
            persist_store = JsonFileStore(WF_OUTPUT_DIR)
        if not source or not target:
            raise ValueError("Both 'source' and 'target' must be defined in an edge.")

        paper_download_dir = os.path.join(
            persist_store.output_folder,
            "_NAVIGATOR",
            name,
        )
        meta_folder_dir = os.path.join("_META_FOLDER", name)
        finish_signal = args.get("finish_signal", "REF_DONE")
        max_thread_num = args.get("max_thread_num", 12)
        ref_mode = args.get("ref_mode", "skip").lower()
        if ref_mode == "skip":
            ref_mode = ReferenceExtractStateMode.SkipIfExists
        elif ref_mode == "append":
            ref_mode = ReferenceExtractStateMode.AppendIfExists
        else:
            ref_mode = ReferenceExtractStateMode.SkipIfExists
        key_name = args.get("key_name", "reference").lower()
        return cls(
            source=source,
            target=target,
            name=name,
            persist_store=persist_store,
            paper_download_dir=paper_download_dir,
            finish_signal=finish_signal,
            max_thread_num=max_thread_num,
            ref_mode=ref_mode,
            meta_folder_dir=meta_folder_dir,
            key_name=key_name,
        )

    def download_worker(self, scholar_link_queue):
        while not scholar_link_queue.empty():
            info = scholar_link_queue.get()

            if info is None:
                scholar_link_queue.task_done()
                break
            link, parent_id, parent_data_id = info

            if link is None:
                scholar_link_queue.task_done()
                continue

            if type(link) is dict:
                link = link.get("citation", None)

            if link is None or len(link) < 5:
                scholar_link_queue.task_done()
                continue

            logger.error(
                f"--------------  SCHOLAR DOWNLOAD WORKER: {link}  ------------------"
            )

            # time.sleep(random.uniform(1, 4))

            web_data_dir = os.path.join(
                self.paper_download_dir,
                "tmp",
                "webdata",
            )

            scholar_fetcher = ScholarFetcher(
                persist_store=self.persist_store,
                download_folder=self.paper_download_dir,
                web_data_folder=web_data_dir,
                meta_folder=self.meta_folder_dir,
            )
            logger.info(
                f"--------------  start to download: {link}  ------------------"
            )
            download_list = scholar_fetcher.download_paper(link, mode="exact")
            logger.info(f"--------------  finish download: {link}  ------------------")

            for download_info in download_list:
                succ, path, meta_path, exist = download_info
                if succ:
                    logger.info(f"SUCCESSFULLY GET PAPER {path}")
                    yield path, meta_path, parent_id, parent_data_id, link

            scholar_link_queue.task_done()

            logger.error(
                f"--------------  FINISH SCHOLAR WORKER: {link}  ------------------"
            )

        logger.info("QUIT SCHOLAR")


@profiler.profile(name="PaperNavigatePubMedEdge")
class PaperNavigatePubMedEdge(PaperNavigateEdge):
    def __init__(
        self,
        source,
        target,
        paper_download_dir,
        name=None,
        persist_store=None,
        pubmed_download_concurrency=4,
        finish_signal="_PUBMED_REF_DONE",
        max_thread_num=12,
        ref_mode=ReferenceExtractStateMode.SkipIfExists,
        meta_folder_dir="",
        key_name="reference",
    ):
        logger.info("initialize of `PaperNavigatePubMedEdge`")
        super().__init__(
            source=source,
            target=target,
            name=name,
            persist_store=persist_store,
            download_concurrency=pubmed_download_concurrency,
            paper_download_dir=paper_download_dir,
            finish_signal=finish_signal,
            max_thread_num=max_thread_num,
            ref_mode=ref_mode,
            meta_folder_dir=meta_folder_dir,
            key_name=key_name,
        )

    @classmethod
    def from_dict(cls, edge_conf, persist_store=None):
        name = edge_conf.get("name", "")
        source = edge_conf.get("source", "")
        target = edge_conf.get("target", "")
        args = edge_conf.get("args", {})
        if not persist_store:
            persist_store = JsonFileStore(WF_OUTPUT_DIR)
        if not source or not target:
            raise ValueError("Both 'source' and 'target' must be defined in an edge.")

        paper_download_dir = os.path.join(
            persist_store.output_folder,
            "_NAVIGATOR",
            name,
        )
        meta_folder_dir = os.path.join("_META_FOLDER", name)
        finish_signal = args.get("finish_signal", "REF_DONE")
        max_thread_num = args.get("max_thread_num", 12)
        ref_mode = args.get("ref_mode", "skip").lower()
        if ref_mode == "skip":
            ref_mode = ReferenceExtractStateMode.SkipIfExists
        elif ref_mode == "append":
            ref_mode = ReferenceExtractStateMode.AppendIfExists
        else:
            ref_mode = ReferenceExtractStateMode.SkipIfExists
        key_name = args.get("key_name", "reference").lower()
        return cls(
            source=source,
            target=target,
            name=name,
            persist_store=persist_store,
            paper_download_dir=paper_download_dir,
            finish_signal=finish_signal,
            max_thread_num=max_thread_num,
            ref_mode=ref_mode,
            meta_folder_dir=meta_folder_dir,
            key_name=key_name,
        )

    def download_worker(self, link_queue):
        while not link_queue.empty():
            info = link_queue.get()

            if info is None:
                link_queue.task_done()
                continue
            link, parent_id, parent_data_id = info

            if link is None:
                link_queue.task_done()
                continue

            use_id = False

            if type(link) is dict:
                if "pubmed_id" in link:
                    use_id = True
                    link = link.get("pubmed_id")
                else:
                    link = link.get("citation", None)

            if link is None or len(link) < 5:
                link_queue.task_done()
                continue

            logger.info(
                f"--------------  PubMed DOWNLOAD WORKER: {link}  ------------------"
            )

            pubmed_fetcher = PubMedFetcher(
                persist_store=self.persist_store,
                download_folder=self.paper_download_dir,
                meta_folder=self.meta_folder_dir,
            )

            if use_id:
                download_list = pubmed_fetcher.download_paper("", 5, link)
            else:
                download_list = pubmed_fetcher.download_paper(link, 5, None)

            if len(download_list) == 0:
                logger.info(f"PASS {link} FOR FURTHER SEARCH")
            else:
                for download_info in download_list:
                    succ, path, meta_path, exist = download_info
                    if succ:
                        logger.info(f"SUCCESSFULLY GET PAPER {path}")
                        yield path, meta_path, parent_id, parent_data_id, link
                    else:
                        logger.info(f"PASS {link} FOR FURTHER SEARCH")
                    break

            link_queue.task_done()

            logger.info(
                f"--------------  FINISH PubMed WORKER: {link}  ------------------"
            )

        logger.info("QUIT PubMed")
