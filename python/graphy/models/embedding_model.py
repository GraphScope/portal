from abc import ABC, abstractmethod
from typing import List
from chromadb.utils import embedding_functions
from sentence_transformers import SentenceTransformer
from sklearn.feature_extraction.text import TfidfVectorizer

import numpy as np
import os

from chromadb import Documents, EmbeddingFunction, Embeddings


class MyEmbedding(EmbeddingFunction):
    def __init__(self):
        self.embed_model = embedding_functions.DefaultEmbeddingFunction()

    def __call__(self, text_data: List[str]) -> Embeddings:
        return self.embed_model.embed_with_retries(text_data)

    @staticmethod
    def get_name():
        return "ONNXMiniLM_L6_V2"


class TextEmbedding(ABC):
    @abstractmethod
    def embed(self, text_data: List[str]):
        """transform text data to embeddings"""
        pass

    @abstractmethod
    def chroma_embedding_model(self):
        """return the embedding model for chromadb"""
        pass

    @abstractmethod
    def get_name(self):
        """return the name of the embedding model"""
        pass


# class DefaultEmbedding(TextEmbedding):
#     def __init__(self):
#         self.embed_model = embedding_functions.DefaultEmbeddingFunction()

#     def embed(self, text_data: List[str]):
#         return self.embed_model.embed_with_retries(text_data)

#     def chroma_embedding_model(self):
#         # TODO
#         return self.embed_model

#     def get_name(self):
#         return "ONNXMiniLM_L6_V2"


class TfidfEmbedding(TextEmbedding):
    def __init__(self):
        # TODO: the parameters can be configurable if necessary
        self.vectorizer = TfidfVectorizer(sublinear_tf=True, min_df=2, max_df=0.99)

    def embed(self, text_data: List[str]):
        return self.vectorizer.fit_transform(text_data).toarray()

    def chroma_embedding_model(self):
        # TODO
        return None

    def get_name(self):
        return "TF-IDF"


class SentenceTransformerEmbedding(TextEmbedding):
    def __init__(self, embedding_model_name: str = ""):
        if not embedding_model_name:
            embedding_model_name = os.getenv("EMBEDDING_MODEL_NAME", "all-MiniLM-L6-v2")
        if os.path.exists(embedding_model_name):
            self.model = SentenceTransformer(
                embedding_model_name, local_files_only=True
            )
        else:
            self.model = SentenceTransformer(embedding_model_name)

    def embed(self, text_data: List[str]):
        return np.vstack(
            [
                self.model.encode(data, convert_to_numpy=True).flatten()
                for data in text_data
            ]
        )

    def chroma_embedding_model(self):
        # TODO
        return None

    def get_name(self):
        return "SentenceTransformer"
