import sys
import os

from langchain_openai import ChatOpenAI
from graph.nodes.chain_node import BaseChainNode
from graph.nodes.paper_reading_nodes import NameDesc
from typing import List
import json
import logging
import copy
import re

from config import (
    WF_UPLOADS_DIR,
    WF_OUTPUT_DIR,
    WF_DATA_DIR,
)

from prompts.related_work_prompts import (
    RELATED_WORK_INTRODUCTION_PROMPT,
    RELATED_WORK_TEXT_PROMPT,
    TEXT_EXAMPLE_PROMPT,
    SUBSECTION_INSTRUCTION_PROMPT,
    PREVIOUS_SUBSECITON_PROMPT,
    BASELINE_RELATED_WORK_TEXT_PROMPT,
    SUMMARIZE_PROMPT,
)


sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
logger = logging.getLogger(__name__)


class TextGenerator:
    def __init__(self, llm_model):
        self.llm_model = llm_model

    def get_prompt(self):
        pass

    def execute(self):
        pass


class ReportGenerator(TextGenerator):
    def __init__(self, llm_model):
        super().__init__(llm_model)

        self.group_by_prop = None
        self.paper_info = {}
        self.category_info = {}
        self.categorized_papers = {}

        self.baseline_prompt = ""
        self.section_intro_prompt = ""
        self.section_text_prompts = []

        self.few_count = 1
        self.summarize_other_items = True

        self.has_compute_prompt = False
        self.has_compute_prompt_baseline = False

    def prepare_data_baseline(self, input_data):
        if self.llm_model_is_none():
            self.set_llm_model(self.llm_model)

        info = input_data["data"]
        group_by_prop = input_data["groupby"]
        max_token_per_subsection = input_data.get("max_token_per_subsection", 50)

        self.group_by_prop = group_by_prop.lower()
        self.compute_prompt_baseline(max_token_per_subsection)

    def prepare_data(self, input_data):
        if self.llm_model_is_none():
            self.set_llm_model(self.llm_model)

        info = input_data["data"]
        group_by_prop = input_data["groupby"]
        max_token_per_subsection = input_data.get("max_token_per_subsection", 50)
        turn_on_summarize = input_data.get("summarize", True)
        paper_attr = input_data.get("paper_attr", [])
        prop_attr = input_data.get("prop_attr", [])
        if turn_on_summarize:
            self.turn_on_summarize()
        else:
            self.turn_off_summarize()

        self.group_by_prop = group_by_prop.lower()
        self.paper_attr = paper_attr
        self.prop_attr = prop_attr

        self.prepare(group_by_prop, info)
        self.compute_prompt(max_token_per_subsection)

    def set_llm_model(self, llm_model):
        self.llm_model = llm_model
        if self.llm_model == None:
            logger.warning("LLM Model is `None`, set to default")

            self.llm_model = ChatOpenAI(
                model="qwen-plus",
                temperature=0.8,
                base_url="https://dashscope.aliyuncs.com/compatible-mode/v1",
                api_key=os.environ["DASHSCOPE_API_KEY"],  ### DO NOT commit
                # stop=["<|eot_id|>"],
                streaming=True,
            )

    def turn_on_summarize(self):
        self.summarize_other_items = True

    def turn_off_summarize(self):
        self.summarize_other_items = False

    def llm_model_is_none(self):
        return self.llm_model is None

    def parse_info(self, info):
        category_info = {}
        categorized_papers = {}
        paper_info = {}

        try:
            if "nodes" in info:
                for node in info["nodes"]:
                    if node["label"].lower() == self.group_by_prop:
                        category_info[node["id"]] = node
                    else:
                        paper_info[node["id"]] = node

            if "edges" in info:
                for edge in info["edges"]:
                    if edge["source"] in paper_info and edge["target"] in category_info:
                        paper_id = edge["source"]
                        category_id = edge["target"]
                        if category_id not in categorized_papers:
                            categorized_papers[category_id] = [paper_id]
                        else:
                            categorized_papers[category_id].append(paper_id)

            new_categorized_papers = {}
            for category_id in categorized_papers:
                if len(categorized_papers[category_id]) < self.few_count:
                    if "others" in new_categorized_papers:
                        new_categorized_papers["others"].extend(
                            categorized_papers[category_id]
                        )
                    else:
                        new_categorized_papers["others"] = categorized_papers[
                            category_id
                        ]

                    category_info.pop(category_id)
                else:
                    new_categorized_papers[category_id] = categorized_papers[
                        category_id
                    ]
        except Exception as e:
            print(f"Error: {e}")
            category_info = {}
            new_categorized_papers = {}
            paper_info = {}

        return paper_info, category_info, new_categorized_papers

    def generate_prop_slot(self, prefix, info, prop_list):
        try:
            output_str = ""
            for key, value in info["properties"].items():
                if len(prop_list) == 0 or str(key) in prop_list:
                    output_str += f"[{prefix.capitalize()} {str(key).capitalize()}]: {str(value)}\n"
        except Exception as e:
            logger.debug(f"{e}")

        return output_str

    def generate_section_intro(self):
        prop_slot = ""
        for k, v in self.category_info.items():
            prop_slot += (
                self.generate_prop_slot(self.group_by_prop, v, self.prop_attr) + "\n"
            )

        start_text = RELATED_WORK_INTRODUCTION_PROMPT.format(
            group_by_prop=str(self.group_by_prop), prop_slot=prop_slot
        )

        return start_text

    def generate_section_texts(self, max_token_per_subsection):
        section_prompts = []

        subsection_id = 0
        for category_id, paper_id_list in self.categorized_papers.items():
            subsection_id += 1

            prop_slot = (
                self.generate_prop_slot(
                    self.group_by_prop, self.category_info[category_id], self.prop_attr
                )
                + "\n"
            )

            print("========= to add paper slot =========")
            print(paper_id_list)
            print(self.paper_info)
            paper_slot = ""
            for paper_id in paper_id_list:
                paper_slot += (
                    self.generate_prop_slot(
                        "Paper", self.paper_info[paper_id], self.paper_attr
                    )
                    + "\n"
                )

            generated_instruction = ""
            if subsection_id == 1:
                generated_instruction += TEXT_EXAMPLE_PROMPT

            generated_instruction += SUBSECTION_INSTRUCTION_PROMPT.format(
                subsection_id=str(subsection_id),
                group_by_prop=self.group_by_prop,
                max_token_per_subsection=str(max_token_per_subsection),
            )

            if subsection_id > 1:
                generated_instruction += PREVIOUS_SUBSECITON_PROMPT.format(
                    group_by_prop=self.group_by_prop
                )

            paper_memories = RELATED_WORK_TEXT_PROMPT.format(
                group_by_prop=self.group_by_prop,
                prop_slot=prop_slot,
                paper_slot=paper_slot,
                generate_instruction=generated_instruction,
            )

            section_prompts.append(paper_memories)

        return section_prompts

    def generate_baseline_abstract(self, max_token_per_subsection):
        paper_slot = ""

        with open("apps/paper_meta_abstract.log", "r") as f:
            lines = f.readlines()
            paper_slot += "\n".join(lines)

        paper_memories = BASELINE_RELATED_WORK_TEXT_PROMPT.format(
            paper_slot=paper_slot,
            max_token_per_subsection=str(max_token_per_subsection),
            group_by_prop=self.group_by_prop,
        )

        return paper_memories

    def summarize_others(self):
        category_list = []
        for category_id, info in self.category_info.items():
            if category_id == "others":
                continue
            category_list.append(info["properties"]["name"])

        category_list_str = ",".join(category_list)

        paper_slot = ""

        for paper_id in self.categorized_papers["others"]:
            paper_slot += (
                self.generate_prop_slot(
                    paper_id, self.paper_info[paper_id], self.paper_attr
                )
                + "\n\n"
            )

        prompt = SUMMARIZE_PROMPT.format(
            group_by_prop=self.group_by_prop,
            category_list=category_list_str,
            paper_slot=paper_slot,
        )

        output = self.generate(prompt, NameDesc)

        self.category_info["others"] = {
            "id": "others",
            "label": self.group_by_prop.capitalize(),
            "properties": output,
        }

    def refine_subsection(self):
        # print("Before all keys processed.")
        # print(self.categorized_papers)
        new_categorized_papers = {}
        paper_appear_times = {}
        for paper_id in self.paper_info:
            paper_appear_times[paper_id] = 0

        while self.categorized_papers:
            min_key = min(
                self.categorized_papers, key=lambda k: len(self.categorized_papers[k])
            )
            min_values = self.categorized_papers[min_key]

            for paper_id in min_values:
                if paper_id in paper_appear_times:
                    paper_appear_times[paper_id] += 1
                else:
                    paper_appear_times[paper_id] = 1

            for key in list(self.categorized_papers.keys()):
                if (
                    key != min_key
                    and len(self.categorized_papers[key]) > self.few_count
                ):
                    new_list = []
                    drop_list = []
                    for paper_id in self.categorized_papers[key]:
                        if paper_id not in min_values:
                            new_list.append(paper_id)
                        else:
                            drop_list.append(paper_id)

                    drop_list = sorted(
                        drop_list, key=lambda id: paper_appear_times[id], reverse=True
                    )
                    # random.shuffle(drop_list)

                    while len(drop_list) > 0 and len(new_list) < self.few_count:
                        new_list.append(drop_list.pop())
                    self.categorized_papers[key] = new_list

            new_categorized_papers[min_key] = self.categorized_papers[min_key]

            del self.categorized_papers[min_key]

        self.categorized_papers = new_categorized_papers
        # print("All keys processed.")
        # print(self.categorized_papers)

    def append_bib_text(self, text):
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

        # print(f"CITED PAPERS ARE {cited_papers}")
        logger.debug(f"CITED PAPERS ARE {cited_papers}")

        for pid, details in self.paper_info.items():
            if (
                "properties" in details
                and details["properties"]["id"] in cited_papers
                and "bib" in details["properties"]
            ):
                if details["properties"]["bib"]:
                    bib_text += "\n" + details["properties"]["bib"] + "\n"
                else:
                    bib_text += "\n" + f"bib of {details['properties']['id']}" + "\n"

        return bib_text

    def prepare(self, group_by_prop, info):
        self.paper_info, self.category_info, self.categorized_papers = self.parse_info(
            info
        )

        if "others" in self.categorized_papers:
            if (
                len(self.categorized_papers["others"]) >= self.few_count
                and self.summarize_other_items
            ):
                self.summarize_others()
            else:
                self.categorized_papers.pop("others")

        self.refine_subsection()

    def compute_prompt(self, max_token_per_subsection):
        self.section_intro_prompt = self.generate_section_intro()
        self.section_text_prompts = self.generate_section_texts(
            max_token_per_subsection=max_token_per_subsection
        )

        # result_list = [self.section_intro_prompt]
        # result_list.append(self.section_text_prompts)
        # return result_list

    def compute_prompt_baseline(self, max_token_per_subsection):
        self.baseline_prompt = self.generate_baseline_abstract(max_token_per_subsection)
        # return [self.baseline_prompt]

    def get_prompt(self):
        result_list = [self.section_intro_prompt]
        result_list.append(self.section_text_prompts)
        return result_list

    def get_prompt_baseline(self):
        return [self.baseline_prompt]

    def set_prompt(self, prompt: List[str]):
        if len(prompt) == 0:
            return False
        else:
            self.section_intro_prompt = prompt[0]
            if len(prompt) > 1:
                self.section_text_prompts = prompt[1]
            else:
                self.section_text_prompts = []
            return True

    def set_prompt_baseline(self, prompt: List[str]):
        if len(prompt) == 0:
            return False
        else:
            self.baseline_prompt = prompt[0]
            return True

    def execute(self):
        section_intro = self.generate(self.section_intro_prompt)
        section_text = ""

        for i in range(len(self.section_text_prompts)):
            text_prompt = self.section_text_prompts[i]
            if "<PREVIOUS></PREVIOUS>" in text_prompt:
                text_prompt = text_prompt.replace("<PREVIOUS></PREVIOUS>", section_text)
            new_section_text = self.generate(text_prompt)
            section_text += "\n" + new_section_text + "\n"

        final_section = section_intro + "\n" + section_text
        bib_text = self.append_bib_text(final_section)

        return final_section, bib_text

    def execute_baseline(self):
        baseline_section = self.generate(self.baseline_prompt)
        return baseline_section

    def generate(self, query, json_format=None):
        generated_results = ""
        executor = BaseChainNode(
            "ReportGenerator",
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

    def execute_streaming(self):
        for result in self.generate_streaming(self.section_intro_prompt):
            yield result

        section_text = ""

        for i in range(len(self.section_text_prompts)):
            text_prompt = self.section_text_prompts[i]
            if "<PREVIOUS></PREVIOUS>" in text_prompt:
                text_prompt = text_prompt.replace("<PREVIOUS></PREVIOUS>", section_text)
            for result in self.generate_streaming(text_prompt):
                new_section_text = result
                yield result

            section_text += "\n" + new_section_text + "\n"

    def execute_baseline_streaming(self):
        for result in self.generate_streaming(self.baseline_prompt):
            yield result

    def generate_streaming(self, query):
        executor = BaseChainNode(
            "ReportGenerator",
            self.llm_model,
            self.llm_model,
            None,
            max_token_size=20000,
            enable_streaming=True,
        )

        for result in executor.run("", query):
            yield result.content

    def store_status(self, persist_store, folder):
        persist_store.save_state(folder, "paper_info", self.paper_info)
        persist_store.save_state(folder, "category_info", self.category_info)
        persist_store.save_state(folder, "categorized_papers", self.categorized_papers)

    def recall_status(self, persist_store, folder):
        self.paper_info = persist_store.get_state(folder, "paper_info")
        self.category_info = persist_store.get_state(folder, "category_info")
        self.categorized_papers = persist_store.get_state(folder, "categorized_papers")


def prepare_report(input_data, text_generator):
    try:
        # Extract the JSON payload
        required_fields = ["data", "groupby"]
        for field in required_fields:
            if field not in input_data:
                return "False"

        text_generator.prepare_data(input_data)

        baseline_prompt = input_data.get("baseline", False)

        if baseline_prompt:
            prompt = text_generator.get_prompt_baseline()
        else:
            prompt = text_generator.get_prompt()

        # Return success response
        return prompt

    except Exception as e:
        return e


def generate_report(input_data, text_generator):
    try:
        required_fields = ["data", "groupby"]
        for field in required_fields:
            if field not in input_data:
                return "False"

        has_identity = True
        identity = input_data.get("identity", "0")
        if "identity" not in input_data:
            has_identity = False
        text_generator.prepare_data(input_data)

        baseline_method = input_data.get("baseline", False)

        if baseline_method:
            cache_path = os.path.join(f"", identity)
            if has_identity and os.path.exists(cache_path):
                with open(cache_path, "r") as f:
                    result = "".join(f.readlines())
            else:
                result = text_generator.execute_baseline()
                with open(cache_path, "w") as f:
                    f.write(result)
        else:
            cache_path = os.path.join(f"", identity)
            if has_identity and os.path.exists(cache_path):
                with open(cache_path, "r") as f:
                    result = "".join(f.readlines())
            else:
                result = text_generator.execute()
                with open("prompt_output_test.log", "w") as fw:
                    fw.write(result)
                with open(cache_path, "w") as f:
                    f.write(result)

        return result

    except Exception as e:
        return e


if __name__ == "__main__":
    with open("graph.json", "r") as file:
        graph_data = json.load(file)

    input_data = {
        "data": graph_data,
        "groupby": "challenge",
        "baseline": False,
        # "identity": "0",
    }

    llm_model_dashscope = ChatOpenAI(
        model="qwen-plus",
        temperature=0.8,
        base_url="https://dashscope.aliyuncs.com/compatible-mode/v1",
        api_key=os.environ["DASHSCOPE_API_KEY"],  ### DO NOT commit
        # stop=["<|eot_id|>"],
        streaming=True,
    )

    text_generator = ReportGenerator(llm_model_dashscope)

    print("========== GENERATE REPORT ===========")
    print(generate_report(input_data, text_generator))
    print("========== PREPARE REPORT ===========")
    print(prepare_report(input_data, text_generator))
    print("========== OVER ===========")

    required_fields = ["data", "groupby"]
    info = input_data["data"]
    group_by_prop = input_data["groupby"]

    max_token_per_subsection = input_data.get("max_token_per_subsection", 200)

    text_generator.prepare(group_by_prop, info)

    text_generator.compute_prompt(max_token_per_subsection)
    result_list = text_generator.get_prompt()
    text_generator.compute_prompt_baseline(max_token_per_subsection)
    baseline_prompt = text_generator.get_prompt_baseline()
    output_dict = {"prompts": result_list, "baseline_prompt": baseline_prompt}

    with open("prompt_output_" + input_data["groupby"] + ".log", "w") as f:
        f.write(json.dumps(output_dict, indent=4, sort_keys=True))

    # result_generator = text_generator.execute_baseline_streaming()

    # for result in result_generator:
    #     print("===== STREAMING OUTPUT =====")
    #     print(result)

    result = text_generator.execute()
    result_baseline = text_generator.execute_baseline()
    output_dict = {"text_result": result, "baseline_result": result_baseline}

    with open("final_output_" + input_data["groupby"] + ".log", "w") as f:
        f.write(json.dumps(output_dict, indent=4, sort_keys=True))
