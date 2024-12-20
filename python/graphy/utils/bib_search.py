import json
import time
import re
import requests
import logging
import difflib
import shutil
import uuid
import traceback

import undetected_chromedriver as uc
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium_stealth import stealth
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from webdriver_manager.core.driver_cache import DriverCacheManager
from selectolax.lexbor import LexborHTMLParser
from selenium.common.exceptions import TimeoutException
from fake_useragent import UserAgent
from typing import List, Dict, Callable
import time, random, re
import os
import time
import threading

from google_scholar_py import CustomGoogleScholarOrganic
from .string_similarity import StringSimilarity

logger = logging.getLogger(__name__)


class BibSearch:
    def __init__(self, persist_store, meta_folder) -> None:
        self.core = None
        self.meta_folder = meta_folder
        self.persist_store = persist_store

    def search_by_name(self, query) -> List[str]:
        logger.error("Interface not implemented")
        pass

    def search_by_id(self, id) -> List[str]:
        logger.error("Interface not implemented")
        pass

    def search_by_object(self, object) -> List[str]:
        logger.error("Interface not implemented")
        pass

    def download_by_name(self, query: str, download_path):
        logger.error("Interface not implemented")
        pass

    def download_by_object(self, object, download_path):
        logger.error("Interface not implemented")
        pass


