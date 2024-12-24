from apps.paper_reading import ProxyManager
from utils.scholar_fetcher import ScholarFetcher
import os
import logging
import csv
from concurrent.futures import ThreadPoolExecutor
import sys

sys.argv.append("-n")

logger = logging.getLogger()


def get_meta_from_paper(file_path, out_file_name, out_file_folder):
    proxy_manager = ProxyManager()

    with open(file_path, mode="r", encoding="utf-8") as csvfile:
        # Create a CSV reader object with '|' as the delimiter
        csv_reader = csv.reader(csvfile, delimiter="|")

        new_attrs = ["publication_info", "cited_by_count", "publication"]
        # Skip the header
        headers = next(csv_reader, None)
        for attr in new_attrs:
            headers.append(attr)
        print(f"Headers: {headers}")  # Optional: print the headers

        out_file_path = os.path.join(out_file_folder, out_file_name)
        past_line = 1539
        current_line = 0

        with open(out_file_path, mode="a", encoding="utf-8", newline="") as outfile:
            # Create a CSV writer object with '|' as the delimiter
            csv_writer = csv.writer(outfile, delimiter="|")

            # Write the updated headers to the output file
            if past_line == 0:
                csv_writer.writerow(headers)
            current_line += 1

            # Iterate over each remaining row
            for row in csv_reader:
                current_line += 1
                if current_line <= past_line:
                    continue
                print(f"Processing {row}")
                row_title = row[headers.index("title")]
                web_data_dir = os.path.join(
                    out_file_folder,
                    "tmp",
                    "webdata",
                )

                scholar_fetcher = ScholarFetcher(
                    persist_store=None,
                    download_folder="",
                    web_data_folder=web_data_dir,
                    meta_folder="",
                    proxy_manager=proxy_manager,
                )
                logger.error(
                    f"--------------  start to fetch: {row_title}  ------------------"
                )
                _, paper_info = scholar_fetcher.fetch_paper(row_title, mode="exact")

                if paper_info:
                    publication_info = paper_info.get("publication_info", "")
                    cited_by_count = paper_info.get("cited_by_count", "")
                    paper_publication = paper_info.get("bib_info", {}).get(
                        "Publication", ""
                    )
                    row.append(publication_info)
                    row.append(cited_by_count)
                    row.append(paper_publication)

                    url_index = headers.index("url")
                    bib_index = headers.index("bib")
                    authors_index = headers.index("authors")

                    if not row[url_index] or len(row[url_index]) == 0:
                        row[url_index] = paper_info.get("title_link", "")
                    if not row[bib_index] or len(row[bib_index]) == 0:
                        row[bib_index] = paper_info.get("bib", "")
                    if not row[authors_index] or len(row[authors_index]) == 0:
                        author_str = paper_info.get("bib_info", {}).get("Author", "")
                        parts = author_str.split(",")
                        result = []

                        if len(parts) < 2:
                            result = [author_str.strip()]
                        else:
                            combined_first = parts[0].strip() + ", " + parts[1].strip()

                            result = [combined_first]
                            for part in parts[2:]:
                                result.append(part.strip())
                        row[authors_index] = result

                        first_author_index = headers.index("author")
                        if len(result) > 0:
                            row[first_author_index] = result[0]
                else:
                    row.append("")
                    row.append("")
                    row.append("")

                print(f"Get new row {row}")
                # Write the updated row to the output file
                csv_writer.writerow(row)
                outfile.flush()


def write_it(rows, headers, out_file_path, progess):
    with open(out_file_path, mode="a", encoding="utf-8", newline="") as outfile:
        # Create a CSV writer object with '|' as the delimiter
        csv_writer = csv.writer(outfile, delimiter="|")
        proxy_manager = ProxyManager()

        counter = 0
        for row in rows:
            counter += 1
            if counter <= progess:
                continue
            print(f"Processing {row}")
            row_title = row[headers.index("title")]
            scholar_fetcher = ScholarFetcher(
                persist_store=None,
                download_folder="",
                web_data_folder="",
                meta_folder="",
                proxy_manager=proxy_manager,
            )
            logger.error(
                f"--------------  start to fetch: {row_title}  ------------------"
            )
            _, paper_info = scholar_fetcher.fetch_paper(row_title, mode="exact")

            if paper_info:
                publication_info = paper_info.get("publication_info", "")
                cited_by_count = paper_info.get("cited_by_count", "")
                paper_publication = paper_info.get("bib_info", {}).get(
                    "Publication", ""
                )
                row.append(publication_info)
                row.append(cited_by_count)
                row.append(paper_publication)

                url_index = headers.index("url")
                bib_index = headers.index("bib")
                authors_index = headers.index("authors")

                if not row[url_index] or len(row[url_index]) == 0:
                    row[url_index] = paper_info.get("title_link", "")
                if not row[bib_index] or len(row[bib_index]) == 0:
                    row[bib_index] = paper_info.get("bib", "")
                if not row[authors_index] or len(row[authors_index]) == 0:
                    author_str = paper_info.get("bib_info", {}).get("Author", "")
                    parts = author_str.split(",")
                    result = []

                    if len(parts) < 2:
                        result = [author_str.strip()]
                    else:
                        combined_first = parts[0].strip() + ", " + parts[1].strip()

                        result = [combined_first]
                        for part in parts[2:]:
                            result.append(part.strip())
                    row[authors_index] = result

                    first_author_index = headers.index("author")
                    if len(result) > 0:
                        row[first_author_index] = result[0]
            else:
                row.append("")
                row.append("")
                row.append("")

            print(f"Get new row {row}")
            # Write the updated row to the output file
            csv_writer.writerow(row)
            outfile.flush()


def get_meta_from_paper_parallel(file_path, out_file_name, out_file_folder):
    proxy_manager = ProxyManager()

    with open(file_path, mode="r", encoding="utf-8") as csvfile:
        # Create a CSV reader object with '|' as the delimiter
        csv_reader = csv.reader(csvfile, delimiter="|")

        new_attrs = ["publication_info", "cited_by_count", "publication"]
        # Skip the header
        headers = next(csv_reader, None)
        for attr in new_attrs:
            headers.append(attr)
        print(f"Headers: {headers}")  # Optional: print the headers

        past_line = 1181
        current_line = 0

        all_rows = []
        for row in csv_reader:
            all_rows.append(row)

        progess_list = [1180, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

        thread_num = 2
        k, m = divmod(len(all_rows), thread_num)
        tasks = (
            all_rows[i * k + min(i, m) : (i + 1) * k + min(i + 1, m)]
            for i in range(thread_num)
        )

        task_counter = 0
        with ThreadPoolExecutor(max_workers=thread_num) as executor:
            for task_list in tasks:
                out_file_path = os.path.join(
                    out_file_folder, f"out_para{task_counter}.csv"
                )
                executor.submit(
                    write_it,
                    task_list,
                    headers,
                    out_file_path,
                    progess_list[task_counter],
                )
                task_counter += 1


if __name__ == "__main__":
    get_meta_from_paper(
        file_path="/Users/louyk/Desktop/Projects/SIGMOD Demo graphy/_graph/Paper.csv",
        out_file_name="out.csv",
        out_file_folder="/Users/louyk/Desktop/Projects/SIGMOD Demo graphy/output",
    )
