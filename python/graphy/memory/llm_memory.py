from typing import Dict, Any, List, Tuple
from enum import Enum, auto
from langchain.llms import BaseLLM
from langchain_core.embeddings import Embeddings
from pympler import asizeof
import sys
import time

import gc
import os

import chromadb
import psutil
from chromadb.types import SegmentScope
from chromadb.segment import VectorReader

import heapq
import logging

logger = logging.getLogger(__name__)

from memory.memory_block import (
    TextMemoryBlock,
    MemoryBlockManager,
    RetrievedMemoryBlock,
    PaperReadingRetrievedMemoryBlock,
    MemoryBlock,
)
from memory.search_unit import SearchUnitExecutor
from config import WF_VECTDB_DIR

import chromadb
import math
import threading
import multiprocessing as mp

from chromadb import Documents, EmbeddingFunction, Embeddings
from chromadb.utils import embedding_functions


class VectorDBHierarchy(Enum):
    """
    Enumeration of the layer names of vectordb.
    """

    FirstLayer = auto()
    SecondLayer = auto()


class RetrievedMemory:
    """
    Abstract Class representing the memory in vectordb.
    """

    def __init__(
        self,
        collection_name: str,
        llm: BaseLLM,
        embeddings: Embeddings,
        block_manager: MemoryBlockManager,
        max_result_num: int = 10,
        chunk_size=500,
        chunk_overlap=0,
        vectordb=None,
    ):
        self.collection_name = collection_name
        self.embeddings = embeddings
        self.block_manager = block_manager
        self.max_result_num = max_result_num
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.persist_directory = vectordb
        self.embedding_function = embedding_functions.DefaultEmbeddingFunction()

        self.llm = llm

        if vectordb:
            self.persistent_client = vectordb
            self.collection = self.persistent_client.get_or_create_collection(
                name=self.collection_name, embedding_function=self.embedding_function
            )
        else:
            self.persistent_client = None
            self.collection = None

        # self.persistent_client.delete_collection(name=self.collection_name)

        # self.collection = self.persistent_client.get_or_create_collection(
        #     name=self.collection_name,
        #     # embedding_function=self.embeddings,
        # )

        self.init_thread_num = 10

    def is_db_valid(self):
        return self.persistent_client is not None

    def is_db_empty(self):
        # Check if the collection is empty
        documents = self.collection.get()
        return len(documents["ids"]) == 0

    def init_memory_parallel(self, docs: List[dict], ids_format: list):
        total_size = len(docs)
        chunk_size = total_size // self.init_thread_num
        threads = []

        for i in range(self.init_thread_num):
            start = i * chunk_size
            if i == self.init_thread_num - 1:
                end = total_size
            else:
                end = start + chunk_size

            thread = threading.Thread(
                target=self.init_memory, args=(docs[start:end], ids_format)
            )
            threads.append(thread)

        for thread in threads:
            thread.start()

        for thread in threads:
            thread.join()

        """
        su_exec = SearchUnitExecutor(
            {
                "conditions": {
                    "sec_name": {
                        "$in": {
                            "conditions": {"type": VectorDBHierarchy.FirstLayer.value},
                            "return": "documents",
                            "subquery": "background",
                            "result_num": 2,
                        }
                    }
                },
                "result_num": -1,
            },
            self.collection,
        )
        """
        """
        su_exec = SearchUnitExecutor(
            {
                "conditions": {
                    "sec_name": {
                        "conditions": {"type": VectorDBHierarchy.FirstLayer.value},
                        "return": "documents",
                        "subquery": "background",
                        "result_num": 2,
                    }
                },
                "result_num": 5,
            },
            self.collection,
        )
        """
        """
        su_exec = SearchUnitExecutor(
            None,
            self.collection,
        )
        """
        """
        su_exec = SearchUnitExecutor(
            {"result_num": 2},
            self.collection,
        )
        """
        """
        su_exec = SearchUnitExecutor(
            {
                "conditions": {
                    "$or": [
                        {
                            "sec_name": {
                                "$in": {
                                    "conditions": {
                                        "type": VectorDBHierarchy.FirstLayer.value
                                    },
                                    "return": "documents",
                                    "subquery": "background",
                                    "result_num": 2,
                                }
                            }
                        },
                        {
                            "sec_name": {
                                "$in": {
                                    "conditions": {
                                        "type": VectorDBHierarchy.FirstLayer.value
                                    },
                                    "return": "documents",
                                    "subquery": "method",
                                    "result_num": 2,
                                }
                            }
                        },
                    ]
                },
                "result_num": 20,
            },
            self.collection,
        )
        """

        # su_exec = SearchUnitExecutor(
        #     {
        #         "conditions": {
        #             "sec_name": {
        #                 "$in": {
        #                     "conditions": {"type": VectorDBHierarchy.FirstLayer.value},
        #                     "return": "documents",
        #                     "subquery": "background",
        #                     "result_num": 2,
        #                     # "doc_conditions": {"$contains": "evaluatio"},
        #                 }
        #             }
        #         },
        #         # "doc_conditions": {
        #         #    "$and": [
        #         #        {"$contains": "dataset"},
        #         #        {"$contains": "select"},
        #         #    ]
        #         # },
        #         "return": "all",
        #         "result_num": 5,
        #         "subquery": "{slot}",
        #     },
        #     self.collection,
        # )

        # print("###################### CONDITION OUTPUT ##########################")
        # print(su_exec.search("what is the challenges"))

    def init_memory(self, docs: List[dict], ids_format: list):
        documents = []
        metadatas = []
        embeddings = []
        ids = []

        for doc in docs:
            content = doc["page_content"]
            metadata = doc["metadata"]
            try:
                embed = self.embedding_function([content])[0]
            except:
                logger.error(f"Embed error: the content is {content}.")
            # print(embed)
            # print(metadata)

            if "type" in metadata:
                if metadata["type"] == VectorDBHierarchy.FirstLayer.value:
                    doc_id = f"{self.collection_name}_{content}"
                elif metadata["type"] == VectorDBHierarchy.SecondLayer.value:
                    doc_id = self.collection_name + "_" + metadata["id"]
                    # for id_item in ids_format:
                    # doc_id = doc_id + "_" + str(id_item) + str(metadata[id_item])
                else:
                    continue
            else:
                continue

            documents.append(content)
            embeddings.append(embed)
            metadatas.append(metadata)
            ids.append(doc_id)

        if len(ids) > 0:
            self.collection.add(
                documents=documents,
                embeddings=embeddings,
                metadatas=metadatas,
                ids=ids,
            )

    # query is a list of strings
    def search(self, query: str, where, results_num=-1) -> list:
        if results_num == -1:
            results_num = self.max_result_num

        # for queries without 'result_num' specified or set 'result_num = -1', find [results_num] results
        su_exec = SearchUnitExecutor(where, self.collection, results_num)
        return su_exec.search(query)

        # if where is None:
        #     return self.direct_search(query=query, results_num=results_num)
        # elif where["type"] == "direct":
        #     if "condition" not in where:
        #         raise "Where Condition Undefined"
        #     return self.direct_search(
        #         query=query, where=where["condition"], results_num=results_num
        #     )
        # elif where["type"] == "hierarchical":
        #     return self.hierarchical_search(query, where, results_num)
        # else:
        #     raise "Undefined Search Mode " + str(where["type"])

    def direct_search(self, query: str, where: dict = None, results_num=-1) -> list:
        if where is None:
            return self.collection.query(
                query_texts=[query],
                n_results=results_num,
                where={"type": VectorDBHierarchy.SecondLayer.value},
            )
        else:
            return self.collection.query(
                query_texts=[query], n_results=results_num, where=where
            )

    def hierarchical_search(self, query, where, results_num=-1) -> list:
        output = self.direct_search(
            query=where["target"],
            where={"type": VectorDBHierarchy.FirstLayer.value},
            results_num=where["scopesize"],
        )

        documents = output["documents"][0]
        distances = output["distances"][0]

        # TODO: if distances is too large, should use direct search

        in_list = []
        for page_content in documents:
            in_list.append(page_content)

        where_condition = dict()
        where_condition["section_name"] = {"$in": in_list}

        # if in_list is not empty
        if in_list:
            return self.collection.query(
                query_texts=query, n_results=results_num, where=where_condition
            )
        else:
            return self.direct_search(query=query, where=None, results_num=results_num)

    def get_memory_info(
        self, query: str, where, max_token_num, distance_thresh=None
    ) -> List[str]:
        chunk_num_est = math.floor(max_token_num / self.chunk_size)
        output = self.search(query, where, chunk_num_est)

        # print("========= GET MEMORY OUTPUT =========")
        # print(output)

        # Accessing the first (and likely only) list of documents
        documents = output["documents"][0]
        distances = output["distances"][0]
        metadatas = output["metadatas"][0]  # Similarly accessing metadata

        # cut off docs that are too far from similar
        if distance_thresh:
            number_of_docs = 0
            for dist in distances:
                if dist > distance_thresh:
                    break
                number_of_docs += 1
            documents = documents[: max(10, number_of_docs)]
            metadatas = metadatas[: max(10, number_of_docs)]

        return documents, metadatas, distances
        # return self.formulate_memory_block(documents, metadatas)

    def close(self):
        def bytes_to_gb(bytes_value):
            return bytes_value / (1024**3)

        def get_process_info():
            pid = os.getpid()
            p = psutil.Process(pid)
            with p.oneshot():
                mem_info = p.memory_info()
                # disk_io = p.io_counters()
            return {
                "memory_usage": bytes_to_gb(mem_info.rss),
            }

        logger.debug(f"========== BEFORE UNLOAD {get_process_info()} =========")
        print(
            f"info: {self.persistent_client} {self.collection_name} {self.collection} {self.collection.id}"
        )

        """
        Unloads binary hnsw index from memory and removes both segments (binary and metadata) from the segment cache.
        """

        if self.persistent_client and self.collection:
            segment = self.persistent_client._server._manager.get_segment(
                self.collection.id, VectorReader
            )
            segment.close_persistent_index()

            collection_id = self.collection.id
            segment_manager = self.persistent_client._server._manager

            for scope in [SegmentScope.VECTOR, SegmentScope.METADATA]:
                if scope in segment_manager.segment_cache:
                    cache = segment_manager.segment_cache[scope].cache
                    if collection_id in cache:
                        segment_manager.callback_cache_evict(cache[collection_id])

            self.persistent_client.delete_collection(name=self.collection_name)
            gc.collect()

        print(f"========== AFTER UNLOAD {get_process_info()} =========")
        logger.debug(f"========== AFTER UNLOAD {get_process_info()} =========")


