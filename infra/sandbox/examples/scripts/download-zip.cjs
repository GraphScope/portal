const fs = require("fs");
const path = require("path");
const { containerId } = require("./const.json");
const archiver = require("archiver"); // 需要先安装: npm install archiver

/**
 * Download a file from the sandbox container
 * @param {string} filePath The path of the file to download (relative to /home/sandbox)
 */
async function downloadFileFromSandbox(filePath = "sandbox.zip") {
  console.log(`Downloading file from sandbox: ${filePath}`);

  const downloadUrl = `http://localhost:3000/api/sandbox/${containerId}/download-all`;

  fetch(downloadUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Download failed: ${response.status} ${response.statusText}`
        );
      }
      return response.arrayBuffer();
    })
    .then((buffer) => {
      // 正确地将二进制数据写入文件
      fs.writeFileSync(filePath, Buffer.from(buffer));
      console.log(`File downloaded successfully: ${filePath}`);
    })
    .catch((error) => console.error("Download error:", error));
}

module.exports = {
  downloadFileFromSandbox
};

downloadFileFromSandbox();
