import torchtext

torchtext.disable_torchtext_deprecation_warning()

import json
import os
import numpy as np
import argparse
import time
import uuid
from typing import List
from sklearn.cluster import KMeans
from sklearn.metrics import (
    silhouette_score,
    calinski_harabasz_score,
    davies_bouldin_score,
)

from abc import ABC, abstractmethod
from config import WF_OUTPUT_DIR
from models import (
    TextEmbedding,
    TfidfEmbedding,
    GloveEmbedding,
    SentenceTransformerEmbedding,
)


class Clustering(ABC):
    @abstractmethod
    def cluster(self, embeddings):
        """cluster embeddings"""
        pass


class KMeansClustering(Clustering):
    def __init__(self, n_clusters=None):
        if not n_clusters:
            # the default number of clusters is 8 in KMeans, if not specified
            self.kmeans = KMeans()
        else:
            self.kmeans = KMeans(n_clusters=n_clusters)

    def cluster(self, embeddings):
        return self.kmeans.fit_predict(embeddings)


class OnlineClustering:
    def __init__(
        self,
        embedding_model: TextEmbedding,
        n_clusters=None,
        cluster_method=None,
    ):
        if cluster_method is None:
            self.cluster_method = KMeansClustering(n_clusters)
        else:
            self.cluster_method = cluster_method
        self.embedding_model = embedding_model

    def embed_data(
        self,
        data,
        input_field: str = "cluster_key",
        output_field: str = "embedding",
    ):
        text_to_embed = [item[input_field] for item in data]
        embeddings = self.embedding_model.embed(text_to_embed)
        for idx, item in enumerate(data):
            item[output_field] = embeddings[idx]
            del item[input_field]

    def cluster_data(self, data, input_field: str = "embedding"):
        embeddings = np.array([item[input_field] for item in data])
        clusters = self.cluster_method.cluster(embeddings)
        return clusters
        # for idx, item in enumerate(data):
        #    item["cluster_id"] = key + "_" + str(clusters[idx])


# The text extractor is used to extract the text data from the json files, for testing the clustering workflow.
class TextExtractor:
    def __init__(self, data_path):
        self.data_path = data_path
        self.papers_dict = {}
        self.data_dict = {}
        self.folders = os.listdir(self.data_path)

    def load_json(self, file_path: str) -> dict:
        with open(file_path, "r") as file:
            return json.load(file)["data"]

    def hash_id(self, input_string: str) -> str:
        return str(uuid.uuid5(uuid.NAMESPACE_DNS, input_string))

    def extract_data(
        self,
        node_name: str,
        prop_list: List[str] = None,
    ):
        for folder in self.folders:
            paper_file_name = os.path.join(self.data_path, folder, "Paper.json")
            if os.path.exists(paper_file_name):
                paper_data = self.load_json(paper_file_name)
                paper_data["id"] = self.hash_id(folder)
                if paper_data["id"] not in self.papers_dict:
                    self.papers_dict[paper_data["id"]] = (folder, paper_data)
        if node_name not in self.data_dict:
            data_dict = self.data_dict.setdefault(node_name, {})
        else:
            data_dict = self.data_dict[node_name]

        for paper_id, (folder, _) in self.papers_dict.items():
            data_file_name = os.path.join(self.data_path, folder, f"{node_name}.json")
            data_items = self.load_json(os.path.join(data_file_name))

            if not isinstance(data_items, list):
                data_items = [data_items]

            for idx, item in enumerate(data_items):
                data_id = self.hash_id(f"{paper_id}_{idx}")

                if data_id not in data_dict:
                    data_dict[data_id] = {"id": data_id}
                    if prop_list:
                        combined_text_parts = []
                        for prop in prop_list:
                            value = item.get(prop, "")
                            combined_text_parts.append(value)
                            data_dict[data_id][prop] = value
                        # for the clustering key, simply concatenate the values of the given properties
                        combined_text = ". ".join(combined_text_parts)
                        data_dict[data_id]["cluster_key"] = combined_text
                    else:
                        data_dict[data_id].update(item)

    def get_data(self, node_name):
        return self.data_dict.get(node_name, {})


