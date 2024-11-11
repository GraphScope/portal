import pytest
import requests
import json
import os

from utils.cryptography import encrypt_key, decrypt_key

# Base URL for the API server
BASE_URL = "http://127.0.0.1:9999"

# Sample dataset_id and file path for tests
DATASET_ID = "123"
GRAPH_JSON = {
    "nodes": [
        {
            "id": "144115188075856126",
            "label": "Paper",
            "properties": {
                "id": "144115188075856126",
                "published": "2019-12-08T04:18:27",
                "year": "2019",
                "month": "12",
                "title": "Algorithm 1000: SuiteSparse:GraphBLAS: Graph Algorithmsin the Language of Sparse Linear Algebra",
                "authors": "",
                "summary": "",
                "journal_ref": "",
                "doi": "",
                "primary_category": "",
                "categories": "",
                "problem_def": "The problem addressed in this research is the development of a standard for graph algorithms based on sparse linear algebra, specifically the GraphBLAS (Graph Basic Linear Algebra Subprograms) standard. The context that makes this problem important is the increasing need for efficient and scalable graph algorithms in various fields, such as social network analysis, recommendation systems, and machine learning. The authors aim to provide a framework for expressing graph algorithms in the language of linear algebra, allowing for the use of sparse matrix operations and semirings to solve graph problems. The key objectives of this research are to define the GraphBLAS standard, provide a reference implementation (SuiteSparse:GraphBLAS), and demonstrate its effectiveness in solving various graph problems. The authors also aim to make graph algorithms more accessible and easier to implement, while providing a foundation for future research and development in the field.",
                "keywords": "GraphBLAS,Graph,Algorithms,Linear,Algebra,Semirings,Sparse,Matrices,SuiteSparse,Implementation",
                "bib": "bib of 144115188075856126",
            },
            "x": -8.972964164633341,
            "y": -64.43975210205846,
            "z": 0,
            "__indexColor": "#1804f2",
            "index": 38,
            "vx": 2.622592902626034e-9,
            "vy": -3.4348574018858993e-9,
        },
        {
            "id": "144115188075855924",
            "label": "Paper",
            "properties": {
                "id": "144115188075855924",
                "published": "2016-10-04T16:31:43+00:00",
                "year": "2016",
                "month": "10",
                "title": "Gemini: A Computation-Centric Distributed  Graph Processing System",
                "authors": "",
                "summary": "",
                "journal_ref": "",
                "doi": "",
                "primary_category": "",
                "categories": "",
                "problem_def": "The problem addressed in this research is the inefficiency of distributed graph processing systems, which are designed to handle large-scale graphs that do not fit in the memory of a single machine. Despite their ability to scale, these systems often deliver unsatisfactory performance and cost efficiencies compared to shared-memory graph processing systems. The authors aim to bridge the gap between efficient shared-memory and scalable distributed systems by designing a distributed graph processing system that builds scalability on top of efficiency. The key objectives are to identify design pitfalls in existing systems, propose a new system that addresses these pitfalls, and evaluate its performance on real-world graphs.",
                "keywords": "Distributed,Graph,Processing,System,Scalability,Efficiency,Computation,Communication,Locality,Partitioning",
                "bib": "bib of 144115188075855924",
            },
            "x": 69.97196994136748,
            "y": -26.941823667880882,
            "z": 0,
            "__indexColor": "#d004dc",
            "index": 16,
            "vx": 2.6806550165238664e-9,
            "vy": -3.715059369661598e-9,
        },
        {
            "id": "144115188075856157",
            "label": "Paper",
            "properties": {
                "id": "144115188075856157",
                "published": "2012-09-21T09:07:02",
                "year": "2012",
                "month": "9",
                "title": "PowerGraph: Distributed Graph-Parallel Computation on Natural Graphs",
                "authors": "",
                "summary": "",
                "journal_ref": "",
                "doi": "",
                "primary_category": "",
                "categories": "",
                "problem_def": "The problem definition addressed in this research revolves around the challenges of processing large-scale graph-structured data in machine learning and data mining (MLDM) applications. The context that makes this problem important is the increasing need to reason about massive graph datasets, which is critical in various domains such as social networks, web graphs, and recommendation systems. The key challenge lies in the fact that natural graphs, which are derived from real-world phenomena, have power-law degree distributions, making them difficult to partition and process efficiently. This leads to issues with communication, locality, and load balancing in distributed graph processing systems. The authors' key objectives are to: Develop a distributed graph processing system that can efficiently handle large-scale natural graphs. Overcome the limitations of existing graph parallel abstractions, such as Pregel and GraphLab, which struggle with natural graphs due to their skewed degree distributions. Achieve scalable and efficient processing of graph-structured data, enabling fast and accurate MLDM applications. To address these objectives, the authors propose PowerGraph, a novel distributed graph processing system designed to handle the challenges of natural graphs.",
                "keywords": "Graph,Parallel,PowerGraph,Abstraction,Computation,Large-scale,Distributed,Graph-structured,Machine Learning,Data Mining",
                "bib": "bib of 144115188075856157",
            },
            "x": 57.45599229230604,
            "y": -33.214805693057954,
            "z": 0,
            "__indexColor": "#3404d7",
            "index": 11,
            "vx": 2.6746042913785525e-9,
            "vy": -3.7029729382441027e-9,
        },
        {
            "id": "144115188075856215",
            "label": "Paper",
            "properties": {
                "id": "144115188075856215",
                "published": "2024-09-10T13:37:09.597408",
                "year": "2024",
                "month": "9",
                "title": "Sortledton: a Universal, Transactional Graph Data Structure",
                "authors": "",
                "summary": "",
                "journal_ref": "",
                "doi": "",
                "primary_category": "",
                "categories": "",
                "problem_def": "The problem addressed in this research is the need for a universal graph data structure that can efficiently support a wide range of graph computations, including analytics, graph pattern matching (GPM), and traversals, on dynamic graphs. The context that makes this problem important is the increasing necessity for efficient support of diverse dynamic graph workloads in various application domains, such as recommender systems, fraud detection, and threat detection. The key objectives or goals the authors set to address this problem are to design a graph data structure that can support fast scans, high throughput of new edges, and efficient intersections, while also providing transactional guarantees to ensure correct results for concurrently executing analytical queries in the presence of updates. The authors aim to achieve a competitive performance for the most common graph workloads, while also supporting millions of transactional updates per second.",
                "keywords": "Graph,Data,Structure,Dynamic,Transactional,Workloads,Analytics,Traversals,Pattern,Matching",
                "bib": "bib of 144115188075856215",
            },
            "x": -42.09285322163977,
            "y": -68.26278797373054,
            "z": 0,
            "__indexColor": "#7804fa",
            "index": 46,
            "vx": 2.661479317800176e-9,
            "vy": -3.5127771139310167e-9,
        },
        {
            "id": "0",
            "label": "Challenge",
            "properties": {
                "name": "Memory-Efficient Scalable Graph Processing",
                "description": "This cluster focuses on the central challenge of developing memory-efficient and scalable algorithms for processing massive graphs within distributed computing environments. The primary concerns revolve around overcoming memory limitations, reducing memory consumption, and optimizing memory usage to handle large-scale graph data, while also addressing computational costs, scalability bottlenecks, and communication overhead. Key aspects include designing memory-aware data partitioning strategies, minimizing communication between processors, and employing advanced data structures to ensure both efficiency and scalability in managing graph-structured data. The cluster emphasizes the necessity for innovative solutions to extend the capability of graph processing systems under strict memory constraints, thereby enabling the analysis of increasingly larger graphs prevalent in modern applications such as social networks and the Web.",
            },
            "x": 21.41954209735946,
            "y": -61.46725897695199,
            "z": 0,
            "__indexColor": "#6404fb",
            "index": 47,
            "vx": 2.5214183959987045e-9,
            "vy": -3.5677362162511125e-9,
        },
    ],
    "edges": [
        {
            "id": "562954514726912",
            "source": "144115188075856126",
            "target": "0",
            "label": "Paper_Has_Challenge",
            "properties": {},
            "__indexColor": "#54052f",
            "__photons": [{"__progressRatio": 3.9968028886505635e-15}],
            "__controlPoints": None,
            "index": 46,
        },
        {
            "id": "562954302914560",
            "source": "144115188075855924",
            "target": "0",
            "label": "Paper_Has_Challenge",
            "properties": {},
            "__indexColor": "#880546",
            "__photons": [{"__progressRatio": 3.9968028886505635e-15}],
            "__controlPoints": None,
            "index": 69,
        },
        {
            "id": "562954547232768",
            "source": "144115188075856157",
            "target": "0",
            "label": "Paper_Has_Challenge",
            "properties": {},
            "__indexColor": "#38054a",
            "__photons": [{"__progressRatio": 3.9968028886505635e-15}],
            "__controlPoints": None,
            "index": 73,
        },
        {
            "id": "562954608050176",
            "source": "144115188075856215",
            "target": "0",
            "label": "Paper_Has_Challenge",
            "properties": {},
            "__indexColor": "#040533",
            "__photons": [{"__progressRatio": 3.9968028886505635e-15}],
            "__controlPoints": None,
            "index": 50,
        },
    ],
}


