import { copyFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");
const publicDir = join(rootDir, "public");
const duckdbDir = join(publicDir, "duckdb");

// 确保目录存在
mkdirSync(duckdbDir, { recursive: true });

// 复制 DuckDB WASM 文件
const files = [
  "duckdb-mvp.wasm",
  "duckdb-browser-mvp.worker.js",
  "duckdb-eh.wasm",
  "duckdb-browser-eh.worker.js",
];

files.forEach((file) => {
  const sourcePath = join(
    rootDir,
    "node_modules",
    "@duckdb",
    "duckdb-wasm",
    "dist",
    file
  );
  const targetPath = join(duckdbDir, file);
  copyFileSync(sourcePath, targetPath);
  console.log(`Copied ${file} to public/duckdb/`);
});