# The clustering evaluator is used to evaluate the clustering results using different metrics.
class ClusteringEvaluator:
    def __init__(self, embedding_data, embedding_method=None):
        self.embedding_data = embedding_data
        self.embedding_method = embedding_method

    def eval_cluster(self, y_pred):
        print("Clustering Evaluation Metrics for Method:", self.embedding_method)
        # Silhouette Score is a measure of how similar an object is to its own cluster compared to other clusters.
        # The silhouette ranges from -1 to 1, where a high value indicates that the object is well matched to its own cluster and poorly matched to neighboring clusters.
        score = silhouette_score(self.embedding_data, y_pred)
        print("Silhouette Score: {:.4f}".format(score))
        # The Davies-Bouldin index is a metric for evaluating clustering algorithms.
        # This index is calculated by finding the average similarity measure of each cluster with its most similar cluster.
        # The minimum score is zero, with lower values indicating better clustering.
        db_index = davies_bouldin_score(self.embedding_data, y_pred)
        print("Davies-Bouldin Index: {:.4f}".format(db_index))
        # The Calinski-Harabasz index is a metric used to evaluate the goodness of a clustering algorithm.
        # This index is calculated by the ratio of the sum of between-cluster dispersion to the sum of within-cluster dispersion.
        # The higher the CH index, the better the clustering.
        ch_index = calinski_harabasz_score(self.embedding_data, y_pred)
        print("Calinski-Harabasz Index: {:.4f}".format(ch_index))


class ClusteringPipeline:
    def __init__(
        self,
        clustering_node,
        clustering_keys,
        embedding_method=None,
        clustering_method=None,
    ):
        self.clustering_node = clustering_node
        self.clustering_keys = clustering_keys
        self.embedding_method = embedding_method
        self.clustering_method = clustering_method

    def run_workflow(self):
        start = time.time()
        text_extractor = TextExtractor(WF_OUTPUT_DIR)
        text_extractor.extract_data(self.clustering_node, self.clustering_keys)
        data_dict = text_extractor.get_data(self.clustering_node)
        data = [item["cluster_key"] for item in data_dict.values()]
        embeddings = self.embedding_method.embed(data)
        y_pred = self.clustering_method.cluster(embeddings)
        print("Cluster labels:", y_pred)

        end = time.time()

        # Evaluate the clustering results
        evaluator = ClusteringEvaluator(embeddings, self.embedding_method.get_name())
        evaluator.eval_cluster(y_pred)
        print(f"Clustering time: {end - start:.2f}s")


def main(clustering_node, clustering_keys, embedding_method, n_clusters):

    embedding_methods = {
        "tfidf": TfidfEmbedding,
        "glove": GloveEmbedding,
        "sentence_transformer": SentenceTransformerEmbedding,
    }

    if embedding_method not in embedding_methods:
        raise ValueError(
            f"Unknown embedding method '{embedding_method}'. Choose from: {list(embedding_methods.keys())}."
        )

    clustering_pipeline = ClusteringPipeline(
        clustering_node=clustering_node,
        clustering_keys=clustering_keys,
        embedding_method=embedding_methods[embedding_method](),
        clustering_method=KMeansClustering(n_clusters=n_clusters),
    )
    print(
        f"Running clustering workflow for node: {clustering_node}, keys: {clustering_keys}, embedding: {embedding_method}"
    )
    clustering_pipeline.run_workflow()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Run clustering workflow with specified embedding method."
    )
    parser.add_argument(
        "--node", type=str, required=True, help="Specify the clustering node."
    )
    parser.add_argument(
        "--keys",
        type=str,
        nargs="+",  # Allows multiple keys to be passed
        required=True,
        help="Specify the clustering keys (space-separated).",
    )
    parser.add_argument(
        "--embedding",
        type=str,
        required=True,
        choices=["tfidf", "sentence_transformer", "glove"],
        help="Select embedding method: 'tfidf', 'sentence_transformer', or 'glove'.",
    )
    parser.add_argument(
        "--n_clusters",
        type=int,
        default=4,
        help="Number of clusters for KMeans (default: 4).",
    )
    args = parser.parse_args()
    main(args.node, args.keys, args.embedding, args.n_clusters)
