import { z } from 'zod';
import { CreateSandboxRequest, ExecuteCodeRequest, SandboxFiles } from '../types';

/**
 * Schema for sandbox options
 */
const SandboxOptionsSchema = z.object({
  timeout: z.number().optional().describe('Timeout in milliseconds'),
  memoryLimit: z.string().optional().describe('Memory limit (e.g., "512m")'),
  cpuLimit: z.string().optional().describe('CPU limit (e.g., "0.5")'),
  portMappings: z.record(z.string(), z.string()).optional().describe('Map of container port to host port')
});

/**
 * Schema for sandbox files
 */
const SandboxFilesSchema = z.record(z.string(), z.string()).describe('Files to create in the sandbox, where key is file path and value is file content');

/**
 * Tool definition interface
 */
export interface Tool<TInput> {
  schema: {
    name: string;
    title: string;
    description: string;
    inputSchema: z.ZodSchema<TInput>;
    type: 'readOnly' | 'destructive' | 'action';
  };
  capability: 'core' | 'advanced';
  execute: (args: TInput) => Promise<{
    content: Array<{ type: 'text'; text: string }>;
    isError?: boolean;
  }>;
}

/**
 * Create Sandbox Tool
 */
export const createSandboxTool: Tool<CreateSandboxRequest> = {
  schema: {
    name: 'create_sandbox',
    title: 'Create Sandbox',
    description: 'Create a new isolated Docker container sandbox for code execution',
    inputSchema: z.object({
      image: z.string().describe('Docker image to use for the sandbox (e.g., "node:18", "python:3.11")'),
      options: SandboxOptionsSchema.optional().describe('Optional configuration for the sandbox container')
    }),
    type: 'action'
  },
  capability: 'core',
  execute: async (args) => {
    try {
      const containerService = await import('../services/container-service').then(m => m.default);
      const container = await containerService.createContainer(args.image, args.options);
      
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            containerId: container.id,
            status: container.status,
            createdAt: container.createdAt.toISOString(),
            expiresAt: container.expiresAt.toISOString(),
            browserPort: container.browserPort
          }, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Error creating sandbox: ${error instanceof Error ? error.message : String(error)}`
        }],
        isError: true
      };
    }
  }
};

/**
 * Execute Code Tool
 */
export const executeCodeTool: Tool<ExecuteCodeRequest> = {
  schema: {
    name: 'execute_code',
    title: 'Execute Code',
    description: 'Execute code in an existing sandbox container',
    inputSchema: z.object({
      containerId: z.string().describe('ID of the container to execute code in'),
      command: z.array(z.string()).describe('Command to execute as an array of strings'),
      files: SandboxFilesSchema.optional().describe('Files to create before executing the command'),
      env: z.record(z.string(), z.string()).optional().describe('Environment variables to set'),
      gitTracking: z.boolean().optional().describe('Enable automatic git tracking for this execution')
    }),
    type: 'action'
  },
  capability: 'core',
  execute: async (args) => {
    try {
      const executionService = await import('../services/execution-service').then(m => m.default);
      const result = await executionService.executeInContainer(
        args.containerId,
        args.command,
        args.files,
        args.env,
        args.gitTracking
      );
      
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(result, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Error executing code: ${error instanceof Error ? error.message : String(error)}`
        }],
        isError: true
      };
    }
  }
};

/**
 * Get Sandbox Status Tool
 */
export const getSandboxStatusTool: Tool<{ containerId: string }> = {
  schema: {
    name: 'get_sandbox_status',
    title: 'Get Sandbox Status',
    description: 'Get the current status and resource usage of a sandbox container',
    inputSchema: z.object({
      containerId: z.string().describe('ID of the container to check status for')
    }),
    type: 'readOnly'
  },
  capability: 'core',
  execute: async (args) => {
    try {
      const containerService = await import('../services/container-service').then(m => m.default);
      const containerInfo = await containerService.getContainer(args.containerId);
      const status = await containerService.getContainerStatus(args.containerId);
      
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            containerId: containerInfo.id,
            status: status.status,
            createdAt: containerInfo.createdAt.toISOString(),
            expiresAt: containerInfo.expiresAt.toISOString(),
            browserPort: containerInfo.browserPort,
            ...(status.resourceUsage && { resourceUsage: status.resourceUsage })
          }, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Error getting sandbox status: ${error instanceof Error ? error.message : String(error)}`
        }],
        isError: true
      };
    }
  }
};

/**
 * Delete Sandbox Tool
 */
export const deleteSandboxTool: Tool<{ containerId: string }> = {
  schema: {
    name: 'delete_sandbox',
    title: 'Delete Sandbox',
    description: 'Delete and cleanup a sandbox container',
    inputSchema: z.object({
      containerId: z.string().describe('ID of the container to delete')
    }),
    type: 'destructive'
  },
  capability: 'core',
  execute: async (args) => {
    try {
      const containerService = await import('../services/container-service').then(m => m.default);
      await containerService.removeContainer(args.containerId);
      
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            status: 'deleted',
            containerId: args.containerId
          }, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Error deleting sandbox: ${error instanceof Error ? error.message : String(error)}`
        }],
        isError: true
      };
    }
  }
};

/**
 * All available tools
 */
export const sandboxTools: Tool<any>[] = [
  createSandboxTool,
  executeCodeTool,
  getSandboxStatusTool,
  deleteSandboxTool
]; 