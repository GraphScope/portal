from config import WF_DOWNLOADS_DIR
from typing import List, Dict, Any

import concurrent.futures
import arxiv
import difflib
import re
import os
import logging
import time
import unicodedata
import traceback

from .bib_search import BibSearchArxiv, BibSearchGoogleScholar
from requests.exceptions import ProxyError, ConnectionError, RequestException

logger = logging.getLogger(__name__)


class ResultFormer:
    def __init__(self) -> None:
        pass

    def init_from_arxiv(self, arxiv_result):
        result = {}
        if arxiv_result:
            result["id"] = arxiv_result.get_short_id()
            result["doi"] = arxiv_result.doi
            result["journal_ref"] = arxiv_result.journal_ref
            result["summary"] = (
                arxiv_result.summary.replace("|", " ").replace("\n", " ").strip()
            )
            result["authors"] = [str(author) for author in arxiv_result.authors]
            result["primary_category"] = arxiv_result.primary_category
            result["categories"] = arxiv_result.categories

        return result

    def google_scholar_string_refine(self, gs_str):
        gs_str = gs_str.replace("\n", " ").replace("-\n", " ")
        return gs_str

    def init_from_google_scholar(self, scholar_result):
        result = {}
        if scholar_result:
            result["id"] = scholar_result["id"]
            result["doi"] = ""
            result["journal_ref"] = scholar_result["bib_info"]["Publication"]
            result["summary"] = self.google_scholar_string_refine(
                scholar_result["snippet"]
            )
            result["authors"] = [scholar_result["bib_info"]["Author"]]
            result["primary_category"] = ""
            result["categories"] = ""

        return result


