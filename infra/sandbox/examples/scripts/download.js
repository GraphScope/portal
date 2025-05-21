const fs = require("fs");
const path = require("path");
const { containerId } = require("./const.json");
const archiver = require("archiver"); // 需要先安装: npm install archiver

/**
 * Download a file from the sandbox container
 * @param {string} filePath The path of the file to download (relative to /home/sandbox)
 */
async function downloadFileFromSandbox(filePath) {
  console.log(`Downloading file from sandbox: ${filePath}`);

  const downloadUrl = `http://localhost:3000/api/sandbox/${containerId}/file?filePath=${filePath}`;

  fetch(downloadUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Download failed: ${response.status} ${response.statusText}`
        );
      }
      return response.text();
    })
    .then((content) => {
      fs.writeFileSync(filePath, content);
      console.log(`File downloaded successfully: ${filePath}`);
    })
    .catch((error) => console.error("Download error:", error));
}

/**
 * Download all files from the sandbox container
 * @param {string} outputDir The directory where to save all downloaded files (default: "./sandbox_files")
 * @returns {Promise<string[]>} Array of downloaded file paths
 */
async function downloadAllFilesFromSandbox(outputDir = "./sandbox_files") {
  console.log(`Downloading all files from sandbox to directory: ${outputDir}`);

  try {
    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // List files in the sandbox (we can use an API endpoint or execute 'ls -la' command)
    // For this example, we'll execute a command to list all files recursively
    const listFilesUrl = `http://localhost:3000/api/sandbox/exec`;
    const listFilesResponse = await fetch(listFilesUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        containerId: containerId,
        command: [
          "find",
          "/home/sandbox",
          "-type",
          "f",
          "-not",
          "-path",
          "*/\\.*"
        ]
      })
    });

    if (!listFilesResponse.ok) {
      throw new Error(
        `Failed to list files: ${listFilesResponse.status} ${listFilesResponse.statusText}`
      );
    }

    const result = await listFilesResponse.json();
    const fileListOutput = result.stdout;
    const filePaths = fileListOutput
      .trim()
      .split("\n")
      .filter((line) => line.length > 0);

    console.log(`Found ${filePaths.length} files to download`);

    // Download each file
    const downloadedFiles = [];
    for (const filePath of filePaths) {
      // Calculate relative path from /home/sandbox
      const relativePath = filePath.replace(/^\/home\/sandbox\//, "");
      if (!relativePath) continue; // Skip the root directory itself

      const localFilePath = path.join(outputDir, relativePath);

      // Create directory structure if needed
      const dirPath = path.dirname(localFilePath);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }

      // Download the file
      const downloadUrl = `http://localhost:3000/api/sandbox/${containerId}/file?filePath=${filePath}`;
      const fileResponse = await fetch(downloadUrl);

      if (!fileResponse.ok) {
        console.error(
          `Error downloading ${filePath}: ${fileResponse.status} ${fileResponse.statusText}`
        );
        continue;
      }

      const content = await fileResponse.text();
      fs.writeFileSync(localFilePath, content);
      downloadedFiles.push(localFilePath);
      console.log(`Downloaded file: ${localFilePath}`);
    }

    console.log(
      `Successfully downloaded ${downloadedFiles.length} files to ${outputDir}`
    );
    return downloadedFiles;
  } catch (error) {
    console.error("Error downloading all files:", error);
    throw error;
  }
}

/**
 * Download all files from the sandbox container and create a zip archive
 * @param {string} outputZipPath The path where to save the ZIP file (default: "./sandbox_files.zip")
 * @param {string} tempDir Temporary directory used for downloading files before zipping (default: "./temp_sandbox_files")
 * @returns {Promise<string>} Path to the created ZIP file
 */
async function downloadAllFilesAsZip(
  outputZipPath = "./sandbox_files.zip",
  tempDir = "./temp_sandbox_files"
) {
  console.log(`Downloading all sandbox files as ZIP: ${outputZipPath}`);

  try {
    // Download all files to a temporary directory
    const downloadedFiles = await downloadAllFilesFromSandbox(tempDir);

    // Create output directory for zip if needed
    const zipDir = path.dirname(outputZipPath);
    if (!fs.existsSync(zipDir)) {
      fs.mkdirSync(zipDir, { recursive: true });
    }

    // Create a file to stream archive data to
    const output = fs.createWriteStream(outputZipPath);
    const archive = archiver("zip", {
      zlib: { level: 9 } // Maximum compression level
    });

    // Listen for all archive data to be written
    output.on("close", function () {
      console.log(`ZIP archive created successfully: ${outputZipPath}`);
      console.log(`Total size: ${archive.pointer()} bytes`);
    });

    // Good practice to catch warnings (i.e. stat failures and other non-blocking errors)
    archive.on("warning", function (err) {
      if (err.code === "ENOENT") {
        console.warn("Warning during archiving:", err);
      } else {
        throw err;
      }
    });

    // Good practice to catch this error explicitly
    archive.on("error", function (err) {
      throw err;
    });

    // Pipe archive data to the file
    archive.pipe(output);

    // Add files to the archive
    const basePath = path.resolve(tempDir);
    for (const filePath of downloadedFiles) {
      // Get the relative path for the archive
      const relativePath = path.relative(basePath, filePath);
      // Add the file to the archive
      archive.file(filePath, { name: relativePath });
    }

    // Finalize the archive (i.e. we are done appending files)
    await archive.finalize();

    console.log("Cleaning up temporary directory...");

    // Remove the temporary directory after zipping to only keep the ZIP file
    fs.rmSync(tempDir, { recursive: true, force: true });
    console.log(`Temporary directory ${tempDir} has been removed`);

    return outputZipPath;
  } catch (error) {
    console.error("Error creating ZIP archive:", error);
    throw error;
  }
}

module.exports = {
  downloadFileFromSandbox,
  downloadAllFilesFromSandbox,
  downloadAllFilesAsZip
};
// 调用示例:
// downloadAllFilesFromSandbox(); // 下载所有文件到目录
downloadAllFilesAsZip(); // 下载所有文件并打包为ZIP，只保留ZIP文件
// downloadAllFilesAsZip("./sandbox_backup.zip"); // 自定义ZIP文件名
