import Docker from "dockerode";
import logger from "../utils/logger";
import { ApiError } from "../middleware/error-handler";
import dockerConfig from "./docker-config";

/**
 * Service for managing Git operations in sandbox containers
 */
class GitService {
  private docker: Docker;

  constructor() {
    this.docker = dockerConfig.getDockerInstance();
  }

  /**
   * Initialize a Git repository in a container
   */
  async initializeRepository(
    containerId: string,
    workDir: string = "/home/sandbox"
  ): Promise<void> {
    try {
      const container = this.docker.getContainer(containerId);

      // Ensure git is installed
      await this.ensureGitInstalled(container);

      // Configure git user information
      await this.execInContainer(container, [
        "git",
        "config",
        "--global",
        "user.name",
        "Sandbox User"
      ]);

      await this.execInContainer(container, [
        "git",
        "config",
        "--global",
        "user.email",
        "sandbox@example.com"
      ]);

      // Initialize git repository
      await this.execInContainer(container, ["git", "init"], workDir);

      // Create initial README.md
      const timestamp = new Date().toISOString();
      await this.execInContainer(
        container,
        [
          "sh",
          "-c",
          `echo "# Sandbox Repository\\n\\nCreated at: ${timestamp}" > README.md`
        ],
        workDir
      );

      // Create initial comprehensive .gitignore file
      await this.updateGitignore(containerId, workDir);

      // Create initial commit
      await this.execInContainer(
        container,
        ["git", "add", "README.md", ".gitignore"],
        workDir
      );
      await this.execInContainer(
        container,
        ["git", "commit", "-m", "Initial commit"],
        workDir
      );

      logger.info(
        `Git repository initialized in container ${containerId} at ${workDir}`
      );
    } catch (error) {
      logger.error(
        `Failed to initialize Git repository in container ${containerId}`,
        { error }
      );
      throw new ApiError(
        "GIT_INIT_FAILED",
        "Failed to initialize Git repository",
        500,
        { cause: error instanceof Error ? error.message : String(error) }
      );
    }
  }

  /**
   * Commit changes to the Git repository
   */
  async commitChanges(
    containerId: string,
    executionId: string,
    message: string,
    workDir: string = "/home/sandbox"
  ): Promise<string> {
    try {
      const container = this.docker.getContainer(containerId);

      // Stage all changes
      await this.execInContainer(container, ["git", "add", "."], workDir);

      // Check if there are any changes to commit
      const { stdout } = await this.execInContainer(
        container,
        ["git", "status", "--porcelain"],
        workDir
      );

      if (!stdout.trim()) {
        logger.info(`No changes to commit for execution ${executionId}`);

        // Return the current commit hash
        const { stdout: commitHash } = await this.execInContainer(
          container,
          ["git", "rev-parse", "HEAD"],
          workDir
        );

        return commitHash.trim();
      }

      // Create commit with execution details
      const fullMessage = `${message}\n\nExecution ID: ${executionId}\nTimestamp: ${new Date().toISOString()}`;
      await this.execInContainer(
        container,
        ["git", "commit", "-m", fullMessage],
        workDir
      );

      // Get the commit hash
      const { stdout: commitHash } = await this.execInContainer(
        container,
        ["git", "rev-parse", "HEAD"],
        workDir
      );

      // Add a tag for the execution
      await this.execInContainer(
        container,
        ["git", "tag", `exec-${executionId}`, commitHash.trim()],
        workDir
      );

      logger.info(`Changes committed for execution ${executionId}`, {
        containerId,
        commitHash: commitHash.trim()
      });

      return commitHash.trim();
    } catch (error) {
      logger.error(`Failed to commit changes for execution ${executionId}`, {
        error
      });
      throw new ApiError(
        "GIT_COMMIT_FAILED",
        "Failed to commit changes to Git repository",
        500,
        { cause: error instanceof Error ? error.message : String(error) }
      );
    }
  }