class BibSearchGoogleScholar(BibSearch, CustomGoogleScholarOrganic):
    file_lock = threading.Lock()
    last_request_google_scholar = 0
    google_scholar_request_lock = threading.Lock()

    def __init__(
        self, persist_store=None, web_data_folder="", meta_folder="", proxy_manager=None
    ) -> None:
        BibSearch.__init__(self, persist_store=persist_store, meta_folder=meta_folder)
        CustomGoogleScholarOrganic.__init__(self)

        self.driver_version = self.get_driver_version()
        logger.debug(f"Get Driver Version {self.driver_version}")

        self.web_data_folder = web_data_folder

        self.request_interval = 0

        self.proxy_manager = proxy_manager

    def _formulate_query(self, query):
        return re.sub(r"[^a-zA-Z0-9, ]", "_", query.strip())

    def _update_proxy(self, driver, cur_web_data_dir, query):
        if self.proxy_manager:
            self.proxy_manager.delete_proxy()
            self.proxy_manager.set_proxy()
            driver, cur_web_data_dir = self._reinit_driver(
                query=query,
                driver=driver,
                webdata=cur_web_data_dir,
            )
        return driver, cur_web_data_dir

    def safe_request(self, driver, link):
        output_str = ""
        with BibSearchGoogleScholar.google_scholar_request_lock:
            logger.info(f"inside request: {link} {time.time()}")
            time_to_wait = 0
            interval = time.time() - BibSearchGoogleScholar.last_request_google_scholar
            if interval < self.request_interval:
                time_to_wait = (
                    random.uniform(self.request_interval, self.request_interval + 6)
                    - interval
                )

                time.sleep(time_to_wait)

            logger.warning(f"Time Issues: {time.time()} - {time_to_wait} {link}")

            try:
                driver.get(link)
            except Exception as e:
                logger.error(e)
                output_str = str(e)

            BibSearchGoogleScholar.last_request_google_scholar = time.time()

        return driver, output_str

    def get_driver_version(self):
        try:
            with open("chrome_driver_version.log", "r") as f:
                lines = f.readlines()
                if len(lines) == 0:
                    return None
                else:
                    return lines[0].strip()
        except:
            return None

    def write_driver_version(self, driver_version):
        with open("chrome_driver_version.log", "w") as f:
            f.write(driver_version)

    def _enrich_webdata_dir(self, query: str):
        if query != "":
            folder_name = str(uuid.uuid5(uuid.NAMESPACE_DNS, query + str(time.time())))
        else:
            folder_name = str(uuid.uuid5(uuid.NAMESPACE_DNS, time.time()))
        cur_web_data_dir = os.path.join(self.web_data_folder, folder_name)
        return cur_web_data_dir

    def _init_driver(self, query=""):
        # selenium stealth
        cur_web_data_dir = self._enrich_webdata_dir(query)
        driver = uc.Chrome(headless=True, use_subprocess=False)

        return driver, cur_web_data_dir

    def _quit_driver(self, driver, webdata):
        driver.quit()

        # try:
        #     shutil.rmtree(webdata)
        # except OSError as e:
        #     traceback.print_exc()

    def _reinit_driver(self, query, driver, webdata):
        self._quit_driver(driver=driver, webdata=webdata)
        driver, cur_web_data_dir = self._init_driver(query)
        return driver, cur_web_data_dir

    def _get_citations(self, link):
        try:
            citation_driver, cur_web_data_dir = self._init_driver(link)
        except Exception as e:
            traceback.print_exc()

        gathered_citations = {}

        # if "&hl=" in link:
        #     en_link = re.sub(r"&hl=.*?(&|$)", "&hl=en\1", link)

        #     try:
        #         citation_driver, _ = self.safe_request(
        #             driver=citation_driver,
        #             link=en_link,
        #         )
        #     except Exception as e:
        #         traceback.print_exc()

        #     wait = WebDriverWait(citation_driver, 10)

        #     try:
        #         # Wait for elements with class 'gs_cith' to become present
        #         cith_elements = wait.until(
        #             EC.presence_of_all_elements_located((By.CLASS_NAME, "gs_cith"))
        #             or (
        #                 "not a robot" in citation_driver.page_source
        #                 or "may be sending automated queries"
        #                 in citation_driver.page_source
        #                 or "您的计算机网络中存在异常流量" in citation_driver.page_source
        #                 or "人机身份验证" in citation_driver.page_source
        #             )
        #         )
        #         print(f"Found {len(cith_elements)} elements with class 'gs_cith'")
        #     except Exception as e:
        #         print(f"An error occurred when getting citations: {e}")

        #     cith_elements = citation_driver.find_elements(By.CLASS_NAME, "gs_cith")
        #     citr_elements = citation_driver.find_elements(By.CLASS_NAME, "gs_citr")

        #     for cith, citr in zip(cith_elements, citr_elements):
        #         if cith.text not in gathered_citations:
        #             gathered_citations[cith.text] = (
        #                 citr.text.strip().replace("\n", "").replace("-\n", "")
        #             )

        if "&hl=" in link:
            en_link = re.sub(r"&hl=.*?(&|$)", "&hl=zh-CN\1", link)
            citation_driver, _ = self.safe_request(
                driver=citation_driver,
                link=en_link,
            )

            wait = WebDriverWait(citation_driver, 10)

            try:
                # Wait for elements with class 'gs_cith' to become present
                cith_elements = wait.until(
                    EC.presence_of_all_elements_located((By.CLASS_NAME, "gs_cith"))
                    or (
                        "not a robot" in citation_driver.page_source
                        or "may be sending automated queries"
                        in citation_driver.page_source
                        or "您的计算机网络中存在异常流量" in citation_driver.page_source
                        or "人机身份验证" in citation_driver.page_source
                    )
                )
                print(f"Found {len(cith_elements)} elements with class 'gs_cith'")
            except Exception as e:
                print(f"An error occurred when getting citations: {e}")
                print(citation_driver.page_source)
            # print(citation_driver.page_source)

            cith_elements = citation_driver.find_elements(By.CLASS_NAME, "gs_cith")
            citr_elements = citation_driver.find_elements(By.CLASS_NAME, "gs_citr")

            for cith, citr in zip(cith_elements, citr_elements):
                if cith.text not in gathered_citations:
                    gathered_citations[cith.text] = (
                        citr.text.strip().replace("\n", "").replace("-\n", "")
                    )

        self._quit_driver(citation_driver, webdata=cur_web_data_dir)

        return gathered_citations

    def _get_paper_id(self, info):
        title_word = ""
        if "Title" in info:
            word_pattern = r"\b[A-Za-z]+\b"
            title_match = re.search(word_pattern, info["Title"])
            if title_match:
                title_word = title_match.group(0).lower()

        author_word = ""
        if "Author" in info:
            author_match = re.search(word_pattern, info["Author"])
            if author_match:
                author_word = author_match.group(0).lower()

        paper_id = title_word + info.get("Year", "") + author_word
        return paper_id

    def _search_by_object(self, gathered_citations):
        # print("************ GATHERED CITATIONS *************")
        # print(gathered_citations)
        info = {}
        # Author
        if "MLA" in gathered_citations:
            info["Author"] = gathered_citations["MLA"].split('"')[0]

        # Title
        if "MLA" in gathered_citations:
            info["Title"] = gathered_citations["MLA"].split('"')[1].strip()

        # Journal or Inproceedings
        if "GB/T 7714" in gathered_citations:
            if "[J]." in gathered_citations["GB/T 7714"]:
                info["Type"] = "journal"
            elif "[C]//" in gathered_citations["GB/T 7714"]:
                info["Type"] = "inproceedings"
            else:
                info["Type"] = "unknown"

        # Year
        if "APA" in gathered_citations:
            year_pattern = r"\.\s\((1|2)\d{3}\)\."
            year_pattern_backup = r"\.\s\((1|2)\d{3},\s[A-Za-z]+\)\."
            match = re.search(year_pattern, gathered_citations["APA"])

            if match:
                four_digit_number = match.group(0)[
                    match.group(0).find("(") + 1 : match.group(0).find(")")
                ]
                info["Year"] = four_digit_number.strip()
            else:
                match = re.search(year_pattern_backup, gathered_citations["APA"])
                if match:
                    four_digit_number = match.group(0)[
                        match.group(0).find("(") + 1 : match.group(0).find(",")
                    ]
                    info["Year"] = four_digit_number.strip()

        # Volumn & Number
        if "GB/T 7714" in gathered_citations:
            if info["Type"] == "journal":
                vol_num_pattern = r"(\d+\(\d+\))[:\.]"
                matches = re.findall(vol_num_pattern, gathered_citations["GB/T 7714"])

                if matches:
                    info["Volumn"] = matches[-1].strip().split("(")[0].strip()
                    info["Number"] = (
                        matches[-1].strip().split("(")[1].split(")")[0].strip()
                    )
        if "APA" in gathered_citations:
            if info["Type"] == "inproceedings":
                vol_num_pattern = r"Vol\.\s*(\d+)"
                matches = re.findall(vol_num_pattern, gathered_citations["APA"])

                if matches:
                    info["Volumn"] = matches[-1].strip()

        # Pages
        if "APA" in gathered_citations:
            if info["Type"] == "inproceedings":
                page_pattern = r"pp\.\s*(.*?)\s*\)"
                match = re.search(page_pattern, gathered_citations["APA"])

                if match:
                    info["Pages"] = match.group(1).strip()
        if "GB/T 7714" in gathered_citations:
            if info["Type"] == "journal":
                page_pattern = r":\s*(.*?)\."
                matches = re.findall(page_pattern, gathered_citations["GB/T 7714"])

                if matches:
                    info["Pages"] = matches[-1].strip()

        # Publication
        if "GB/T 7714" in gathered_citations:
            if info["Type"] == "inproceedings":
                pub_pattern = r"\[C\]//\s*(.*?)(?=,\s*\d{4}|\.)"
            elif info["Type"] == "journal":
                pub_pattern = r"\[J\]\.\s*(.*?)(?=,\s*\d{4}|\.)"
            else:
                pub_pattern = ""
            match = re.search(pub_pattern, gathered_citations["GB/T 7714"])

            if match:
                result = match.group(1).strip()  # 获取匹配的部分
                next_part = gathered_citations["GB/T 7714"][match.end() :].strip()

                if re.match(r"^,\s*\d{4}", next_part):
                    match = re.search(r"^(,\s*\d{4})", next_part)
                    if match:
                        result += match.group(1)

                info["Publication"] = result

        return info

    def _formulate_result(self, info):
        items = [
            "Author",
            "Title",
            "Year",
            "Volumn",
            "Number",
            "Pages",
            "Publication",
        ]

        if "Type" not in info or info["Type"] == "unknown":
            return [""]

        word_pattern = r"\b[A-Za-z]+\b"
        title_match = re.search(word_pattern, info["Title"])
        if title_match:
            title_word = title_match.group(0).lower()
        else:
            title_word = ""

        author_match = re.search(word_pattern, info["Author"])
        if author_match:
            author_word = author_match.group(0).lower()
        else:
            author_word = ""

        paper_id = title_word + info.get("Year", "") + author_word

        lines = ["@" + info["Type"] + "{" + paper_id]
        for item in items:
            if item not in info:
                continue

            if item == "Publication":
                lines.append("%-13s = {%s}" % (info["Type"], info["Publication"]))
            else:
                lines.append("%-13s = {%s}" % (item, info[item]))

        return [(", ").join(lines) + "}"]
        # return [("," + os.linesep).join(lines) + os.linesep + "}"]

    def _get_cited_by_paper_names(self, driver, link, max_results=50):
        cited_by = []
        page_num = 0

        link_params = {}
        link_header = link.split("?")[0]
        link_body = link.split("?")[1]
        link_param_list = link_body.split("&")

        for link_param in link_param_list:
            if "cites=" in link_param:
                link_params["cites"] = link_param
            elif "as_sdt=" in link_param:
                link_params["as_sdt"] = link_param
            elif "sciodt=" in link_param:
                link_params["sciodt"] = link_param
            elif "hl" in link_param:
                link_params["hl"] = link_param

        try:
            cited_by_driver, cur_web_data_dir = self._init_driver(link)
        except Exception as e:
            traceback.print_exc()

        try:
            while page_num <= max_results:
                # parse all pages

                if page_num == 0:
                    refined_link = f"{link}"
                else:
                    refined_link = f"{link_header}?start={str(page_num)}&{link_params['hl']}&{link_params['as_sdt']}&{link_params['sciodt']}&{link_params['cites']}"
                    # refined_link = f"{link_header}?start={str(page_num)}&{link_params['hl']}&{link_params['as_sdt']}&{link_params['sciodt']}&{link_params['cites']}&scipsc="

                retry_times = 0
                max_retry_times = 3

                while retry_times <= max_retry_times:
                    retry_times += 1
                    cited_by_driver, output_str = self.safe_request(
                        driver=cited_by_driver,
                        link=refined_link,
                    )

                    if "ERR_CONNECTION_RESET" in output_str:
                        logger.error("ERR_CONNECTION_RESET")
                        logger.error(f"===== TO RETRY {retry_times}/{max_retry_times}")
                        cited_by_driver, cur_web_data_dir = self._update_proxy(
                            driver=cited_by_driver,
                            cur_web_data_dir=cur_web_data_dir,
                            query=link,
                        )
                        time.sleep(random.uniform(8, 15))
                        continue

                    logger.error(f"this link: {refined_link}")

                    get_content = True
                    try:
                        WebDriverWait(cited_by_driver, 10).until(
                            self.finish_load_condition()
                        )
                    except TimeoutException as e:
                        logger.error(f"Cannot Get Cited by Timeout Error: {e}")
                        # logger.error(f"the result is {driver.page_source}")
                        get_content = False
                    except Exception as e:
                        logger.error(f"Cannot Get Cited by Error: {e}")
                        get_content = False

                    if (
                        "not a robot" in cited_by_driver.page_source
                        or "may be sending automated queries"
                        in cited_by_driver.page_source
                        or "您的计算机网络中存在异常流量" in cited_by_driver.page_source
                        or "人机身份验证" in cited_by_driver.page_source
                    ):
                        logger.error(
                            "============== DETECTED AS A SPIDER ==============="
                        )
                        logger.error(f"===== TO RETRY {retry_times}/{max_retry_times}")
                        cited_by_driver, cur_web_data_dir = self._update_proxy(
                            driver=cited_by_driver,
                            cur_web_data_dir=cur_web_data_dir,
                            query=link,
                        )
                        time.sleep(random.uniform(8, 15))
                    elif "ERR_CONNECTION_ABORTED" in cited_by_driver.page_source:
                        logger.error("CONNECTION ERROR")
                        cited_by_driver, cur_web_data_dir = self._update_proxy(
                            driver=cited_by_driver,
                            cur_web_data_dir=cur_web_data_dir,
                            query=link,
                        )
                    else:
                        break

                parser = LexborHTMLParser(cited_by_driver.page_source)

                if get_content:
                    for result in parser.css(".gs_r.gs_or.gs_scl"):
                        try:
                            title: str = result.css_first(".gs_rt a").text()
                            cited_by.append(title)
                        except:
                            title = None

                if len(cited_by) > max_results:
                    break

                # pagination
                if parser.css_first(
                    ".gs_ico_nav_next"
                ):  # checks for the "Next" page button
                    page_num += 10  # paginate to the next page
                    time.sleep(random.uniform(0.2, 1))  # sleep between paginations
                else:
                    break
        except Exception as e:
            logger.warning(f"{e}")
        finally:
            self._quit_driver(driver=cited_by_driver, webdata=cur_web_data_dir)

        return cited_by[:max_results]

    def parse(
        self,
        driver,
        query,
        parser,
        mode="vague",
        action="bib",
        download_path="",
        num_per_page=1,
    ):
        outputs = []

        for result in parser.css(".gs_r.gs_or.gs_scl"):
            try:
                title: str = result.css_first(".gs_rt a").text()
            except:
                title = str(time.time())

            if mode == "exact":
                if self._formulate_query(title).lower() in query.lower():
                    similarity = 1
                else:
                    similarity = StringSimilarity.ratio_similarity(
                        title.lower(), query.lower()
                    )
                    # similarity = StringSimilarity.semantic_similarity(
                    #     title.lower(), query.lower()
                    # )
                # similarity = difflib.SequenceMatcher(
                #     None, title.lower(), query.lower()
                # ).ratio()
                # similarity = StringSimilarity.semantic_similarity(
                #     title.lower(), query.lower()
                # )
                logger.info(
                    f"Scholar compared with: {query}, Found paper: {title} with similarity {similarity}"
                )

                if similarity < 0.8:
                    continue
            elif mode == "vague":
                logger.info(f"Get Paper {title}")
            else:
                logger.error(f"Unknown mode {mode}")

            if action == "bib":
                this_bib = None
                try:
                    directory = parser.css_first("#gs_citd")
                    cite_directory = (
                        "https://scholar.google.com" + directory.attrs["data-u"]
                    )
                    cite_directory = cite_directory.replace("{p}", "0")

                    this_bib = self.get_bib(driver, title, result, cite_directory)

                    # if (
                    #     "cited_by_link" in this_bib
                    #     and this_bib["cited_by_link"] is not None
                    #     and len(this_bib["cited_by_link"]) > 0
                    # ):
                    #     this_bib["cited_by"] = self._get_cited_by_paper_names(
                    #         driver, this_bib["cited_by_link"]
                    #     )
                except Exception as e:
                    logger.warning(f"Download Meta Failed: {e}")
                    this_bib = {}

                outputs.append(this_bib)

            elif action == "download":
                logger.error("start to download")
                succ, file_path, file_name, exist = self.download(
                    driver, title, result, download_path
                )
                logger.error("finish to download")

                if not succ and not exist:
                    logger.warning(f"Found {title}, but download failed.")
                elif not succ and exist:
                    logger.warning(f"Found {title}, but already downloaded.")

                meta_file_path = None
                this_bib = None
                try:
                    if self.meta_folder and self.persist_store:
                        meta_file_path = os.path.join(
                            self.persist_store.output_folder,
                            self.meta_folder,
                            file_name + ".json",
                        )
                        if not self.persist_store.get_state(
                            self.meta_folder, file_name
                        ):
                            directory = parser.css_first("#gs_citd")
                            cite_directory = (
                                "https://scholar.google.com" + directory.attrs["data-u"]
                            )
                            cite_directory = cite_directory.replace("{p}", "0")

                            this_bib = self.get_bib(
                                driver, title, result, cite_directory
                            )

                            if (
                                "cited_by_link" in this_bib
                                and this_bib["cited_by_link"] is not None
                                and len(this_bib["cited_by_link"]) > 0
                            ):
                                this_bib["cited_by"] = self._get_cited_by_paper_names(
                                    driver, this_bib["cited_by_link"]
                                )
                except Exception as e:
                    if this_bib is None:
                        meta_file_path = None
                    logger.warning(f"Download Meta Failed: {e}")
                finally:
                    if meta_file_path is not None and this_bib is not None:
                        self.persist_store.save_state(
                            self.meta_folder, file_name, this_bib
                        )
                if succ and meta_file_path:
                    outputs.append((True, file_path, meta_file_path, exist))
                elif succ and not meta_file_path:
                    outputs.append((True, file_path, meta_file_path, exist))
                elif not succ and meta_file_path:
                    outputs.append((True, None, meta_file_path, exist))
                elif not succ and not meta_file_path:
                    outputs.append((False, None, meta_file_path, exist))

            if len(outputs) >= num_per_page:
                break

            break

        return outputs

    def get_bib(self, driver, title, result, cite_directory):
        try:
            paper_id = result.css_first(".gs_r.gs_or.gs_scl").attrs["data-cid"]
        except:
            paper_id = None

        try:
            title: str = result.css_first(".gs_rt a").text()
        except:
            title = None

        try:
            title_link: str = result.css_first(".gs_rt a").attrs["href"]
        except:
            title_link = None

        try:
            publication_info: str = result.css_first(".gs_a").text()
        except:
            publication_info = None

        try:
            snippet: str = result.css_first(".gs_rs").text()
        except:
            snippet = None

        try:
            # if Cited by is present in inline links, it will be extracted
            cited_by_link = "".join(
                [
                    link.attrs["href"]
                    for link in result.css(".gs_ri .gs_fl a")
                    if "Cited by" in link.text() or "被引用次数" in link.text()
                ]
            )
        except:
            cited_by_link = None

        try:
            # if Cited by is present in inline links, it will be extracted and type cast it to integer
            cited_by_count = int(
                "".join(
                    [
                        re.search(r"\d+", link.text()).group()
                        for link in result.css(".gs_ri .gs_fl a")
                        if "Cited by" in link.text() or "被引用次数" in link.text()
                    ]
                )
            )
        except:
            cited_by_count = None

        try:
            pdf_file: str = result.css_first(".gs_or_ggsm a").attrs["href"]
        except:
            pdf_file = None

        bib = None
        # try:
        #     if cite_directory is not None and paper_id is not None:
        #         bib = ""
        #         cite_directory = cite_directory.replace("{id}", paper_id)

        #         try:
        #             logger.debug("start to find element")
        #             element = WebDriverWait(driver, 10).until(
        #                 EC.element_to_be_clickable(
        #                     (By.CSS_SELECTOR, ".gs_or_cit.gs_or_btn.gs_nph")
        #                 )
        #             )

        #             logger.error(f"find element: {element}")
        #             element.click()
        #         except TimeoutException:
        #             print("Cannot click in 10 seconds")
        #         except Exception as e:
        #             traceback.print_exc()

        #         for i in range(100):
        #             try:
        #                 driver.find_element(By.XPATH, f"//a[text()='BibTeX']").click()
        #                 break
        #             except:
        #                 time.sleep(0.1)

        #         for i in range(100):
        #             try:
        #                 for element in driver.find_elements(By.TAG_NAME, "pre"):
        #                     bib += element.text
        #                 break
        #             except:
        #                 time.sleep(0.1)
        # except:
        #     bib = None

        # bib = None
        try:
            cite_directory = cite_directory.replace("{id}", paper_id)
            # logger.warning(f"inside: {cite_directory}")
            gathered_citations = self._get_citations(cite_directory)
            logger.warning(f"gathered citations are: {gathered_citations}")
            bib_info = self._search_by_object(gathered_citations)
            logger.warning(f"bib info is {bib_info}")
            paper_id = self._get_paper_id(bib_info)
        except Exception as e:
            logger.error(
                f"Some key citations are missing. Maybe because of chinese literatures: {e}"
            )
            gathered_citations = None
            bib_info = None
            paper_id = None

        if bib_info is not None and (bib is None or len(bib.strip()) == 0):
            bib = self._formulate_result(bib_info)[0]

        return {
            "title": title,
            "id": paper_id,
            "title_link": title_link,
            "publication_info": publication_info,
            "snippet": snippet if snippet else None,
            "cited_by_link": (
                f"https://scholar.google.com{cited_by_link}" if cited_by_link else None
            ),
            "cited_by_count": cited_by_count if cited_by_count else None,
            "pdf_file": pdf_file,
            "bib_info": bib_info,
            "bib": bib,
        }

    def search_by_name(
        self, query: str, pagination: bool = False, mode: str = "vague"
    ) -> List[str]:
        driver, cur_web_data_dir = self._init_driver(query=query)
        # driver = self._init_driver()
        organic_results_data = []

        try:
            page_num = 0
            if mode == "exact":
                new_queries = sorted(
                    [
                        s
                        for s in re.split(r"[.\\/]", query.strip())
                        if len(s) >= 20 and s.count(",") <= 5
                    ],
                    key=len,
                    reverse=True,
                )
            else:
                new_queries = [query]

            # logger.debug("======= NEW QUERIES ==============", new_queries)
            for query in new_queries:
                # parse all pages
                if pagination:
                    while page_num <= 10:
                        # parse all pages (the first two pages)
                        pruned_query = self._formulate_query(query)
                        driver, _ = self.safe_request(
                            driver=driver,
                            link=f"https://scholar.google.com/scholar?q={pruned_query}&hl=en&gl=us&start={page_num}",
                        )

                        WebDriverWait(driver, 10).until(
                            EC.presence_of_element_located(
                                (By.CSS_SELECTOR, "div.gs_r.gs_or.gs_scl")
                            )
                        )

                        parser = LexborHTMLParser(driver.page_source)

                        outputs = self.parse(driver, query, parser, mode, "bib")
                        organic_results_data.extend(outputs)

                        if mode == "exact" and len(organic_results_data) > 0:
                            break

                        # pagination
                        if parser.css_first(
                            ".gs_ico_nav_next"
                        ):  # checks for the "Next" page button
                            page_num += 10  # paginate to the next page
                            time.sleep(
                                random.uniform(0.2, 1)
                            )  # sleep between paginations
                        else:
                            break
                else:
                    # parse first page only
                    # logger.error("### START TO DOWNLOAD #####")
                    pruned_query = self._formulate_query(query)
                    # logger.error(pruned_query)

                    retry_times = 0
                    max_retry_times = 3

                    while retry_times <= max_retry_times:
                        retry_times += 1
                        driver, output_str = self.safe_request(
                            driver=driver,
                            link=f"https://scholar.google.com/scholar?q={pruned_query}&hl=zh-CN&as_sdt=0,5&start={page_num}&oq=",
                            # link=f"https://scholar.google.com/scholar?q={pruned_query}&hl=en&gl=us&as_sdt=0,5&start={page_num}",
                        )

                        if "ERR_CONNECTION_RESET" in output_str:
                            logger.error("ERR_CONNECTION_RESET")
                            logger.error(
                                f"===== TO RETRY {retry_times}/{max_retry_times}"
                            )
                            driver, cur_web_data_dir = self._update_proxy(
                                driver=driver,
                                cur_web_data_dir=cur_web_data_dir,
                                query=query,
                            )
                            time.sleep(random.uniform(8, 15))
                            continue

                        try:
                            WebDriverWait(driver, 10).until(
                                self.finish_load_condition()
                            )
                        except TimeoutException as e:
                            logger.error(f"Cannot Get Paper by Timeout Error: {e}")
                            # logger.error(driver.page_source)
                        except Exception as e:
                            logger.error(f"Cannot Get Paper by Error: {e}")

                        parser = LexborHTMLParser(driver.page_source)

                        if len(parser.css(".gs_r.gs_or.gs_scl")) == 0:
                            if (
                                "not a robot" in driver.page_source
                                or "may be sending automated queries"
                                in driver.page_source
                                or "您的计算机网络中存在异常流量" in driver.page_source
                                or "人机身份验证" in driver.page_source
                            ):
                                logger.error(
                                    f"============== DETECTED AS A ROBOT {query} ============="
                                )
                                logger.error(
                                    f"https://scholar.google.com/scholar?q={pruned_query}&hl=en&gl=us&start={page_num}"
                                )
                                logger.error(
                                    f"===== TO RETRY {retry_times}/{max_retry_times}"
                                )
                                driver, cur_web_data_dir = self._update_proxy(
                                    driver=driver,
                                    cur_web_data_dir=cur_web_data_dir,
                                    query=query,
                                )
                                time.sleep(random.uniform(8, 15))
                            elif "ERR_CONNECTION_ABORTED" in driver.page_source:
                                logger.error("CONNECTION ERROR")
                                driver, cur_web_data_dir = self._update_proxy(
                                    driver=driver,
                                    cur_web_data_dir=cur_web_data_dir,
                                    query=query,
                                )

                            else:
                                break
                            # with open("fail_log.log", "a") as f:
                            #     f.write(query + "\n")
                            #     f.write("no label\n")
                            #     f.write(driver.page_source)
                        else:
                            break

                    outputs = self.parse(driver, query, parser, mode, "bib")
                    organic_results_data.extend(outputs)
        except Exception as e:
            raise
        finally:
            self._quit_driver(driver=driver, webdata=cur_web_data_dir)

        if len(organic_results_data) > 0:
            return organic_results_data[0]
        else:
            return None

    def download(self, driver, title, result, download_path):
        file_name = re.sub(r"[^a-zA-Z0-9]", "_", title.strip())
        scholar_name = f"scholar_{file_name}"
        file_path = os.path.join(download_path, f"{scholar_name}.pdf")

        if os.path.exists(file_path):
            logger.debug(f"The file '{file_path}' already exists.")
            return True, file_path, scholar_name, True

        logger.error("************ DOWNLOADING **************")
        logger.error(file_path)

        try:
            pdf_link: str = result.css_first(".gs_or_ggsm a").attrs["href"]

            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36",
                "referer": "https://scholar.google.com/",
            }
            response = requests.get(pdf_link, headers=headers)

            if response.status_code == 200:
                with open(file_path, "wb") as f:
                    f.write(response.content)
                logger.info(f"Downloaded: {file_name}")
                return True, file_path, scholar_name, False
            else:
                logger.warning(
                    f"Failed to download. Status code: {response.status_code}. Try to fix ..."
                )

                with open("fail_log.log", "a") as f:
                    f.write(file_path + "\n")
                    # f.write(pdf_link + "\n")
                    f.write("STATUS CODE: " + str(response.status_code) + "\n")
                    f.write("\n")
        except Exception as e:
            logger.error(f"Download failed: {e}")
            with open("fail_log.log", "a") as f:
                f.write(file_path + "\n")
                # f.write(pdf_link + "\n")
                f.write(str(e) + "\n")
                f.write("\n")

        return False, file_path, scholar_name, False

    def finish_load_condition(self):
        def condition_met(driver):
            try:
                element_present = EC.presence_of_element_located(
                    (By.CSS_SELECTOR, "div.gs_r.gs_or.gs_scl")
                )(driver)
            except Exception:
                element_present = False

            if not element_present:
                try:
                    element_present = EC.presence_of_element_located(
                        (By.ID, "gs_res_ccl_mid")
                    )(driver)
                except Exception:
                    element_present = False

            text_present = (
                "not a robot" in driver.page_source
                or "may be sending automated queries" in driver.page_source
                or "您的计算机网络中存在异常流量" in driver.page_source
                or "人机身份验证" in driver.page_source
            )

            return element_present or text_present

        return condition_met

    def download_by_name(
        self, query: str, download_path, pagination: bool = False, mode: str = "vague"
    ) -> List[str]:

        driver, cur_web_data_dir = self._init_driver(query=query)
        # driver = self._init_driver()

        try:
            page_num = 0
            if mode == "exact":
                new_queries = sorted(
                    [
                        s
                        for s in re.split(r"[,.\\/]", query.strip())
                        if len(s) >= 20 and s.count(",") <= 5
                    ],
                    key=len,
                    reverse=True,
                )
            else:
                new_queries = [query]

            output_list = []

            found_paper = False
            # logger.debug("======= NEW QUERIES ==============", new_queries)
            for query in new_queries:
                # parse all pages
                if pagination:
                    while page_num <= 10:
                        # parse all pages (the first two pages)
                        pruned_query = self._formulate_query(query)
                        driver, _ = self.safe_request(
                            driver=driver,
                            link=f"https://scholar.google.com/scholar?q={pruned_query}&hl=en&gl=us&start={page_num}",
                        )

                        WebDriverWait(driver, 2).until(
                            EC.presence_of_element_located(
                                (By.CSS_SELECTOR, "div.gs_r.gs_or.gs_scl")
                            )
                        )

                        parser = LexborHTMLParser(driver.page_source)

                        succ_list = self.parse(
                            driver, query, parser, mode, "download", download_path
                        )

                        if len(succ_list) > 0:
                            found_paper = True
                            output_list.extend(succ_list)

                        # pagination
                        if parser.css_first(
                            ".gs_ico_nav_next"
                        ):  # checks for the "Next" page button
                            page_num += 10  # paginate to the next page
                            time.sleep(
                                random.uniform(0.2, 1)
                            )  # sleep between paginations
                        else:
                            break
                else:
                    # parse first page only
                    # logger.error("### START TO DOWNLOAD #####")
                    pruned_query = self._formulate_query(query)
                    # logger.error(pruned_query)

                    retry_times = 0
                    max_retry_times = 3

                    while retry_times <= max_retry_times:
                        retry_times += 1
                        driver, output_str = self.safe_request(
                            driver=driver,
                            link=f"https://scholar.google.com/scholar?q={pruned_query}&hl=zh-CN&as_sdt=0,5&start={page_num}",
                            # link=f"https://scholar.google.com/scholar?q={pruned_query}&hl=en&gl=us&as_sdt=0,5&start={page_num}",
                        )

                        if "ERR_CONNECTION_RESET" in output_str:
                            logger.error("ERR_CONNECTION_RESET")
                            logger.error(
                                f"===== TO RETRY {retry_times}/{max_retry_times}"
                            )
                            driver, cur_web_data_dir = self._update_proxy(
                                driver=driver,
                                cur_web_data_dir=cur_web_data_dir,
                                query=query,
                            )
                            time.sleep(random.uniform(8, 15))
                            continue

                        try:
                            WebDriverWait(driver, 10).until(
                                self.finish_load_condition()
                            )
                        except TimeoutException as e:
                            logger.error(f"Cannot Get Paper by Timeout Error: {e}")
                            # logger.error(driver.page_source)
                        except Exception as e:
                            logger.error(f"Cannot Get Paper by Error: {e}")

                        parser = LexborHTMLParser(driver.page_source)

                        if len(parser.css(".gs_r.gs_or.gs_scl")) == 0:
                            if (
                                "not a robot" in driver.page_source
                                or "may be sending automated queries"
                                in driver.page_source
                                or "您的计算机网络中存在异常流量" in driver.page_source
                                or "人机身份验证" in driver.page_source
                            ):
                                logger.error(
                                    f"============== DETECTED AS A ROBOT {query} ============="
                                )
                                logger.error(
                                    f"https://scholar.google.com/scholar?q={pruned_query}&hl=en&gl=us&start={page_num}"
                                )
                                logger.error(
                                    f"===== TO RETRY {retry_times}/{max_retry_times}"
                                )
                                driver, cur_web_data_dir = self._update_proxy(
                                    driver=driver,
                                    cur_web_data_dir=cur_web_data_dir,
                                    query=query,
                                )
                                time.sleep(random.uniform(8, 15))
                            elif "ERR_CONNECTION_ABORTED" in driver.page_source:
                                logger.error("CONNECTION ERROR")
                                driver, cur_web_data_dir = self._update_proxy(
                                    driver=driver,
                                    cur_web_data_dir=cur_web_data_dir,
                                    query=query,
                                )

                            else:
                                break
                            # with open("fail_log.log", "a") as f:
                            #     f.write(query + "\n")
                            #     f.write("no label\n")
                            #     f.write(driver.page_source)
                        else:
                            break

                    succ_list = self.parse(
                        driver, query, parser, mode, "download", download_path
                    )

                    if len(succ_list) > 0:
                        found_paper = True
                        output_list.extend(succ_list)

                    if not found_paper:
                        sleep_time = random.uniform(2, 3)
                        logger.info(f"sleep time: {sleep_time}")
                        time.sleep(sleep_time)
                if found_paper:
                    break
        except Exception as e:
            raise
        finally:
            self._quit_driver(driver=driver, webdata=cur_web_data_dir)

        return output_list