class BaseRuntimeMemoryManager:
    """
    A class to manage the in-context memory for an LLM (Language Learning Model) during the working process.
    It stores and manages the context based on token limits.
    """

    def __init__(
        self, llm: BaseLLM, embeddings: Embeddings, max_token_limit: int = 8192
    ):
        self.llm = llm
        self.embeddings = embeddings
        self.block_manager = MemoryBlockManager()
        self.memory_blocks: List[Tuple[float, str]] = []  # (distance, block_id)
        self.max_token_limit = max_token_limit
        self.memory_length = 0
        self.config = {}

    def update_config(self, config):
        pass

    def get_memory_blocks(self) -> List[Tuple[float, str]]:
        return self.memory_blocks

    def get_memory_str(self) -> str:
        output = ""
        for _, block_id in self.memory_blocks:
            output += self.block_manager.get_block(block_id).get_str_exp()
            output += "\n"
        return output

    def get_block_str(self, block_id: str) -> str:
        block = self.block_manager.get_block(block_id)
        if block:
            return block.get_str_exp()
        else:
            return ""

    def clear_memory(self):
        self.memory_blocks = []
        self.memory_length = 0

    def get_incremental_memory(self) -> list:
        incremental_memory = self.memory_blocks[self.memory_length :]
        self.memory_length = len(self.memory_blocks)
        return incremental_memory

    def add_memory_block(self, block: MemoryBlock | str, distance: float = None):
        if isinstance(block, str):  # block is block_id
            block_id = block
        else:
            block_id = block.get_block_id()
            self.block_manager.add_block(block)

        if block_id not in [block_id for _, block_id in self.memory_blocks]:
            heapq.heappush(
                self.memory_blocks,
                (-distance if distance is not None else -1.0, block_id),
            )

        self.ensure_token_limit()

    def add_memory_str(self, text: str, distance: float = None):
        mb = TextMemoryBlock(self.llm, text)
        self.add_memory_block(mb, distance=distance)

    def get_memory_token_num(self):
        return sum(
            self.block_manager.get_block(block_id).get_token_num()
            for _, block_id in self.memory_blocks
        )

    def ensure_token_limit(self):
        """
        Ensures the token limit is not exceeded. If the limit is exceeded, removes the entry with the largest distance.
        """
        curr_buffer_length = self.get_memory_token_num()

        while curr_buffer_length > self.max_token_limit:
            _, block_id = heapq.heappop(
                self.memory_blocks
            )  # Pop the block with the largest distance
            logger.info(f"Removing block: {block_id} to save space")
            mb = self.block_manager.get_block(block_id)
            curr_buffer_length -= mb.get_token_num()

    def remove_memory_entries(self, num_entries: int):
        if num_entries > len(self.memory_blocks):
            num_entries = len(self.memory_blocks)
        self.memory_blocks = self.memory_blocks[num_entries:]
        self.memory_length = max(0, self.memory_length - num_entries)