  /**
   * Get execution history from the Git repository
   */
  async getHistory(
    containerId: string,
    limit: number = 10,
    workDir: string = "/home/sandbox"
  ): Promise<
    Array<{
      id: string;
      commitId: string;
      timestamp: string;
      message: string;
      files: string[];
    }>
  > {
    try {
      const container = this.docker.getContainer(containerId);

      // Get commit history with file changes
      const { stdout } = await this.execInContainer(
        container,
        [
          "git",
          "log",
          `-${limit}`,
          "--pretty=format:%H|||%s|||%ai|||%b",
          "--name-only"
        ],
        workDir
      );

      if (!stdout.trim()) {
        return [];
      }

      // Parse the output
      const commits = stdout.split("\n\n");
      const history = [];

      for (let i = 0; i < commits.length; i += 2) {
        const commitInfo = commits[i].split("|||");
        const commitId = commitInfo[0];
        const message = commitInfo[1];
        const timestamp = commitInfo[2];
        const body = commitInfo[3] || "";

        // Extract execution ID from commit message
        const execIdMatch = body.match(/Execution ID: (exec_[a-zA-Z0-9]+)/);
        const executionId = execIdMatch ? execIdMatch[1] : "unknown";

        // Get files changed
        const files = commits[i + 1]
          ? commits[i + 1].split("\n").filter(Boolean)
          : [];

        history.push({
          id: executionId,
          commitId,
          timestamp,
          message,
          files
        });
      }

      return history;
    } catch (error) {
      logger.error(`Failed to get Git history for container ${containerId}`, {
        error
      });
      throw new ApiError(
        "GIT_HISTORY_FAILED",
        "Failed to retrieve execution history",
        500,
        { cause: error instanceof Error ? error.message : String(error) }
      );
    }
  }

  /**
   * Get diff between two executions
   */
  async getDiff(
    containerId: string,
    fromCommit: string,
    toCommit: string,
    workDir: string = "/home/sandbox"
  ): Promise<Record<string, string>> {
    try {
      const container = this.docker.getContainer(containerId);

      // Get list of changed files between commits
      const { stdout: changedFiles } = await this.execInContainer(
        container,
        ["git", "diff", "--name-only", `${fromCommit}..${toCommit}`],
        workDir
      );

      const files = changedFiles.split("\n").filter(Boolean);
      const diffs: Record<string, string> = {};

      // Get diff for each file
      for (const file of files) {
        const { stdout: diff } = await this.execInContainer(
          container,
          ["git", "diff", `${fromCommit}..${toCommit}`, "--", file],
          workDir
        );

        diffs[file] = diff;
      }

      return diffs;
    } catch (error) {
      logger.error(
        `Failed to get diff between commits in container ${containerId}`,
        { error }
      );
      throw new ApiError(
        "GIT_DIFF_FAILED",
        "Failed to retrieve diff between executions",
        500,
        { cause: error instanceof Error ? error.message : String(error) }
      );
    }
  }

  /**
   * Roll back to a specific execution
   */
  async rollbackToExecution(
    containerId: string,
    executionId: string,
    workDir: string = "/home/sandbox"
  ): Promise<void> {
    try {
      const container = this.docker.getContainer(containerId);

      // Check if the tag exists
      const { stdout: tagExists } = await this.execInContainer(
        container,
        ["git", "tag", "-l", `exec-${executionId}`],
        workDir
      );

      if (!tagExists.trim()) {
        throw new ApiError(
          "EXECUTION_NOT_FOUND",
          `No execution found with ID ${executionId}`,
          404
        );
      }

      // Reset to the commit
      await this.execInContainer(
        container,
        ["git", "reset", "--hard", `exec-${executionId}`],
        workDir
      );

      logger.info(
        `Rolled back to execution ${executionId} in container ${containerId}`
      );
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      logger.error(`Failed to roll back to execution ${executionId}`, {
        error
      });
      throw new ApiError(
        "GIT_ROLLBACK_FAILED",
        "Failed to roll back to previous execution",
        500,
        { cause: error instanceof Error ? error.message : String(error) }
      );
    }
  }