def test_prepare_prompt():
    payload = {
        "data": GRAPH_JSON,
        "dataset_id": DATASET_ID,
        "use_prompt_cache": False,
        "groupby": "Challenge",
        "identity": "test",
        "baseline": False,
    }

    response = requests.post(f"{BASE_URL}/api/llm/report/prepare", json=payload)
    output = json.loads(response.content)
    print(output)
    assert response.status_code == 200
    assert len(output["data"]["prompts"]) == 2
    assert len(output["data"]["prompts"][1]) > 0


@pytest.mark.skipif(
    not os.environ.get("DASHSCOPE_API_KEY", "")
    and not os.environ.get("OPEN_API_KEY", ""),
    reason="requires LLM connection",
)
def test_generate_prompt():
    payload = {
        "data": GRAPH_JSON,
        "groupby": "Challenge",
        "dataset_id": "123",
        "use_prompt_cache": True,
        "use_result_cache": True,
        "identity": "test",
        "baseline": False,
    }

    response = requests.post(f"{BASE_URL}/api/llm/report/generate", json=payload)
    output = json.loads(response.content)
    print(output)
    assert response.status_code == 200


@pytest.mark.skipif(
    not os.environ.get("DASHSCOPE_API_KEY", "")
    and not os.environ.get("OPEN_API_KEY", ""),
    reason="requires LLM connection",
)
def test_generate_prompt_baseline():
    payload = {
        "data": GRAPH_JSON,
        "groupby": "Challenge",
        "dataset_id": "123",
        "use_prompt_cache": True,
        "use_result_cache": True,
        "identity": "test",
        "baseline": True,
    }

    response = requests.post(f"{BASE_URL}/api/llm/report/generate", json=payload)
    output = json.loads(response.content)
    print(output)
    assert response.status_code == 200


