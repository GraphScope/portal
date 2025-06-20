// import fetch from "node-fetch";
const fs = require("fs");
const { containerId } = require("./const.json");
console.log("containerId", containerId);
/**
 * prompt:
 *
 * 请帮我爬取 github star 数前 100 的关于 llm 的仓库信息
 */
const codeString =
  "import requests\nimport time\n\ndef get_top_llm_repos():\n    url = \"https://api.github.com/search/repositories\"\n    params = {\n        'q': 'llm',\n        'sort': 'stars',\n        'order': 'desc',\n        'per_page': 100\n    }\n    headers = {'User-Agent': 'PythonScript/1.0'}\n    \n    try:\n        response = requests.get(url, params=params, headers=headers)\n        response.raise_for_status()\n        data = response.json()\n        \n        print(f\"Found {data['total_count']} repositories. Showing top 100:\")\n        print(\"\\nTop 100 LLM Repositories on GitHub:\")\n        print(\"=\"*60)\n        \n        for i, repo in enumerate(data['items'], 1):\n            print(f\"{i}. {repo['name']}\")\n            print(f\"   Stars: {repo['stargazers_count']}\")\n            print(f\"   Description: {repo['description'] or 'No description'}\")\n            print(f\"   URL: {repo['html_url']}\")\n            print(\"=\"*60)\n            \n        return data['items']\n        \n    except requests.exceptions.RequestException as e:\n        print(f\"Error fetching data: {e}\")\n        return None\n\nif __name__ == \"__main__\":\n    get_top_llm_repos()";

const params = {
  containerId,
  files: {
    "requirements.txt": "requests",
    "script.py": codeString
  },
  command: ["python", "script.py"]
};

const API_URL = "http://localhost:3000/api/sandbox/exec";

async function main() {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(params)
  };

  fetch(API_URL, options)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      fs.writeFileSync(
        "output.txt",
        data.stdout || "No output from the script."
      );
    })
    .catch((error) => console.error("Error:", error));
}
main();
