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
        download_folder: str = WF_DOWNLOADS_DIR,
    ):
        """
        Initialize the ArxivFetcher.

        :param timeout: The maximum time (in seconds) allowed for each paper fetching operation.
        :param download_folder: The folder where the fetched papers will be downloaded.
        """
        self.client = arxiv.Client(delay_seconds=0.2, page_size=3, num_retries=1)
        self.timeout = timeout
        self.download_folder = download_folder
        self.bib_search_arxiv = BibSearchArxiv()

        self.result_former = ResultFormer()

    def find_paper_from_arxiv(self, name, max_results):
        new_names = sorted(
            [s for s in re.split(r"[.\\/]", name.strip()) if len(s) >= 20],
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

                if highest_similarity > 0.9 or found_result:
                    break
                logger.warn(f"Not Found: {query}")

            if highest_similarity > 0.9:
                break
            else:
                best_match = None
                highest_similarity = 0.0

        return highest_similarity, best_match

    def download_paper(self, name: str, max_results):
        logger.info(
            f"******************** Searching for paper: {name} *******************"
        )

        name = unicodedata.normalize("NFKC", name)

        highest_similarity, best_match = self.find_paper_from_arxiv(name, max_results)

        time.sleep(0.3)

        if highest_similarity > 0.9:
            logger.info(
                f"Best match found: {best_match.title} with similarity {highest_similarity}"
            )

            time.sleep(0.5)
            download_list = self.bib_search_arxiv.download_by_object(
                best_match, self.download_folder
            )
            # self.bib_search_arxiv.download_by_wget(best_match, download_folder)

            return download_list
        else:
            logger.warn(f"Failed to fetch paper with arxiv: {name}")
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

            fetch_result = self.result_former.init_from_arxiv(best_match)
            paper_bib = self.bib_search_arxiv.search_by_object(best_match)
            # except:
            #    logger.error(f"Extract bib failed: {paper_arxiv_id}")
            #    paper_bib = None
            return fetch_result, paper_bib
        else:
            logger.error(f"Failed to fetch paper with arxiv: {name}")
            return None, None

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
    filenames = []

    # Traverse the directory
    for root, dirs, files in os.walk("inputs/download"):
        for file in files:
            # Append file names to the list
            filenames.append(file)

    for file_name in filenames:
        download_foler = os.path.join(f"{WF_DOWNLOADS_DIR}", file_name.split(".")[0])
        fetcher = ArxivFetcher(download_folder=download_foler)
        os.makedirs(download_foler)
        path = os.path.join("inputs", "download", file_name)
        with open(f"{path}", "r") as f:
            papers = f.readlines()
            line_counter = 0
            for paper in papers:
                line_counter += 1
                if line_counter % 2 == 0:
                    continue
                paper = paper.strip()
                fetcher.download_paper(paper, 5)
                # fetcher.download_paper(paper.split(",")[0], 5)
    # print(json.dumps(data, indent=2))