  /**
   * Create or update .gitignore file in the repository with comprehensive patterns
   * @param containerId The container ID
   * @param workDir The working directory
   */
  async updateGitignore(
    containerId: string,
    workDir: string = "/home/sandbox"
  ): Promise<void> {
    try {
      const container = this.docker.getContainer(containerId);

      // Comprehensive .gitignore template for Python and Node.js projects
      const gitignoreContent = `# Generated .gitignore file

# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
env/
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg
venv/
.venv/
ENV/
.env
.coverage
htmlcov/

# Node.js
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
package-lock.json
yarn.lock
pnpm-lock.yaml
.pnp/
.pnp.js
coverage/
.next/
out/
.nuxt/
.cache/
.build/
.npm/
*.tsbuildinfo

# IDE
.idea/
.vscode/
*.swp
*.swo
*.sublime-workspace
.project
.classpath

# OS
.DS_Store
Thumbs.db
*.log

# Explicitly ignored directories
.local/
.local
.cache/
.cache
`;

      // Write the new .gitignore file, completely replacing any existing content
      await this.execInContainer(
        container,
        ["sh", "-c", `echo "${gitignoreContent}" > .gitignore`],
        workDir
      );

      // Stage and commit the updated .gitignore
      await this.execInContainer(
        container,
        ["git", "add", ".gitignore"],
        workDir
      );

      // Only commit if there are changes
      const { stdout: gitStatus } = await this.execInContainer(
        container,
        ["git", "status", "--porcelain", ".gitignore"],
        workDir
      );

      if (gitStatus.trim()) {
        await this.execInContainer(
          container,
          [
            "git",
            "commit",
            "-m",
            "Update .gitignore with comprehensive patterns"
          ],
          workDir
        );
        logger.info("Updated .gitignore file with comprehensive patterns", {
          containerId
        });
      } else {
        logger.info("No changes to .gitignore to commit", { containerId });
      }
    } catch (error) {
      logger.error(`Failed to update .gitignore in container ${containerId}`, {
        error
      });
      throw new ApiError(
        "GIT_IGNORE_UPDATE_FAILED",
        "Failed to update .gitignore file",
        500,
        { cause: error instanceof Error ? error.message : String(error) }
      );
    }
  }

  /**
   * Ensure Git is installed in the container
   */
  private async ensureGitInstalled(container: Docker.Container): Promise<void> {
    const containerId = container.id;
    try {
      // Check if git is already installed
      const { stdout, stderr } = await this.execInContainer(container, [
        "which",
        "git"
      ]);

      if (stdout.trim()) {
        logger.info("Git is already installed in container", { containerId });
        return;
      }

      logger.info("Installing Git in container...", { containerId });

      // Install git (this handles different package managers)
      await this.execInContainer(container, [
        "sh",
        "-c",
        "if command -v apt-get > /dev/null; then " +
        "apt-get update && apt-get install -y git; " +
        "elif command -v apk > /dev/null; then " +
        "apk add --no-cache git; " +
        "elif command -v yum > /dev/null; then " +
        "yum install -y git; " +
        "else echo 'Unsupported package manager'; exit 1; fi"
      ]);

      // Verify git is installed
      const { stdout: gitVersion } = await this.execInContainer(container, [
        "git",
        "--version"
      ]);

      if (!gitVersion.trim()) {
        throw new Error("Git installation failed");
      }

      logger.info(`Git installed successfully: ${gitVersion.trim()}`, {
        containerId
      });
    } catch (error) {
      logger.error("Failed to install Git in container", {
        error,
        containerId
      });
      throw new ApiError(
        "GIT_INSTALLATION_FAILED",
        "Failed to install Git in container",
        500,
        { cause: error instanceof Error ? error.message : String(error) }
      );
    }
  }

  /**
   * Execute a command in the container
   */
  private async execInContainer(
    container: Docker.Container,
    command: string[],
    workDir?: string
  ): Promise<{ stdout: string; stderr: string }> {
    const containerId = container.id;
    const execOptions: Docker.ExecCreateOptions = {
      Cmd: command,
      AttachStdout: true,
      AttachStderr: true,
      User: "root" // Use root to ensure git commands have proper permissions
    };

    if (workDir) {
      execOptions.WorkingDir = workDir;
    }

    const exec = await container.exec(execOptions);

    return new Promise((resolve, reject) => {
      exec.start({ hijack: true }, (err, stream) => {
        if (err) {
          logger.error("Failed to start exec in container", {
            error: err,
            containerId,
            command
          });
          return reject(err);
        }
        if (!stream) {
          logger.error("No stream returned from exec.start", {
            containerId,
            command
          });
          return reject(new Error("No stream returned from exec.start"));
        }

        let stdout = "";
        let stderr = "";

        container.modem.demuxStream(
          stream,
          {
            write: (chunk: Buffer) => {
              const message = chunk.toString();
              stdout += message;
              logger.info(message, { position: 'GitService', containerId: container.id });
            }
          },
          {
            write: (chunk: Buffer) => {
              const message = chunk.toString();
              stderr += message;
              logger.error(message, { position: 'GitService', containerId: container.id });
            }
          }
        );

        stream.on("end", () => {
          resolve({ stdout, stderr });
        });

        stream.on("error", (err) => {
          logger.error("Stream error during exec", {
            error: err,
            containerId,
            command
          });
          reject(err);
        });
      });
    });
  }
}

export default new GitService();
