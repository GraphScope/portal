from apps.graph_analyzer import LLMGraphAnalyzer
from models import set_llm_model, DefaultEmbedding, DEFAULT_LLM_MODEL_CONFIG
import json
import os
from langchain_openai import ChatOpenAI


if __name__ == "__main__":
    llm_model = ChatOpenAI(
        model="qwen-plus",
        temperature=0.8,
        base_url="https://dashscope.aliyuncs.com/compatible-mode/v1",
        api_key=os.environ["DASHSCOPE_API_KEY"],  ### DO NOT commit
        # stop=["<|eot_id|>"],
        streaming=True,
    )
    graph_analyzer = LLMGraphAnalyzer(llm_model=llm_model)
    # query = "write a related work section about the given data, you should category them based on the challenges they solve"
    # query = "write a section about the given data to analyze how the method has evolved across years"
    query = "write a related work section about the given data, do not use the challenge data, order the results according to three aspects of the paper, two DESC"

    with open("config/analyze/schema_paper.json") as f:
        schema_json = json.load(f)
    queries = graph_analyzer.get_fetch_query(query=query, schema=schema_json)

    print("=================== Queries ===================")
    print(queries)

    with open("config/analyze/data_paper.json") as f:
        data_json = json.load(f)
    # mind_map = graph_analyzer.get_mind_map(query=query, data=data_json)
    print("=================== MIND MAP ===================")
    # print(mind_map)

    with open("config/analyze/mind_map.json") as f:
        mind_map = json.load(f)

    # mind_map_str = json.dumps(mind_map)
    # report = graph_analyzer.write_report(
    #     query=query, mind_map=mind_map_str, max_token_per_subsection=100
    # )
    # report = graph_analyzer.write_report_sec_by_sec(
    #     query=query, mind_map=mind_map, max_token_per_subsection=100
    # )
    print("=================== REPORT ===================")
    # print(report)

    with open("config/analyze/mind_map_evolve.json") as f:
        mind_map = json.load(f)

    # mind_map_str = json.dumps(mind_map)
    # report = graph_analyzer.write_report(
    #     query=query, mind_map=mind_map_str, max_token_per_subsection=100
    # )
    report = graph_analyzer.write_evolve_sec_by_sec(
        query=query, mind_map=mind_map, max_token_per_subsection=100
    )
    print("=================== EVOLVE ===================")
    print(report)
