## Install Dependencies

### Prerequisites

- Python 3.10
- install node.js : https://nodejs.org/en
- install node package manager : https://pnpm.io/installation#using-npm or after `npm` installed, `npm install -g pnpm`

### Python Dependencies

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## Run Backend Server

We have not built and installed the python package yet. So, it is important to add the path to the python package to the `PYTHONPATH` before running the server.

```bash
export PYTHONPATH=$PYTHONPATH:$(pwd)
python apps/demo_app.py
```

The server will be running on `http://localhost:9999` by default.

## Run Frontend Server
Please refer to the [frontend README](../../examples/graphy/README.md) for instructions on how to run the frontend server.

## Instruction of Backend APIs

### Dataset

Create dataset from a single paper, or a zip package of multiple papers. All papers must be in PDF format. We have provided a sample `graphrag.pdf` file in the `input` directory for going through
the demo. The `dataset_id` for this paper is: `8547eb64-a106-5d09-8950-8a47fb9292dc`.

```bash
curl -X POST "http://localhost:9999/api/dataset" -F "file=@inputs/samples/graphrag.pdf"
```

Get dataset's metadata by `dataset_id`, including the id, llm_config, and its workflow for extracting the paper, if configured.

```bash
curl -X GET http://0.0.0.0:9999/api/dataset?dataset_id=8547eb64-a106-5d09-8950-8a47fb9292dc
```

Get all datasets

```bash
curl -X GET http://0.0.0.0:9999/api/dataset
```

Delete dataset by `dataset_id`

```bash
curl -X DELETE http://0.0.0.0:9999/api/dataset/8547eb64-a106-5d09-8950-8a47fb9292dc
```

### LLM Config

Create LLM Config for the dataset.

```bash
curl -X POST http://0.0.0.0:9999/api/llm/config -H "Content-Type: application/json" -d '{
  "dataset_id": "8547eb64-a106-5d09-8950-8a47fb9292dc",
  "llm_model": "qwen-plus",
    "base_url": "https://dashscope.aliyuncs.com/compatible-mode/v1",
    "api_key": "xxx",
    "model_kwargs": {
      "streaming":true
    }
}'
```

Get the LLM Config

```bash
curl -X GET http://0.0.0.0:9999/api/llm/config?dataset_id=8547eb64-a106-5d09-8950-8a47fb9292dc
```

### Workflow Config

Create the workflow for extracting contents for all papers in the dataset. The workflow is a acyclic directed graph (RAG). The node of the workflow mainly defines what contents to extract from the paper and the output format. The edge indicates dependencies between nodes.

```bash
curl -X POST http://0.0.0.0:9999/api/dataset/workflow/config -H "Content-Type: application/json" -d '{
    "dataset_id": "8547eb64-a106-5d09-8950-8a47fb9292dc",
    "workflow_json": {
    "nodes": [
        {
            "name": "Paper"
        },
        {
            "name": "Contribution",
            "query":
                "**Question**:\nList all contributions of the paper. These contributions are always organized and listed with a head sentence like **our contributions are as follows**. For each contribution, output the **original representation** and use few words to summarize it.",
            "extract_from": ["1"],
            "output_schema": {
                "type": "array",
                "description": "A list of contributions.",
                "item": [
                    {
                        "name": "original",
                        "type": "string",
                        "description": "The original contribution sentences."
                    },
                    {
                        "name": "summary",
                        "type": "string",
                        "description": "The summary of the contribution."
                    }
                ]
            }
        },
        {
            "name": "Challenge",
            "query": "**Question**:\nPlease summarize some challenges in this paper. Each challenge has summarized NAME, detailed DESCRIPTION and SOLUTION.\n",
            "extract_from": [],
            "output_schema": {
                "type": "array",
                "description": "A list of challenges for the problems and their solutions in the paper.",
                "item": [
                    {
                        "name": "name",
                        "type": "string",
                        "description": "The summarized name of the challenge."
                    },
                    {
                        "name": "description",
                        "type": "string",
                        "description": "The description of the challenge."
                    },
                    {
                        "name": "solution",
                        "type": "string",
                        "description": "The solution of the challenge."
                    }
                ]
            }
        }
    ],
    "edges": [
        {
            "source": "Paper",
            "target": "Contribution"
        },
        {
            "source": "Contribution",
            "target": "Challenge"
        }
    ]
  }
}'
```

Get the Workflow

```bash
curl -X GET http://0.0.0.0:9999/api/dataset/workflow/config?dataset_id=8547eb64-a106-5d09-8950-8a47fb9292dc
```

### Extraction

Start extracting the paper contents based on the workflow.
This works asynchrously. Once started, one can call the following apis to check the progress.

```bash
curl -X POST http://0.0.0.0:9999/api/dataset/extract -H "Content-Type: application/json" -d '{
 "dataset_id": "8547eb64-a106-5d09-8950-8a47fb9292dc",
 "thread_num": 16
}'
```

Please note that in the extraction process, the `thread_num` parameter is optional, with a default value of 16.

Get the extraction status for all workflow nodes.

```bash
curl -X GET http://0.0.0.0:9999/api/dataset/extract?dataset_id=8547eb64-a106-5d09-8950-8a47fb9292dc
```

Or for a specific node

```bash
curl -X GET "http://0.0.0.0:9999/api/dataset/extract?dataset_id=8547eb64-a106-5d09-8950-8a47fb9292dc&workflow_node_names=Challenge"
```

### Graphy Your Data

After extracting and summarizing the contents, one can visualize and analyze the extracted contents in a graph. For simplicity, we now only export the graph data in a zip file. But later we will provide a web-based graph visualization tool.

```bash
curl -X POST http://0.0.0.0:9999/api/dataset/graphy -H "Content-Type: application/json" -d '{
    "dataset_id": "8547eb64-a106-5d09-8950-8a47fb9292dc"
}' --output graph.zip
```

You can directly import the graphied data into [GraphScope Interactive](https://graphscope.io/docs/latest/flex/interactive/getting_started). Start Interactive service and then export the required ports as [instructed](https://graphscope.io/docs/latest/flex/interactive/getting_started). Then the following POST/GET/DELETE apis can be called.

```bash
curl -X POST http://0.0.0.0:9999/api/dataset/graphy/interactive -H "Content-Type: application/json" -d '{
    "dataset_id": "8547eb64-a106-5d09-8950-8a47fb9292dc"
}'
```

```bash
curl -X GET 'http://0.0.0.0:9999/api/dataset/graphy/interactive?dataset_id=b4280bb9-3603-5b1d-bed8-6b2080092e31'
```

```bash
curl -X DELETE http://0.0.0.0:9999/api/dataset/graphy/interactive/b4280bb9-3603-5b1d-bed8-6b2080092e31
```

## Test and Benchmark Workflow Extraction

The project can be test by running the following command:

```bash
python apps/demo_app.py  # run the backend app server
pytest --benchmark-skip -s # on other terminal
```

A benchmark tool is provided to test the workflow extraction. You can run the script from the command line as follows:

```bash
pytest --benchmark-only -s
```