class PaperReadingMemoryManager(BaseRuntimeMemoryManager):
    """
    A manager whose memory can come from vectordb for the task of paper reading.
    """

    def __init__(
        self,
        llm: BaseLLM,
        embeddings: Embeddings,
        collection_name: str,
        max_token_limit: int = 8192,
        vectordb=None,
    ):
        super().__init__(llm, embeddings, max_token_limit)

        self.retrieved_memory = RetrievedMemory(
            collection_name, llm, embeddings, self.block_manager, vectordb=vectordb
        )

        self.collection_name = collection_name

    def update_config(self, config):
        self.config = {}
        if config is not None:
            self.config["add_citation"] = config.get("add_citation", False)

    def is_add_citation(self):
        return self.config.get("add_citation", False)

    def retrieve_memory_blocks(
        self, query: str, where_document, max_token_num: int, distance_thresh=None
    ):
        """
        Get the vectordb memory based on the condition.

        Attributes:
            query (str): The query for the search.
            where_document: The location condition in the document to search
            max_token_num (int): The maximum number of tokens to be retrieved.
            distance_thresh (float): The threshold for the distance of the retrieved memory.
        """
        documents, metadatas, distances = self.retrieved_memory.get_memory_info(
            query, where_document, max_token_num, distance_thresh
        )

        try:
            blocks = self.formulate_memory_block(documents, metadatas)
        except Exception as e:
            blocks = []
            logger.debug(f"Error when adding memory blocks: {e}")

        for block, distance in zip(blocks, distances):
            self.add_memory_block(block, distance)

    def formulate_memory_block(self, documents, metadatas) -> List[str]:
        memory_blocks = []

        for page_content, metadata in zip(documents, metadatas):
            block = PaperReadingRetrievedMemoryBlock(
                self.llm, self.collection_name, page_content, metadata
            )
            self.block_manager.add_block(block)
            memory_blocks.append(block.get_block_id())

        return memory_blocks

    def get_memory_str(self) -> str:
        output = ""
        n = len(self.memory_blocks)
        for _, block_id in heapq.nlargest(n, self.memory_blocks):
            block = self.block_manager.get_block(block_id)
            if self.is_add_citation() and isinstance(
                block, PaperReadingRetrievedMemoryBlock
            ):
                output += block.get_cited_str_exp()
            else:
                output += block.get_str_exp()
            output += "\n"
        return output

    def get_memory_token_num(self):
        token_num = 0
        for _, block_id in self.memory_blocks:
            block = self.block_manager.get_block(block_id)
            if self.is_add_citation() and isinstance(
                block, PaperReadingRetrievedMemoryBlock
            ):
                token_num += block.get_cited_token_num()
            else:
                token_num += block.get_token_num()

        return token_num

    def ensure_token_limit(self):
        """
        Ensures the token limit is not exceeded. If the limit is exceeded, removes the entry with the largest distance.
        """
        curr_buffer_length = self.get_memory_token_num()

        while curr_buffer_length > self.max_token_limit:
            _, block_id = heapq.heappop(
                self.memory_blocks
            )  # Pop the block with the largest distance
            logger.info(f"Removing block: {block_id} to save space")
            mb = self.block_manager.get_block(block_id)
            if self.is_add_citation() and isinstance(
                mb, PaperReadingRetrievedMemoryBlock
            ):
                curr_buffer_length -= mb.get_cited_token_num()
            else:
                curr_buffer_length -= mb.get_token_num()

    def close(self):
        logger.debug(
            f"=============== START TO UNLOAD COLLECTION OF {self.collection_name} ==============="
        )
        self.retrieved_memory.close()

        logger.debug(
            f"=============== FINISH TO UNLOAD COLLECTION OF {self.collection_name} ==============="
        )
