import requests
import time
import pandas as pd

def get_top_llm_repos():
    url = "https://api.github.com/search/repositories"
    params = {
        'q': 'llm',
        'sort': 'stars',
        'order': 'desc',
        'per_page': 100
    }
    headers = {'User-Agent': 'PythonScript/1.0'}

    try:
        print("Fetching top LLM repositories from GitHub...")
        response = requests.get(url, params=params, headers=headers)
        response.raise_for_status()
        data = response.json()

        print(f"Found {data['total_count']} repositories. Showing top 100:")
        print("Top 100 LLM Repositories on GitHub:")
        print("="*60)

        repos = []
        for i, repo in enumerate(data['items'], 1):
            repo_info = {
                'rank': i,
                'name': repo['name'],
                'stars': repo['stargazers_count'],
                'description': repo['description'] or 'No description',
                'url': repo['html_url']
            }
            repos.append(repo_info)

            print(f"{i}. {repo_info['name']}")
            print(f"   Stars: {repo_info['stars']}")
            print(f"   Description: {repo_info['description']}")
            print(f"   URL: {repo_info['url']}")
            print("-"*60)

        return repos

    except requests.exceptions.RequestException as e:
        print(f"Error fetching data: {e}")
        return None


def save_test_data(repos, filename='TEST_DATA_100.csv'):
    if not repos:
        print("No data to save.")
        return

    df = pd.DataFrame(repos)
    df.to_csv(filename, index=False)
    print(f"Saved top 100 repository data to '{filename}'")


def test_get_top_llm_repos():
    print("[ Running Test Function ]")
    test_data = get_top_llm_repos()
    if test_data:
        print(f"Test successful. Retrieved {len(test_data)} repositories.")
        save_test_data(test_data)
    else:
        print("Test failed. No data retrieved.")


if __name__ == "__main__":
    test_get_top_llm_repos()