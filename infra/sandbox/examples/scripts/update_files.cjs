// import fetch from "node-fetch";
const fs = require("fs");
const { containerId } = require("./const.json");

const API_URL = "http://localhost:3000";

async function main() {
  const { workDir } = await fetch(`${API_URL}/api/sandbox/files`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      containerId,
      files: {
        "requirements.txt": "requests",
        "script.py": "print('hello!')",
        "docs/readme.md": "hello readme",
        "docs/tech.md": "hello tech"
      }
    })
  })
    .then((response) => response.json())
    .catch((error) => console.error("Error:", error));

  console.log("workDir", workDir);

  const execRes = await fetch(`${API_URL}/api/sandbox/exec`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      containerId,
      command: ["python", "script.py"]
    })
  })
    .then((response) => response.json())
    .catch((error) => console.error("Error:", error));

  console.log("execRes", execRes);

  const execWithFiles = await fetch(`${API_URL}/api/sandbox/exec`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      containerId,
      files: {
        "docs/readme.md": "hello readme !!! changed !"
      },
      command: ["cat", "docs/readme.md"]
    })
  })
    .then((response) => response.json())
    .catch((error) => console.error("Error:", error));
  console.log("execWithFiles", execWithFiles);
}
main();