def test_cluster():
    payload = {
        "dataset_id": DATASET_ID,
        "groupby": "Challenge",
        "clustering_keys": ["name", "description"],
        "data": {
            "nodes": [
                {
                    "id": "0",
                    "label": "Challenge",
                    "properties": {
                        "name": "Memory-Efficient Scalable Graph Processing",
                        "description": "This cluster focuses on the central challenge of developing memory-efficient and scalable algorithms for processing massive graphs within distributed computing environments. The primary concerns revolve around overcoming memory limitations, reducing memory consumption, and optimizing memory usage to handle large-scale graph data, while also addressing computational costs, scalability bottlenecks, and communication overhead. Key aspects include designing memory-aware data partitioning strategies, minimizing communication between processors, and employing advanced data structures to ensure both efficiency and scalability in managing graph-structured data. The cluster emphasizes the necessity for innovative solutions to extend the capability of graph processing systems under strict memory constraints, thereby enabling the analysis of increasingly larger graphs prevalent in modern applications such as social networks and the Web.",
                    },
                },
                {
                    "id": "4",
                    "label": "Challenge",
                    "properties": {
                        "name": "Efficient Graph Dynamics Processing",
                        "description": "This cluster revolves around the central theme of developing efficient algorithms to manage and process dynamic updates in large graphs, focusing on minimizing computational costs and iterations. The primary challenges addressed include the minimization of iterations for maintaining graph structures such as maximal k-trusses under updates, efficient incremental adjustments to centrality measures like betweenness in response to edge modifications, and the batch processing of vertex and edge updates while preserving structural integrity. A key aspect is the need for algorithms capable of swiftly recomputing trussness values and adjusting to graph topology changes due to edge/vertex insertions/deletions, thereby emphasizing the importance of adaptive and optimized approaches for real-time graph analysis in dynamic environments.",
                    },
                },
                {
                    "id": "2",
                    "label": "Challenge",
                    "properties": {
                        "name": "Adaptive Algorithms for Heterogeneous & Irregular Graphs",
                        "description": "This cluster focuses on the development of advanced algorithms and architectures to efficiently process and analyze complex, real-world graphs characterized by heterogeneity in vertex and edge attributes, irregular structures leading to poor data locality, and variations in density, connectivity, and weights. The primary challenge revolves around devising adaptive mechanisms that can handle heterogeneous graph structures with varying degrees, weights, and sparsity, while also tackling the issues of random and irregular memory access patterns that inherently affect performance in distributed and GPU-based systems. Emphasis is placed on overcoming load imbalance, reducing communication overhead, and enhancing memory locality to optimize the handling of weighted graphs and irregular network topologies, thereby pushing the boundaries of algorithmic sophistication and system efficiency in graph processing.",
                    },
                },
                {
                    "id": "1",
                    "label": "Challenge",
                    "properties": {
                        "name": "Optimizing Load Balance in Distributed Systems",
                        "description": "This cluster centers on the critical challenge of Load Balance Optimization in Distributed Computing Environments. It encapsulates the myriad issues stemming from uneven distribution of workloads across parallel processors or nodes, including performance degradation, inefficiencies in computation and communication, and scalability limitations. The core emphasis is placed on devising and implementing effective strategies to mitigate workload imbalance, skewness, and ensure uniform task allocation. By addressing these challenges, researchers strive to enhance the overall efficiency, performance, and scalability of distributed algorithms and frameworks, thereby achieving optimal utilization of resources in large-scale, distributed memory architectures.",
                    },
                },
                {
                    "id": "3",
                    "label": "Challenge",
                    "properties": {
                        "name": "Optimizing Communication Efficiency in Distributed Algorithms",
                        "description": "This cluster centers on the optimization of communication efficiency in distributed algorithms, with a primary focus on minimizing the number of communication rounds. Researchers strive to strike a delicate balance between reducing round complexity, a pivotal factor influencing algorithm performance, and maintaining solution quality or approximation ratios. The cluster encompasses efforts to achieve linear time complexity (O(1)) through algorithmic optimizations that diminish the necessity for extensive communication. Specifically, challenges addressed include the minimization of round complexity for improved overall efficiency, the trade-off between solution accuracy and communication rounds, and the meticulous management of the tension between approximation quality and the speed of computation in distributed systems, particularly in the context of complex problems such as k-coloring. Collectively, these endeavors underline the criticality of communication efficiency in enhancing the scalability and effectiveness of distributed algorithms.",
                    },
                },
                {
                    "id": "5",
                    "label": "Challenge",
                    "properties": {
                        "name": "Optimizing GPU Memory Access for Graph Processing",
                        "description": "This cluster focuses on the central theme of enhancing graph processing performance on GPUs by meticulously addressing various memory-related challenges. The primary objective is to design algorithms and memory management systems that mitigate memory access inefficiencies, including non-coalesced access, synchronization overhead, and suboptimal access patterns. By ensuring coalesced memory access, minimizing synchronization latency, and optimizing access patterns to leverage memory bandwidth effectively, the research aims to overcome the memory access bottleneck inherent in GPU architectures. Ultimately, the cluster's efforts converge on maximizing memory efficiency and utilization across heterogeneous environments, thereby accelerating computation and alleviating bottlenecks that hinder large-scale graph processing performance.",
                    },
                },
            ],
        },
    }

    response = requests.post(f"{BASE_URL}/api/llm/report/clustering", json=payload)
    output = json.loads(response.content)
    print(output)
    assert response.status_code == 200
