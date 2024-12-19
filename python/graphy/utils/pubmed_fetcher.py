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
import requests
from lxml import etree

from .bib_search import BibSearchPubMed
from requests.exceptions import ProxyError, ConnectionError, RequestException

logger = logging.getLogger(__name__)


class PubMedFetcher:
    def __init__(
        self,
        timeout: int = 20,
        persist_store=None,
        download_folder: str = WF_DOWNLOADS_DIR,
        meta_folder: str = "",
    ):
        """
        Initialize the PubMedFetcher.

        :param timeout: The maximum time (in seconds) allowed for each paper fetching operation.
        :param download_folder: The folder where the fetched papers will be downloaded.
        """

        self.search_base_url = (
            "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi"
        )
        self.fetch_base_url = (
            "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi"
        )

        self.timeout = timeout
        self.download_folder = download_folder
        self.bib_search_pubmed = BibSearchPubMed(
            persist_store=persist_store, meta_folder=meta_folder
        )

    def request(self, base_url, params):
        try:
            time.sleep(0.5)
            response = requests.get(base_url, params=params)

            if response.status_code == 200:
                return response
            else:
                print(f"Request Error, Status Code: {response.status_code}")
                return None
        except requests.exceptions.RequestException as e:
            print(f"Request Error: {e}")
            return None

    def get_paper_info_from_xml(self, root):
        paper_info = {}
        article_title_list = root.xpath("//ArticleTitle/text()")
        if article_title_list:
            paper_info["title"] = article_title_list[0]

        complete_date = root.xpath("//DateCompleted")
        if complete_date:
            complete_date_time = {"year": None, "month": None, "day": None}
            date = complete_date[0]
            year_list = date.xpath("//Year/text()")
            month_list = date.xpath("//Month/text()")
            day_list = date.xpath("//Day/text()")
            if year_list:
                complete_date_time["year"] = year_list[0]
            if month_list:
                complete_date_time["month"] = month_list[0]
            if day_list:
                complete_date_time["day"] = day_list[0]
            paper_info["complete_time"] = complete_date_time

        abstract = root.xpath("//AbstractText/text()")
        if abstract:
            paper_info["abstract"] = abstract[0]

        pagination = root.xpath("//Pagination")
        if pagination:
            start_page_label = pagination[0].find("StartPage")
            if start_page_label is not None:
                paper_info["start_page"] = start_page_label.text

            end_page_label = pagination[0].find("EndPage")
            if end_page_label is not None:
                paper_info["end_page"] = end_page_label.text

        journal_list = root.xpath("//Journal")
        if journal_list:
            journal_dict = {}
            journal = journal_list[0]
            issn_list = journal.xpath(".//ISSN")
            if len(issn_list) > 0:
                issn_type = issn_list[0].get("IssnType")
                issn_value = issn_list[0].text
                journal_dict["issn"] = {"type": issn_type, "value": issn_value}

            journal_title = journal.xpath(".//Title/text()")
            if len(journal_title) > 0:
                journal_dict["title"] = journal_title[0]

            vol_list = journal.xpath(".//Volume/text()")
            if len(vol_list) > 0:
                journal_dict["vol"] = vol_list[0]

            issue_list = journal.xpath(".//Issue/text()")
            if len(issue_list) > 0:
                journal_dict["issue"] = issue_list[0]

            publish_date = journal.xpath(".//PubDate")
            publish_date_time = {"year": None, "month": None, "day": None}
            date = publish_date[0]
            year_list = date.xpath("//Year/text()")
            month_list = date.xpath("//Month/text()")
            day_list = date.xpath("//Day/text()")
            if len(year_list) > 0:
                publish_date_time["year"] = year_list[0]
            if len(month_list) > 0:
                publish_date_time["month"] = month_list[0]
            if len(day_list) > 0:
                publish_date_time["day"] = day_list[0]
            journal_dict["publish_time"] = publish_date_time

            paper_info["journal"] = journal_dict

        paper_info["reference"] = []
        references = root.xpath("//Reference")
        for ref in references:
            citation = ref.find("Citation").text

            article_ids = ref.xpath(".//ArticleId")
            article_id_dict = {}
            for article_id in article_ids:
                id_type = article_id.get("IdType")
                id_value = article_id.text
                article_id_dict[id_type] = id_value

            paper_info["reference"].append(
                {"citation": citation, "ids": article_id_dict}
            )

        paper_info["authors"] = []
        authors = root.xpath("//Author")
        for author in authors:
            author_dict = {}
            last_name_label = author.find("LastName")
            if last_name_label is not None:
                author_dict["last_name"] = last_name_label.text

            fore_name_label = author.find("ForeName")
            if fore_name_label is not None:
                author_dict["fore_name"] = fore_name_label.text

            initials_label = author.find("Initials")
            if initials_label is not None:
                author_dict["initials"] = initials_label.text

            identifier_label = author.find("Identifier")
            if identifier_label is not None:
                source = identifier_label.get("Source")
                value = identifier_label.text
                author_dict["identifier"] = {"source": source, "value": value}

            affiliation_info_label = author.xpath(".//AffiliationInfo")
            if affiliation_info_label:
                aff_list = []
                for affiliation_label in affiliation_info_label:
                    aff_label = affiliation_label.find("Affiliation")
                    if aff_label is not None:
                        aff_list.append(aff_label.text)
                author_dict["affiliations"] = aff_list

            paper_info["authors"].append(author_dict)

        return paper_info

    def get_paper_info_with_id(self, id):
        logger.warning(f"find paper with id {id}")
        fetch_params = {
            "db": "pubmed",
            "id": id,
        }
        fetch_response = self.request(self.fetch_base_url, fetch_params)
        root = etree.fromstring(fetch_response.content)
        paper_info = self.get_paper_info_from_xml(root)
        logger.warning(paper_info)
        return paper_info

    def find_paper_from_pubmed(self, name, max_results):
        new_names = sorted(
            [s for s in re.split(r"[.;]", name.strip()) if len(s) >= 20],
            key=len,
            reverse=True,
        )

        highest_similarity = 0.0
        best_match = None

        for new_name in new_names:
            query = re.sub(r"[-_.:\[\]\\]", " ", new_name).strip()
            query = re.sub(r"\s+", " ", query)
            logger.warning(f"query: {query}")

            params = {
                "db": "pubmed",
                "term": f"{query}[ti:~3]",
                "retmax": max_results,
                "retmode": "json",
            }

            response = self.request(base_url=self.search_base_url, params=params).json()
            if not response:
                return 0.0, None, None

            id_list = response.get("esearchresult", {}).get("idlist", [])

            best_match = None
            best_info = None
            highest_similarity = 0.0
            similarity = 0.0

            if len(id_list) > 0:
                try:
                    for cur_id in id_list:
                        paper_info = self.get_paper_info_with_id(cur_id)

                        if "title" in paper_info:
                            article_title = paper_info["title"]
                            similarity = difflib.SequenceMatcher(
                                None, new_name.lower(), article_title.lower()
                            ).ratio()
                            logger.warning(
                                f"Compared with: {new_name}, Found paper: {article_title} with similarity {similarity}"
                            )

                            if similarity > highest_similarity:
                                highest_similarity = similarity
                                best_info = paper_info
                                best_match = cur_id
                            if similarity > 0.9:
                                break
                        else:
                            logger.warning(f"Article Title not found")
                except Exception as e:
                    traceback.print_exc()

            if highest_similarity > 0.9:
                break
            logger.warning(f"Not Found: {query}")

            if highest_similarity > 0.9:
                break
            else:
                best_match = None
                best_info = None
                highest_similarity = 0.0

        if best_match is not None:
            return highest_similarity, best_match, best_info

        return 0.0, None, None

    def download_paper(self, name: str, max_results, id=None):
        logger.error(
            f"******************** Searching for paper: {name} *******************"
        )

        if id is not None:
            best_match = id
            best_info = self.get_paper_info_with_id(id)

            download_list = self.bib_search_pubmed.download_by_object(
                best_match, best_info, self.download_folder
            )

            return download_list
        else:
            name = unicodedata.normalize("NFKC", name)

            highest_similarity, best_match, best_info = self.find_paper_from_pubmed(
                name, max_results
            )

            time.sleep(0.1)

            if highest_similarity > 0.9:
                logger.info(
                    f"Best match found: {best_match} with similarity {highest_similarity}"
                )

                time.sleep(0.1)
                download_list = self.bib_search_pubmed.download_by_object(
                    best_match, best_info, self.download_folder
                )
                # self.bib_search_arxiv.download_by_wget(best_match, download_folder)

                return download_list
            else:
                logger.warning(f"Failed to fetch paper with pubmed: {name}")
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


if __name__ == "__main__":
    pubmed_fetcher = PubMedFetcher()
    pubmed_fetcher.download_paper(
        name="Metabolic regulation of misfolded protein import into mitochondria",
        max_results=5,
    )
