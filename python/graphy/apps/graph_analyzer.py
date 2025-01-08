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
    TEMPLATE_RELATED_WORK_INTRO_GENERATOR,
    TEMPLATE_RELATED_WORK_TEXT_PROMPT,
    TEMPLATE_TEXT_EXAMPLE_PROMPT,
    TEMPLATE_SUBSECTION_INSTRUCTION_PROMPT,
    TEMPLATE_PREVIOUS_SUBSECITON_PROMPT,
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

        bib_text = self.append_bib_text(result, {})
        result += bib_text

        return result

    def generate_section_texts(self, query, mind_map, max_token_per_subsection):
        section_prompts = []

        subsection_id = 0
        for category in mind_map.get("data", []):
            subsection_id += 1
            prop_slot = str(category)

            generated_instruction = ""
            if subsection_id == 1:
                generated_instruction += TEMPLATE_TEXT_EXAMPLE_PROMPT

            generated_instruction += TEMPLATE_SUBSECTION_INSTRUCTION_PROMPT.format(
                subsection_id=str(subsection_id),
                max_token_per_subsection=str(max_token_per_subsection),
            )

            if subsection_id > 1:
                generated_instruction += TEMPLATE_PREVIOUS_SUBSECITON_PROMPT

            paper_memories = TEMPLATE_RELATED_WORK_TEXT_PROMPT.format(
                user_query=query,
                prop_slot=prop_slot,
                generate_instruction=generated_instruction,
            )

            section_prompts.append(paper_memories)

        return section_prompts

    def write_report_sec_by_sec(
        self, query, mind_map, max_token_per_subsection, bib2id={}
    ):
        prop_slot = ""
        for category in mind_map.get("data", []):
            if len(prop_slot) > 0:
                prop_slot += ","
            name = category.get("name", "")
            description = category.get("description", "")
            prop_slot += json.dumps({"name": name, "description": description})

        intro_prompt = TEMPLATE_RELATED_WORK_INTRO_GENERATOR.format(prop_slot=prop_slot)
        intro_text = self.generate("get_report_intro", intro_prompt)

        # print("########## INTRO PROMPT ###############")
        # print(intro_prompt)

        section_prompts = self.generate_section_texts(
            query=query,
            mind_map=mind_map,
            max_token_per_subsection=max_token_per_subsection,
        )

        # for sec in section_prompts:
        #     print("########## SECTION PROMPT ###############")
        #     print(sec)

        section_text = ""
        for i in range(len(section_prompts)):
            text_prompt = section_prompts[i]
            if "<PREVIOUS></PREVIOUS>" in text_prompt:
                text_prompt = text_prompt.replace("<PREVIOUS></PREVIOUS>", section_text)
            new_section_text = self.generate("query_report_text", text_prompt)
            section_text += "\n" + new_section_text + "\n"

        final_section = intro_text + "\n" + section_text
        bib_text = self.append_bib_text(final_section, bib2id)

        final_section += bib_text

        return final_section

    def append_bib_text(self, text, id2bib):
        bib_text = ""
        cited_papers = set()
        matches = re.findall(r"\\cite{(.*?)}", text)

        for match in matches:
            if "," in match:
                match_texts = match.split(",")
                for match_text in match_texts:
                    cited_papers.add(match_text.strip())
            else:
                cited_papers.add(match.strip())

        logger.debug(f"CITED PAPERS ARE {cited_papers}")

        for paper_id in cited_papers:
            if paper_id in id2bib and id2bib[paper_id]:
                bib_text += "\n" + id2bib[paper_id] + "\n"
            else:
                bib_text += "\n" + f"bib of {paper_id}" + "\n"

        return bib_text
