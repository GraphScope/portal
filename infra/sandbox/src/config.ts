import dotenv from "dotenv";
import path from "path";
import { dirname } from "./utils/paths";

// Load environment variables from .env file
dotenv.config({ path: path.resolve(dirname, "../.env") });

interface Config {
  port: number;
  nodeEnv: string;
  logLevel: string;
  defaultTimeout: number;
  defaultMemoryLimit: string;
  defaultCpuLimit: string;
  containerCleanupInterval: number;
  maxContainersPerUser: number;
}

const config: Config = {
  port: parseInt(process.env.PORT || "3000", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  logLevel: process.env.LOG_LEVEL || "info",
  defaultTimeout: parseInt(process.env.DEFAULT_TIMEOUT || "3000000", 10), // 30 seconds
  defaultMemoryLimit: process.env.DEFAULT_MEMORY_LIMIT || "512m",
  defaultCpuLimit: process.env.DEFAULT_CPU_LIMIT || "0.5",
  containerCleanupInterval: parseInt(
    process.env.CONTAINER_CLEANUP_INTERVAL || "3000000",
    10
  ), // 50 minutes
  maxContainersPerUser: parseInt(process.env.MAX_CONTAINERS_PER_USER || "5", 10)
};

export default config;