class ArxivFetcher:
    def __init__(
        self,
        timeout: int = 20,
        persist_store=None,
        download_folder: str = WF_DOWNLOADS_DIR,
        meta_folder: str = "",
    ):
        """
        Initialize the ArxivFetcher.

        :param timeout: The maximum time (in seconds) allowed for each paper fetching operation.
        :param download_folder: The folder where the fetched papers will be downloaded.
        """
        self.client = arxiv.Client(delay_seconds=0.5, page_size=6, num_retries=1)
        self.timeout = timeout
        self.download_folder = download_folder
        self.bib_search_arxiv = BibSearchArxiv(
            persist_store=persist_store, meta_folder=meta_folder
        )

        self.result_former = ResultFormer()

    def find_paper_with_arxiv_id(self, name):
        name = name.strip()
        pattern = r"(?:arXiv[.:]|abs/)(\d{4}\.\d{5})(v\d+)?"
        matches = re.findall(pattern, name)

        results = [match[0] + (match[1] if match[1] else "") for match in matches]

        if results:
            best_match = None
            highest_similarity = 0.0
            similarity = 0.0

            search_by_id = arxiv.Search(id_list=results)
            for paper in self.client.results(search_by_id):
                similarity = difflib.SequenceMatcher(
                    None, name.lower(), paper.title.lower()
                ).ratio()

                if similarity > highest_similarity:
                    highest_similarity = similarity
                    best_match = paper

            highest_similarity = 1

            return highest_similarity, best_match
        else:
            return 0.0, None

    def find_paper_from_arxiv(self, name, max_results):
        new_names = sorted(
            [s.strip() for s in re.split(r"[.\\/]", name.strip()) if len(s) >= 20],
            key=len,
            reverse=True,
        )

        highest_similarity = 0.0
        best_match = None
        added_query = set()
        for new_name in new_names:
            # replace - with space to improve search results

            original_query = new_name
            original_title_query = f"ti:{original_query}"
            query = re.sub(r"[-_.:\[\]\\]", " ", new_name).strip()
            new_query = re.sub(r"[-_.:\[\]\\]", " ", new_name).strip()
            title_query = f"ti:{new_query}"
            queries = [original_title_query, original_query, title_query, query]

            found_result = False
            for query in queries:
                if query in added_query:
                    continue
                else:
                    added_query.add(query)
                try:
                    search = arxiv.Search(query=query, max_results=max_results)
                except Exception as e:
                    logger.error(f"Error searching arxiv: {e}")
                    search = None
                best_match = None
                highest_similarity = 0.0
                similarity = 0.0

                if search is not None:
                    found_result = True
                    try:
                        for paper in self.client.results(search):
                            similarity = difflib.SequenceMatcher(
                                None, new_name.lower(), paper.title.lower()
                            ).ratio()
                            logger.info(
                                f"Compared with: {new_name}, Found paper: {paper.title} with similarity {similarity}"
                            )
                            if similarity > highest_similarity:
                                highest_similarity = similarity
                                best_match = paper
                            if similarity > 0.9:
                                break
                    except Exception as e:
                        traceback.print_exc()

                if highest_similarity > 0.9:
                    # print(f"found {query}")
                    break
                # logger.warning(f"Not Found: {query}")

            if highest_similarity > 0.9:
                break
            else:
                best_match = None
                highest_similarity = 0.0

        if not best_match:
            return self.find_paper_with_arxiv_id(name)
        return highest_similarity, best_match

    def download_paper(self, name: str, max_results):
        logger.info(
            f"******************** Searching for paper: {name} *******************"
        )

        name = unicodedata.normalize("NFKC", name)

        highest_similarity, best_match = self.find_paper_from_arxiv(name, max_results)

        time.sleep(0.1)

        if highest_similarity > 0.9:
            logger.info(
                f"Best match found: {best_match.title} with similarity {highest_similarity}"
            )

            time.sleep(0.1)
            download_list = self.bib_search_arxiv.download_by_object(
                best_match, self.download_folder
            )
            # self.bib_search_arxiv.download_by_wget(best_match, download_folder)

            return download_list
        else:
            logger.warning(f"Failed to fetch paper with arxiv: {name}")
            return []

    def fetch_paper(self, name: str, max_results):
        """
        Fetch a paper from arXiv by its name, finding the paper with the most similar title.

        :param name: The name (query) of the paper to fetch.
        :return: A string describing the result of the fetch operation, or None if no paper is found.
        """

        logger.info(f"Searching for paper: {name}")

        highest_similarity, best_match = self.find_paper_from_arxiv(name, max_results)

        if highest_similarity > 0.9:
            logger.info(
                f"Best match found: {best_match.title} with similarity {highest_similarity}"
            )

            fetch_result = self.bib_search_arxiv.format_json_object(best_match)
            # paper_bib = self.bib_search_arxiv.search_by_object(best_match)
            # except:
            #    logger.error(f"Extract bib failed: {paper_arxiv_id}")
            #    paper_bib = None
            return fetch_result
        else:
            logger.error(f"Failed to fetch paper with arxiv: {name}")
            return None

    def fetch_papers_concurrently(
        self, citations: List[str], max_results: int = 1
    ) -> List[Dict[str, Any]]:
        """
        Fetch multiple papers concurrently with a timeout.

        :param citations: A list of paper names (queries) to fetch.
        :param max_results: The maximum number of results to fetch per citation.
        :param timeout: The maximum time (in seconds) allowed for each fetch operation.
        :return: A list of dictionaries with citation names and their fetch results.
        """
        results = []
        with concurrent.futures.ThreadPoolExecutor() as executor:
            future_to_citation = {
                executor.submit(self.fetch_paper, citation, max_results): citation
                for citation in citations
                if citation
            }

            for future in concurrent.futures.as_completed(
                future_to_citation, timeout=self.timeout
            ):
                citation = future_to_citation[future]
                result = future.result(timeout=self.timeout)
                results.append({"citation": citation, "result": result})

        return results

    # def fetch_google_scholar(self):


if __name__ == "__main__":
    af = ArxivFetcher()
    output = af.find_paper_from_arxiv(
        "Peiyi Wang, Lei Li, Zhihong Shao, RX Xu, Damai Dai, Yifei Li, Deli Chen, Y Wu, and Zhifang Sui. Math-shepherd: Verify and reinforce llms step-by-step without human annotations. CoRR, abs/2312.08935 , 2023a."
    )
    print(output)
