from collections import Counter
from difflib import SequenceMatcher
import math
import logging

from sentence_transformers import SentenceTransformer, SimilarityFunction


logger = logging.getLogger(__name__)


class StringSimilarity:
    # Load a pretrained Sentence Transformer model
    # default_model = SentenceTransformer("all-MiniLM-L6-v2")

    @classmethod
    def levenshtein(cls, str1, str2):
        if len(str1) < len(str2):
            return cls.levenshtein(str2, str1)

        if len(str2) == 0:
            return len(str1)

        previous_row = range(len(str2) + 1)
        for i, c1 in enumerate(str1):
            current_row = [i + 1]
            for j, c2 in enumerate(str2):
                insertions = previous_row[j + 1] + 1
                deletions = current_row[j] + 1
                substitutions = previous_row[j] + (c1 != c2)
                current_row.append(min(insertions, deletions, substitutions))
            previous_row = current_row

        return previous_row[-1]

    @classmethod
    def jaccard(cls, str1, str2):
        set1, set2 = set(str1), set(str2)
        intersection = len(set1.intersection(set2))
        union = len(set1.union(set2))
        return intersection / union

    @classmethod
    def cosine_similarity(cls, str1, str2):
        vec1 = Counter(str1)
        vec2 = Counter(str2)

        intersection = set(vec1.keys()) & set(vec2.keys())
        numerator = sum([vec1[x] * vec2[x] for x in intersection])

        sum1 = sum([vec1[x] ** 2 for x in vec1.keys()])
        sum2 = sum([vec2[x] ** 2 for x in vec2.keys()])
        denominator = math.sqrt(sum1) * math.sqrt(sum2)

        if not denominator:
            return 0.0
        else:
            return float(numerator) / denominator

    @classmethod
    def ratio_similarity(cls, str1, str2):
        return SequenceMatcher(None, str1, str2).ratio()

    # @classmethod
    # def semantic_similarity(cls, str1, str2, semantic_model=default_model):
    #     sents = [str1, str2]
    #     embeddings = semantic_model.encode(sents)
    #     similarities = semantic_model.similarity(embeddings, embeddings)
    #     # logger.warning(f"Similarity of {str1} - {str2}: {similarities[0][1]}")
    #     return similarities[0][1]
