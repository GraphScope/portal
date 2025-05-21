const fs = require("fs");
async function create() {
  const API_URL = "http://localhost:3000/api/sandbox";
  const params = {
    image: "ai-spider/python:3.11",
    options: {
      timeout: 3000000, //300s,50min
      memoryLimit: "512m"
    }
  };
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(params)
  };
  const data = await fetch(API_URL, options)
    .then((response) => response.json())
    .catch((error) => console.error("Error:", error));
  console.log(data);
  fs.writeFileSync("const.json", JSON.stringify(data, null, 2));
}

create();