class BibSearchArxiv(BibSearch):
    def __init__(self, persist_store=None, meta_folder="") -> None:
        super().__init__(persist_store=persist_store, meta_folder=meta_folder)

    def format_json_object(self, paper_info):
        return {
            "title": paper_info.title,
            "id": paper_info.entry_id.strip().split("/")[-1],
            "author": paper_info.authors[0],
            # "author": " and ".join([str(author) for author in paper_info.authors]),
            "eprint": paper_info.entry_id,
            "doi": paper_info.doi,
            # "primary_class": paper_info.categories[0],
            # "abstract": paper_info.summary,
            "year": paper_info.published.year,
            "month": paper_info.published.month,
            "url": [str(link) for link in paper_info.links if link.title == "pdf"][0],
            "bib": self.search_by_object(paper_info),
        }

    def search_by_object(self, paper_info) -> List[str]:
        """BibTex string of the reference."""

        paper_info_id = paper_info.entry_id.strip().split("/")[-1]

        lines = ["@article{" + paper_info_id]
        for k, v in [
            ("Author", " and ".join([str(author) for author in paper_info.authors])),
            ("Title", paper_info.title),
            ("Eprint", paper_info.entry_id),
            ("DOI", paper_info.doi),
            ("ArchivePrefix", "arXiv"),
            ("PrimaryClass", paper_info.categories[0]),
            # ("Abstract", paper_info.summary),
            ("Year", paper_info.published.year),
            ("Month", paper_info.published.month),
            ("Url", [str(link) for link in paper_info.links if link.title == "pdf"][0]),
            ("File", paper_info_id + ".pdf"),
        ]:
            if v is not None:
                lines.append("%-13s = {%s}" % (k, v))

        return ("," + os.linesep).join(lines) + os.linesep + "}"

    def download_by_object(self, best_match, download_path):
        file_name = re.sub(r"[^a-zA-Z0-9]", "_", best_match.title.strip())

        arxiv_file_name = f"arxiv_{file_name}".lower()
        download_file_name = f"arxiv_{file_name}.pdf".lower()
        download_file_path = os.path.join(download_path, download_file_name)
        logger.debug(f"download to {download_file_path}")

        meta_file_path = None
        try:
            if self.meta_folder and self.persist_store:
                meta_file_path = os.path.join(
                    self.persist_store.output_folder,
                    self.meta_folder,
                    arxiv_file_name + ".json",
                )
                if not self.persist_store.get_state(self.meta_folder, arxiv_file_name):
                    self.persist_store.save_state(
                        self.meta_folder,
                        arxiv_file_name,
                        self.format_json_object(best_match),
                    )
        except Exception as e:
            meta_file_path = None
            logger.error(f"Download Meta Error: {e}")

        if os.path.exists(download_file_path):
            logger.error(f"The file '{download_file_path}' already exists.")
            return [(True, download_file_path, meta_file_path, True)]

        try:
            best_match.download_pdf(
                dirpath=download_path,
                filename=download_file_name,
            )
        except Exception as e:
            logger.error(f"{e}")
            if meta_file_path:
                return [(True, None, meta_file_path, False)]
            else:
                return [(False, None, None, False)]

        return [(True, download_file_path, meta_file_path, False)]

    def download_by_wget(self, best_match, download_folder):
        file_name = re.sub(r"[^a-zA-Z0-9]", "_", best_match.title.strip())
        pdf_file = os.path.join(download_folder, f"arxiv_{file_name}.pdf")
        pdf_link = best_match.pdf_url
        print(f"wget -O {pdf_file} {pdf_link}")
        os.system(f"wget -O {pdf_file} {pdf_link}")

        return [(True, pdf_file)]


