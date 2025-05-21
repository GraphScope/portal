import requests
import time

def get_top_llm_repos():
    url = "https://api.github.com/search/repositories"  # Removed extra spaces
    params = {
        'q': 'llm',
        'sort': 'stars',
        'order': 'desc',
        'per_page': 100
    }
    headers = {'User-Agent': 'PythonScript/1.0'}
    
    try:
        response = requests.get(url, params=params, headers=headers)
        response.raise_for_status()
        data = response.json()
        
        print(f"Found {data['total_count']} repositories. Showing top 100:")
        print("\nTop 100 LLM Repositories on GitHub:")
        print("="*60)
        
        for i, repo in enumerate(data['items'], 1):
            print(f"{i}. {repo['name']}")
            print(f"   Stars: {repo['stargazers_count']}")
            print(f"   Description: {repo['description'] or 'No description'}")
            print(f"   URL: {repo['html_url']}")
            print("="*60)
            
        return data['items']
        
    except requests.exceptions.RequestException as e:
        print(f"Error fetching data: {e}")
        return None

if __name__ == "__main__":
    get_top_llm_repos()