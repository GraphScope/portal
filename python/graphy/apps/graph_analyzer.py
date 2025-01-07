import sys
import os

from apps.paper_reading.paper_reading_nodes import MindMapFormat
from langchain_openai import ChatOpenAI
from graph.nodes.chain_node import BaseChainNode


from typing import List
import json
import logging
import copy
import re
import traceback

from prompts.graph_analyze_prompts import (
    TEMPLATE_QUERY_GENERATOR,
    TEMPLATE_MIND_MAP_GENERATOR,
    TEMPLATE_RELATED_WORK_GENERATOR,
)

logger = logging.getLogger()


class LLMGraphAnalyzer:
    def __init__(self, llm_model):
        self.llm_model = llm_model

    def generate(self, name, query, json_format=None):
        generated_results = ""
        executor = BaseChainNode(
            name,
            self.llm_model,
            self.llm_model,
            json_format,
            max_token_size=20000,
            enable_streaming=True,
        )

        if json_format is None:
            for result in executor.run("", query):
                generated_results += result.content  # string
        else:
            for result in executor.run("", query):
                generated_results = result  # dictionary

        return generated_results

    def generate_prop_slot(self, prefix, info):
        try:
            output_str = ""
            for key, value in info["properties"].items():
                output_str += f"[{str(key).capitalize()}]: {str(value)}\n"
        except Exception as e:
            logger.debug(f"{e}")

        return output_str

    def get_fetch_query(self, query, schema, lang="cypher"):
        fetch_prompt = TEMPLATE_QUERY_GENERATOR.format(
            user_query=query, schema=schema, language=lang
        )

        queries = self.generate("fetch_query", fetch_prompt)
        return queries

    def get_mind_map(self, query, data):
        paper_slot = ""
        for k, v in data.items():
            paper_slot += self.generate_prop_slot(prefix="", info=v)

        mind_map_prompt = TEMPLATE_MIND_MAP_GENERATOR.format(
            user_query=query, paper_slot=paper_slot
        )

        result = self.generate(
            "get_mind_map", mind_map_prompt, json_format=MindMapFormat
        )

        return result

    def write_report(self, query, mind_map, max_token_per_subsection):
        report_prompt = TEMPLATE_RELATED_WORK_GENERATOR.format(
            user_query=str(query),
            mind_map=str(mind_map),
            max_token_per_subsection=str(max_token_per_subsection),
        )

        result = self.generate("get_report", report_prompt)
        return result
