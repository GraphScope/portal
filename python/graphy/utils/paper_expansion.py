from extractor.paper_extractor import PaperExtractor
from utils import ArxivFetcher, ScholarFetcher
from graph.nodes.pdf_extract_node import PDFExtractNode
from memory.llm_memory import PaperReadingMemoryManager

from langchain_community.chat_models import ChatOllama
from chromadb.utils import embedding_functions
from models import DefaultEmbedding

import concurrent.futures
import time
import random
from queue import Queue
import os
import shutil
import threading
import uuid

import logging

logger = logging.getLogger(__name__)


class SearchableQueue:
    def __init__(self):
        self._queue = Queue()
        self._lock = threading.Lock()
        self._clear_lock = threading.Lock()
        self._elements = set()

    def put(self, item):
        if isinstance(item, tuple) and len(item) == 2:
            with self._lock:
                if item[1] is None:
                    self._queue.put(item)
                    return True
                elif item[1] not in self._elements:
                    self._elements.add(item[1])
                    self._queue.put(item)
                    return True
            return False
        else:
            return False

    def get(self):
        item = self._queue.get()
        return item

    def task_done(self):
        self._queue.task_done()

    def join(self):
        self._queue.join()

    def empty(self):
        return self._queue.empty()

    def get_nowait(self):
        return self._queue.get_nowait()

    def clear(self):
        with self._clear_lock:
            self._elements.clear()

            while not self._queue.empty():
                self._queue.get()
                self._queue.task_done()