class BibSearchPubMed(BibSearch):
    def __init__(self, persist_store=None, meta_folder="") -> None:
        super().__init__(persist_store=persist_store, meta_folder=meta_folder)

    def format_json_object(self, paper_id, paper_info):
        start_page = paper_info.get("start_page", "")
        end_page = paper_info.get("end_page", "")

        return {
            "title": paper_info["title"],
            "id": str(paper_id),
            "author": " and ".join(
                [
                    author.get("fore_name", "") + " " + author.get("last_name", "")
                    for author in paper_info.get("authors", [])
                ]
            ),
            "journal": paper_info.get("journal", {}).get("title", ""),
            "publish_year": paper_info.get("journal", {})
            .get("publish_time", {})
            .get("year", ""),
            "publish_month": paper_info.get("journal", {})
            .get("publish_time", {})
            .get("month", ""),
            "vol": paper_info.get("journal", {}).get("vol", ""),
            "issue": paper_info.get("journal", {}).get("issue", ""),
            "page": (
                ""
                if start_page == "" or end_page == ""
                else f"{start_page}--{end_page}"
            ),
            "abstract": paper_info.get("abstract", ""),
            "reference": [
                {
                    "citation": ref.get("citation", ""),
                    "pubmed_id": ref.get("ids", {}).get("pubmed", None),
                }
                for ref in paper_info.get("reference", [])
            ],
            "bib": self.search_by_object(paper_id, paper_info),
        }

    def search_by_object(self, paper_id, paper_info) -> List[str]:
        """BibTex string of the reference."""

        start_page = paper_info.get("start_page", "")
        end_page = paper_info.get("end_page", "")

        lines = ["@article{" + str(paper_id)]
        for k, v in [
            (
                "Author",
                " and ".join(
                    [
                        author.get("fore_name", "") + " " + author.get("last_name", "")
                        for author in paper_info.get("authors", [])
                    ]
                ),
            ),
            ("Title", paper_info["title"]),
            ("Abstract", paper_info.get("abstract", "")),
            (
                "Year",
                paper_info.get("journal", {}).get("publish_time", {}).get("year", ""),
            ),
            (
                "Month",
                paper_info.get("journal", {}).get("publish_time", {}).get("month", ""),
            ),
            ("Journal", paper_info.get("journal", {}).get("title", "")),
            ("Volume", paper_info.get("journal", {}).get("vol", "")),
            ("Issue", paper_info.get("journal", {}).get("issue", "")),
            (
                "Pages",
                (
                    ""
                    if start_page == "" or end_page == ""
                    else f"{start_page}--{end_page}"
                ),
            ),
        ]:
            if v is not None:
                lines.append("%-13s = {%s}" % (k, v))

        return ("," + os.linesep).join(lines) + os.linesep + "}"

    def download_by_object(self, best_match, best_info, download_path):
        file_name = re.sub(r"[^a-zA-Z0-9]", "_", best_info["title"].strip())

        pubmed_file_name = f"pubmed_{file_name}".lower()
        download_file_name = f"pubmed_{file_name}.pdf".lower()
        download_file_path = os.path.join(download_path, download_file_name)
        logger.debug(f"download to {download_file_path}")

        meta_file_path = None
        try:
            if self.meta_folder and self.persist_store:
                meta_file_path = os.path.join(
                    self.persist_store.output_folder,
                    self.meta_folder,
                    pubmed_file_name + ".json",
                )
                if not self.persist_store.get_state(self.meta_folder, pubmed_file_name):
                    self.persist_store.save_state(
                        self.meta_folder,
                        pubmed_file_name,
                        self.format_json_object(best_match, best_info),
                    )
        except Exception as e:
            meta_file_path = None
            logger.error(f"Download Meta Error: {e}")

        if os.path.exists(download_file_path):
            logger.error(f"The file '{download_file_path}' already exists.")
            return [(True, download_file_path, meta_file_path, True)]

        try:
            best_match.download_pdf(
                dirpath=download_path,
                filename=download_file_name,
            )
        except Exception as e:
            logger.error(f"Download PDF Error: {e}")
            if meta_file_path:
                return [(True, None, meta_file_path, False)]
            else:
                return [(False, None, None, False)]

        return [(True, download_file_path, meta_file_path, False)]

    def download_by_wget(self, best_match, download_folder):
        file_name = re.sub(r"[^a-zA-Z0-9]", "_", best_match.title.strip())
        pdf_file = os.path.join(download_folder, f"arxiv_{file_name}.pdf")
        pdf_link = best_match.pdf_url
        print(f"wget -O {pdf_file} {pdf_link}")
        os.system(f"wget -O {pdf_file} {pdf_link}")

        return [(True, pdf_file)]


if __name__ == "__main__":
    bib_search = BibSearchGoogleScholar(web_data_dir="webdata")
    data = bib_search.search_by_name(
        query="Algorithm 1000: SuiteSparse: GraphBLAS: Graph algorithmsin the language of sparse linear algebra",
        pagination=False,
        save_to_csv=False,
        save_to_json=False,
    )
    print(data)
    # print(json.dumps(data, indent=2))
