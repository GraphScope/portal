const fs = require("fs");
const { containerId } = require("./const.json");
const { downloadFileFromSandbox } = require("./download");

// 通过prompt修改已有的python代码， 使其符合sandbox的沙箱数据存储格式
// const __prompt__ = `
//   修改下方这段代码，增加测试函数，并将前100条测试数据保留在同目录文件下，取名TEST_DATA_100.csv
//   ${code}
//   `;
const code = fs.readFileSync("./test_1.py", "utf-8");

// 通过 sandbox 执行代码

const params = {
  containerId,
  files: {
    "requirements.txt": "requests\npandas",
    "script.py": code
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
      // fs.writeFileSync(
      //   "output_100.txt",
      //   data.stdout || "No output from the script."
      // );

      // After execution completes, download the generated CSV file
      downloadFileFromSandbox("TEST_DATA_100.csv");
    })
    .catch((error) => console.error("Error:", error));
}

main();