class PaperExpansion:
    def __init__(
        self,
        llm_model,
        embedding_model,
        extract_concurrency,
        arxiv_download_concurrency,
        scholar_download_concurrency,
        max_paper_num,
        max_hop,
    ):
        self.llm_model = llm_model
        self.embedding_model = embedding_model

        self.paper_queue = SearchableQueue()
        self.arxiv_link_queue = SearchableQueue()
        self.scholar_link_queue = SearchableQueue()
        self.extract_concurrency = extract_concurrency
        self.arxiv_download_concurrency = arxiv_download_concurrency
        self.scholar_download_concurrency = scholar_download_concurrency
        self.max_paper_num = max_paper_num
        self.max_hop = max_hop

        self.paper_pool_dir = ""
        self.output_dir = "persist"

        self.hop_num_limits = {}
        self.hop_num = {}
        self.lock = threading.Lock()

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
        while True:
            info = self.arxiv_link_queue.get()

            if info is None:
                self.arxiv_link_queue.task_done()
                break
            hop, link = info

            if link is None:
                self.arxiv_link_queue.task_done()
                break

            if self.max_paper_num != -1:
                if self.paper_num >= self.max_paper_num:
                    self.arxiv_link_queue.task_done()
                    continue

            logger.info(
                f"--------------  ARXIV DOWNLOAD WORKER: {link} {hop}-hop  ------------------"
            )

            arxiv_fetcher = ArxivFetcher(download_folder=self.paper_pool_dir)
            download_list = arxiv_fetcher.download_paper(link, 1)

            if len(download_list) == 0:
                logger.info(f"PASS {link} to SCHOLAR FOR FURTHER SEARCH")
                self.scholar_link_queue.put((hop, link))
            else:
                for download_info in download_list:
                    succ, path, exist = download_info
                    if succ and path is not None:
                        logger.info(f"SUCCESSFULLY GET PAPER {path}")
                        nonexist = self.paper_queue.put((hop, path))

                        if not nonexist:
                            os.remove(path)
                    else:
                        logger.info(f"PASS {link} to SCHOLAR FOR FURTHER SEARCH")
                        self.scholar_link_queue.put((hop, link))
                    break

            self.arxiv_link_queue.task_done()

            logger.info(
                f"--------------  FINISH ARXIV WORKER: {link}  ------------------"
            )

        logger.info("QUIT ARXIV")

    def scholar_download_worker(self):
        while True:
            info = self.scholar_link_queue.get()

            if info is None:
                self.scholar_link_queue.task_done()
                break
            hop, link = info

            if link is None:
                self.scholar_link_queue.task_done()
                break

            if self.max_paper_num != -1:
                if self.paper_num >= self.max_paper_num:
                    self.scholar_link_queue.task_done()
                    continue

            logger.info(
                f"--------------  SCHOLAR DOWNLOAD WORKER: {link} {hop}-hop  ------------------"
            )

            # time.sleep(random.uniform(1, 4))

            web_data_dir = os.path.join(
                self.paper_pool_dir,
                "tmp",
                "webdata",
                # f"{str(uuid.uuid5(uuid.NAMESPACE_DNS, link))}",
            )

            # web_data_dir = os.path.join(
            #     self.paper_pool_dir,
            #     "webdata",
            # )

            scholar_fetcher = ScholarFetcher(
                download_folder=self.paper_pool_dir, web_data_folder=web_data_dir
            )
            download_list = scholar_fetcher.download_paper(link, mode="exact")

            for download_info in download_list:
                succ, path, exist = download_info
                if succ and path is not None:
                    logger.info(f"SUCCESSFULLY GET PAPER {path}")
                    nonexist = self.paper_queue.put((hop, path))

                    logger.debug(f"RESULT OF DOWNLOAD: {link} is {succ}")

                    if not nonexist:
                        os.remove(path)

            self.scholar_link_queue.task_done()

            logger.info(
                f"--------------  FINISH SCHOLAR WORKER: {link}  ------------------"
            )

        logger.info("QUIT SCHOLAR")

    def extractor_worker(self):
        while True:
            # "/path/to/the/file/xxx.pdf"
            hop, paper_path = self.paper_queue.get()

            if paper_path is None:
                self.paper_queue.task_done()
                break

            if self.max_paper_num != -1:
                if self.paper_num >= self.max_paper_num:
                    self.paper_queue.task_done()
                    continue

            logger.info(
                f"-------------- EXTRACTOR GET PAPER {hop} - {paper_path} -----------------"
            )

            cont = True
            if not os.path.exists(paper_path):
                logger.warning(f"File {paper_path} does not exist.")
                cont = False

            if cont:
                try:
                    with open(paper_path, "r") as file:
                        pass
                except (OSError, IOError) as e:
                    logger.error(f"Error opening file {paper_path}: {e}")
                    cont = False
            if not cont:
                os.remove(paper_path)
                self.paper_queue.task_done()
                continue

            paper_name = os.path.splitext(os.path.basename(paper_path))[0]
            logger.info(
                f"--------------  EXTRACTOR WORKER: {paper_name}  ------------------"
            )

            img_path = os.path.join(
                self.paper_pool_dir, "tmp", "img_store", f"{paper_name}"
            )

            persist_path = os.path.join(self.paper_pool_dir, self.output_dir)

            try:
                pdf_extractor = PaperExtractor(paper_path)
                pdf_extractor.set_img_path(img_path)

                node = PDFExtractNode(
                    embeddings=self.embedding_model,
                    memory_manager=PaperReadingMemoryManager(
                        self.llm_model,
                        self.embedding_model,
                        str(uuid.uuid5(uuid.NAMESPACE_DNS, paper_name)),
                        vectordb=None,
                    ),
                    pdf_extractor=pdf_extractor,
                    name="extract",
                    arxiv_fetch_paper=True,
                    scholar_fetch_paper=True,
                )

                compute_link = True
                if self.max_paper_num != -1:
                    with self.paper_count_lock:
                        self.paper_num += 1
                    if self.paper_num >= self.max_paper_num:
                        compute_link = False

                if self.max_hop != -1 and hop >= self.max_hop:
                    compute_link = False

                if compute_link:
                    logger.info("---------- START COMPUTE LINK --------")

                    node.pdf_extractor.compute_links()

                    logger.info("------------ FINISH COMPUTE LINK ----------")

                    counter = 0
                    for link in node.pdf_extractor.linked_contents:
                        if link is not None and len(link) > 0:
                            self.arxiv_link_queue.put((hop + 1, link))
                            counter += 1

                    logger.info(f"ADD {counter} PAPERS")

                logger.info(
                    f"--------------  FINISH EXTRACTOR WORKER: {paper_name}  ------------------"
                )

                try:
                    shutil.move(
                        paper_path,
                        os.path.join(persist_path, f"{hop}-hop_{paper_name}.pdf"),
                    )
                    shutil.rmtree(img_path)
                except OSError as e:
                    logger.info(f"Error: {e}")

            except Exception as e:
                logger.info(f"Error: {e}")
                os.remove(paper_path)

            self.paper_queue.task_done()

        logger.info("QUIT EXTRACTOR")

    def execute(self, paper_dir):
        self.paper_pool_dir = paper_dir
        os.makedirs(os.path.join(self.paper_pool_dir, self.output_dir), exist_ok=True)

        # paper directories
        filenames = []
        for entry in os.listdir(paper_dir):
            full_path = os.path.join(paper_dir, entry)
            if os.path.isfile(full_path) and not entry.startswith("."):
                logger.debug(entry, os.path.isdir(full_path))
                logger.debug(f"put {full_path}")
                self.paper_queue.put((0, full_path))

        # self.scholar_link_queue.put(
        #     (
        #         1,
        #         "arXiv preprint arXiv:1911.07532, 2019 [58] K Munivara Prasad. 2014. DoS and DDoS attacks: defense, detection and traceback mechanisms-a survey. Global Journal of Computer Science and Technology 14, E7 (2014), 15–32.",
        #     )
        # )

        with concurrent.futures.ThreadPoolExecutor(
            max_workers=self.extract_concurrency
        ) as extract_executor, concurrent.futures.ThreadPoolExecutor(
            max_workers=self.arxiv_download_concurrency
        ) as arxiv_download_executor, concurrent.futures.ThreadPoolExecutor(
            max_workers=self.scholar_download_concurrency
        ) as scholar_download_executor:

            for _ in range(self.extract_concurrency):
                extract_executor.submit(self.extractor_worker)

            for _ in range(self.arxiv_download_concurrency):
                arxiv_download_executor.submit(self.arxiv_download_worker)

            for _ in range(self.scholar_download_concurrency):
                scholar_download_executor.submit(self.scholar_download_worker)

            while (
                self.paper_queue._queue.unfinished_tasks > 0
                or self.arxiv_link_queue._queue.unfinished_tasks > 0
                or self.scholar_link_queue._queue.unfinished_tasks > 0
            ):
                self.paper_queue.join()
                self.arxiv_link_queue.join()
                self.scholar_link_queue.join()

            self.stop_all_threads()

    def stop_all_threads(self):
        for _ in range(self.extract_concurrency):
            self.paper_queue.put((None, None))

        for _ in range(self.arxiv_download_concurrency):
            self.arxiv_link_queue.put((None, None))

        for _ in range(self.scholar_download_concurrency):
            self.scholar_link_queue.put((None, None))

    def execute_with_arxiv(self, arxiv_links):
        for link in arxiv_links:
            self.arxiv_link_queue.put((1, link))

        with concurrent.futures.ThreadPoolExecutor(
            max_workers=self.extract_concurrency
        ) as extract_executor, concurrent.futures.ThreadPoolExecutor(
            max_workers=self.arxiv_download_concurrency
        ) as arxiv_download_executor, concurrent.futures.ThreadPoolExecutor(
            max_workers=self.scholar_download_concurrency
        ) as scholar_download_executor:

            for _ in range(self.extract_concurrency):
                extract_executor.submit(self.extractor_worker)

            for _ in range(self.arxiv_download_concurrency):
                arxiv_download_executor.submit(self.arxiv_download_worker)

            for _ in range(self.scholar_download_concurrency):
                scholar_download_executor.submit(self.scholar_download_worker)

            while (
                self.paper_queue._queue.unfinished_tasks > 0
                or self.arxiv_link_queue._queue.unfinished_tasks > 0
                or self.scholar_link_queue._queue.unfinished_tasks > 0
            ):
                self.paper_queue.join()
                self.arxiv_link_queue.join()
                self.scholar_link_queue.join()

            self.stop_all_threads()


if __name__ == "__main__":
    llm_model = ChatOllama(
        model="llama3",
        temperature=0,
        base_url="http://localhost:11434",
        stop=["<|eot_id|>"],
    )

    embeddings_model = DefaultEmbedding()

    paper_expansion = PaperExpansion(
        llm_model=llm_model,
        embedding_model=embeddings_model,
        extract_concurrency=2,
        arxiv_download_concurrency=8,
        scholar_download_concurrency=2,
        max_paper_num=5,
        max_hop=-1,
    )

    paper_expansion.execute("expand")
