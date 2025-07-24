/**
 * Sandbox API type definitions
 */

/**
 * Options for creating a sandbox container
 */
export interface SandboxOptions {
  timeout?: number; // Timeout in milliseconds
  memoryLimit?: string; // Memory limit (e.g., "512m")
  cpuLimit?: string; // CPU limit (e.g., "0.5")
  portMappings?: Record<string, string>; // Map of container port to host port
}

/**
 * Request payload for creating a sandbox
 */
export interface CreateSandboxRequest {
  image: string; // Docker image to use
  options?: SandboxOptions;
}

/**
 * Response object for sandbox creation
 */
export interface SandboxResponse {
  containerId: string;
  status: string;
  createdAt: string;
  expiresAt: string;
  browserPort?: number; // Port for browser service connections
}

/**
 * File entries to be created in the sandbox
 */
export interface SandboxFiles {
  [path: string]: string;
}

/**
 * Request payload for executing code in a sandbox
 */
export interface ExecuteCodeRequest {
  containerId: string;
  command: string[];
  files?: SandboxFiles;
  env?: Record<string, string>;
  gitTracking?: boolean; // Enable automatic git tracking for this execution
}

/**
 * Response object for code execution
 */
export interface ExecutionResponse {
  id: string;
  status: "success" | "error";
  duration: number;
  stdout: string;
  stderr: string;
  error?: string;
}

// Real-time execution response type has been removed

/**
 * Status of a sandbox container
 */
export interface SandboxStatus {
  containerId: string;
  status: string;
  createdAt: string;
  expiresAt: string;
  browserPort?: number; // Port for browser service connections
  resourceUsage?: {
    cpuUsage?: string;
    memoryUsage?: string;
  };
}

/**
 * Error response structure
 */
export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
}

/**
 * Container information
 */
export interface ContainerInfo {
  id: string; // 现在直接是Docker容器ID
  status: string;
  createdAt: Date;
  expiresAt: Date;
  containerName?: string; // 容器名称，方便通过名称查找
  browserPort?: number; // Mapped host port for browser service
}

/**
 * Execution result
 */
export interface ExecutionResult {
  id: string;
  status: "success" | "error";
  duration: number;
  stdout: string;
  stderr: string;
  error?: string;
}

/**
 * Dependency installation result
 */
export interface DependencyInstallResult {
  success: boolean;
  logs: string;
  error?: string;
}

/**
 * Dependency handler interface
 */
export interface DependencyHandler {
  canHandle(files: SandboxFiles): boolean;
  install(
    container: import("dockerode").Container,
    files: SandboxFiles,
    workDir?: string
  ): Promise<DependencyInstallResult>;
}

export interface UpdateFilesRequest {
  containerId: string;
  files: SandboxFiles;
  gitTracking?: boolean;
}

export interface SandboxContainer {
  id: string;
  status: "running" | "exited" | "created" | "removing" | "paused";
}

/**
 * Claude CLI 会话选项
 */
export interface ClaudeSessionOptions {
  prompt?: string;
  outputFormat?: "text" | "json" | "stream-json";
  sessionId?: string;
  containerId: string;
  taskId?: string; // 任务ID，用于OSS存储路径
}

/**
 * Claude CLI 响应
 */
export interface ClaudeResponse {
  type: string;
  subtype?: string;
  total_cost_usd?: number;
  is_error: boolean;
  duration_ms?: number;
  duration_api_ms?: number;
  num_turns?: number;
  result: string;
  session_id?: string;
}

/**
 * Claude CLI 流式响应类型 - 用于stream-json格式
 */
export interface ClaudeStreamResponse {
  type: "stream";
  stream: NodeJS.ReadableStream;
  session_id?: string;
}

/**
 * Claude CLI 统一响应类型
 */
export type ClaudeUnifiedResponse = ClaudeResponse | ClaudeStreamResponse;

/**
 * Claude CLI 流式响应
 */
export interface StreamResponse {
  type: string;
  content?: string;
  role?: string;
  session_id?: string;
}

/**
 * 创建 Claude 会话请求
 */
export interface CreateClaudeSessionRequest {
  containerId: string;
  prompt: string;
  outputFormat?: "text" | "json" | "stream-json";
  taskId?: string; // 任务ID，用于OSS存储路径
}

/**
 * 恢复 Claude 会话请求
 */
export interface ResumeClaudeSessionRequest {
  containerId: string;
  sessionId: string;
  prompt?: string;
  outputFormat?: "text" | "json" | "stream-json";
}

/**
 * 继续 Claude 会话请求
 */
export interface ContinueClaudeSessionRequest {
  containerId: string;
  prompt?: string;
  outputFormat?: "text" | "json" | "stream-json";
}
