from typing import List, Dict, Optional

from langchain_core.language_models import BaseLLM
from langchain_core.embeddings import Embeddings

import re
import logging
import tiktoken
import gc


logger = logging.getLogger(__name__)


def clean_text(text: str) -> str:
    """
    Clean the text by removing unnecessary characters and normalizing whitespace.
    """
    # Remove any special characters except basic punctuation
    text = re.sub(r"[^a-zA-Z0-9.,;:!?'\"]+", " ", text)

    # Normalize multiple spaces to a single space
    text = re.sub(r"\s+", " ", text)

    # Strip leading and trailing whitespace
    return text.strip()


class IncrementalIDGenerator:
    current_id = 0

    @staticmethod
    def get_next_id():
        IncrementalIDGenerator.current_id += 1
        return IncrementalIDGenerator.current_id


class MemoryBlock:
    """Base class for all types of memory blocks used in LLM applications."""

    def __init__(self, llm: BaseLLM) -> None:
        self.llm = llm
        self.token_num = -1
        self.str_exp = ""
        self.is_empty = True
        self.role = "user"
        self.block_id = self.generate_block_id()

    @staticmethod
    def generate_block_id():
        return f"BLOCK_{IncrementalIDGenerator.get_next_id()}"

    def _formulate_str_expression(self, content: str):
        raise NotImplementedError("This method should be overridden by subclasses")

    # def _compute_token_num(self):
    #     raise NotImplementedError("This method should be overridden by subclasses")

    def get_token_num(self):
        return self.token_num

    def _compute_token_num(self, text: str):
        if self.is_empty:
            return 0

        token_num = -1

        try:
            token_num = self.llm.get_num_tokens(text)
        except Exception as e:
            logger.debug(f"Error compute tokens: {e}")
            encoding = tiktoken.get_encoding("cl100k_base")
            token_num = len(encoding.encode(text))
        # print("===== TOKEN NUM =====")
        # print(text, token_num)
        # print(
        #     [
        #         encoding.decode_single_token_bytes(token)
        #         for token in encoding.encode(text)
        #     ]
        # )

        return token_num

    def get_str_exp(self):
        return self.str_exp

    def get_block_id(self):
        return self.block_id

    def empty(self):
        return self.is_empty

    def __str__(self):
        raise NotImplementedError("This method should be overridden by subclasses")


class TextMemoryBlock(MemoryBlock):
    def __init__(self, llm: BaseLLM, text: str) -> None:
        super().__init__(llm)
        self.str_exp = self._formulate_str_expression(text)
        self.token_num = self._compute_token_num(self.str_exp)
        self.block_id = f"TEXT_{hash(text)}"

    def _formulate_str_expression(self, content: str):
        return content

    def __str__(self):
        return f"BASIC MEMORY BLOCK: {self.str_exp}"


class CachedMemoryBlock(MemoryBlock):
    def __init__(
        self,
        llm: BaseLLM,
        query: str = "",
        response: str = "",
        used_memory: List[str] = [],
    ) -> None:
        super().__init__(llm)
        self.query = query
        self.used_memory = used_memory
        self.is_empty = False
        self.str_exp = self._formulate_str_expression(response)
        self.block_id = f"CACHED_{hash(self.str_exp)}"
        self.token_num = self._compute_token_num(self.str_exp)

    def _formulate_str_expression(self, content: str):
        parts = []
        if self.query:
            parts.append(f"QUERY: {self.query}")
        if content:
            parts.append(f"RESPONSE: {content}")
        return "\n".join(parts)

    def __str__(self):
        return (
            f"CACHED MEMORY BLOCK: {self.str_exp}\n"
            f"used_memory: {';'.join([str(block_id) for block_id in self.used_memory])}"
        )


class RetrievedMemoryBlock(MemoryBlock):
    def __init__(self, llm: BaseLLM, content: str, compute_token_num=True) -> None:
        super().__init__(llm)
        self.is_empty = False
        if compute_token_num:
            self.str_exp = self._formulate_str_expression(content)
            self.token_num = self._compute_token_num(self.str_exp)

    def _formulate_str_expression(self, content: str):
        return f"retrieved_memory: {clean_text(content)}"

    def get_block_id(self):
        return super().get_block_id()

    def __str__(self):
        return f"RETRIEVED MEMORY BLOCK: {self.str_exp}"


class PaperReadingRetrievedMemoryBlock(RetrievedMemoryBlock):
    def __init__(
        self,
        llm: BaseLLM,
        collection_name: str,
        content: str,
        metadata: str,
    ) -> None:
        super().__init__(llm, content, False)

        page_no = metadata.get("page_index", -1)
        part_no = metadata.get("part_index", -1)
        section_id = metadata.get("section", content)
        self.image = metadata.get("image_paths", "")
        self.citation = metadata.get("link_info", "")
        self.block_id = f"RETRIEVED_{collection_name}_{page_no}_{section_id}_{part_no}"
        self.paper_len = metadata.get("paper_len", -1)

        self.pos_str = ""
        if section_id:
            self.pos_str = f"SECTION_{section_id}"
        else:
            self.pos_str = f"POS_{page_no / self.paper_len}"

        self.is_empty = False
        self.str_exp = self._formulate_str_expression(content)
        self.token_num = self._compute_token_num(self.str_exp)

        self.cited_str_exp = self._formulate_cited_str_expression(content)
        self.cited_token_num = self._compute_token_num(self.cited_str_exp)

    def _formulate_str_expression(self, content: str):
        return f"**{self.pos_str}**: {clean_text(content)}"

    def get_cited_str_exp(self):
        return self.cited_str_exp

    def get_cited_token_num(self):
        return self.cited_token_num

    def _formulate_cited_str_expression(self, content: str):
        return (
            f"**{self.pos_str}**: {clean_text(content)}\n**CITATION**: {self.citation}"
        )

    def __str__(self):
        return f"RETRIEVED MEMORY BLOCK: {self.str_exp}, image: {self.image}"


class MemoryBlockManager:
    """Manages different types of memory blocks."""

    def __init__(self) -> None:
        self.blocks: Dict[str, MemoryBlock] = {}

    def add_block(self, block: MemoryBlock):
        block_id = block.get_block_id()
        if block_id in self.blocks:
            logger.warning(f"Block with id {block_id} already exists in the manager.")
        else:
            self.blocks[block_id] = block
        return block_id

    def get_block(self, block_id: str) -> Optional[MemoryBlock]:
        return self.blocks.get(block_id, None)

    def remove_block(self, block_id: str):
        return self.blocks.pop(block_id)

    def clear(self):
        self.blocks.clear()

        gc.collect()
