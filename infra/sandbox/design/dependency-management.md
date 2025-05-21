# 沙箱环境依赖管理技术设计

## 1. 概述

### 1.1 背景与目标

当前的沙箱服务 (`@graphscope/sandbox`) 能够在隔离的Docker容器中执行代码，但缺乏动态下载和管理依赖包的能力。为满足开发者需求，我们需要扩展服务功能，支持在运行代码前自动安装所需的依赖包，特别是针对Node.js (npm) 和Python (pip) 环境。

### 1.2 核心功能

- 通过标准配置文件（如package.json, requirements.txt）指定依赖
- 在代码执行前自动检测并安装这些依赖
- 支持不同编程语言的包管理器（npm、pip等）
- 保持容器环境的安全性和隔离性
- 提供合理的错误处理和日志记录

## 2. 系统设计

### 2.1 API接口设计

使用现有的 `/api/sandbox/exec` 接口，在 `files` 字段中包含依赖配置文件：

Python 示例:

```json
POST /api/sandbox/exec
{
  "containerId": "xxxx",
  "files": {
    "main.py": "import numpy as np\nprint(np.array([1, 2, 3]))",
    "requirements.txt": "numpy==1.24.0\npandas>=1.5.0"
  },
  "command": ["python", "main.py"]
}
```

Node.js 示例:

```json
{
  "containerId": "xxxx",
  "files": {
    "index.js": "const express = require('express');\nconst app = express();\napp.listen(3000, () => console.log('Server started'));",
    "package.json": "{\"name\":\"sandbox-app\",\"version\":\"1.0.0\",\"dependencies\":{\"express\":\"^4.18.2\",\"lodash\":\"^4.17.21\"}}"
  },
  "command": ["node", "index.js"]
}
```

### 2.2 后端流程设计

1. **请求处理流程**:

   - 接收包含代码和文件的请求
   - 检测是否存在依赖配置文件
   - 根据配置文件类型确定编程语言和处理方式

2. **依赖安装流程**:

   - 检测文件列表中的依赖配置文件（package.json, requirements.txt等）
   - 根据配置文件类型选择相应的依赖处理器
   - 在容器内执行安装命令
   - 处理安装过程中的错误和超时
   - 记录安装日志

3. **代码执行流程**:
   - 在依赖安装成功后执行用户代码
   - 返回执行结果和日志

### 2.3 组件设计

新增以下核心组件:

1. **DependencyDetectionService**: 负责检测依赖配置文件

   - 识别项目类型（Node.js, Python等）
   - 确定所需的依赖安装命令

2. **语言特定依赖处理器**:

   - **NodePackageHandler**: 处理Node.js依赖
   - **PythonPackageHandler**: 处理Python依赖
   - 其他语言处理器（可扩展）

3. **ExecutionService扩展**: 修改现有执行服务，整合依赖检测和安装流程

## 3. 详细实现

### 3.1 依赖管理接口

```typescript
// 依赖处理接口
export interface DependencyHandler {
  canHandle(files: SandboxFiles): boolean;
  install(
    container: Docker.Container,
    files: SandboxFiles,
  ): Promise<{
    success: boolean;
    logs: string;
    error?: string;
  }>;
}
```

### 3.2 依赖检测服务

```typescript
// 依赖检测服务
class DependencyDetectionService {
  private handlers: DependencyHandler[] = [];

  constructor() {
    // 注册各种语言的处理器
    this.handlers.push(new NodePackageHandler());
    this.handlers.push(new PythonPackageHandler());
    // 可以添加更多处理器
  }

  async installDependenciesIfNeeded(
    container: Docker.Container,
    files: SandboxFiles,
  ): Promise<{
    success: boolean;
    logs: string;
    error?: string;
  }> {
    // 查找能处理当前文件集合的处理器
    for (const handler of this.handlers) {
      if (handler.canHandle(files)) {
        return handler.install(container, files);
      }
    }

    // 没有找到处理器，说明不需要安装依赖
    return { success: true, logs: 'No dependency configuration detected.' };
  }
}
```

### 3.3 语言特定处理器

**Python 依赖处理器**:

```typescript
class PythonPackageHandler implements DependencyHandler {
  canHandle(files: SandboxFiles): boolean {
    // 检查是否存在requirements.txt文件
    return Object.keys(files).some(
      filename => filename === 'requirements.txt' || filename.endsWith('/requirements.txt'),
    );
  }

  async install(
    container: Docker.Container,
    files: SandboxFiles,
  ): Promise<{
    success: boolean;
    logs: string;
    error?: string;
  }> {
    // 执行pip install -r requirements.txt命令
    // 返回安装结果
  }
}
```

**Node.js 依赖处理器**:

```typescript
class NodePackageHandler implements DependencyHandler {
  canHandle(files: SandboxFiles): boolean {
    // 检查是否存在package.json文件
    return Object.keys(files).some(filename => filename === 'package.json' || filename.endsWith('/package.json'));
  }

  async install(
    container: Docker.Container,
    files: SandboxFiles,
  ): Promise<{
    success: boolean;
    logs: string;
    error?: string;
  }> {
    // 执行npm install命令
    // 返回安装结果
  }
}
```

### 3.4 ExecutionService 扩展

修改执行服务以整合依赖检测和安装流程：

```typescript
class ExecutionService {
  private dependencyService: DependencyDetectionService;

  constructor() {
    this.dependencyService = new DependencyDetectionService();
  }

  async executeInContainer(containerId: string, command: string[], files?: SandboxFiles): Promise<ExecutionResult> {
    try {
      const container = await this.getContainer(containerId);

      // 1. 上传文件
      if (files && Object.keys(files).length > 0) {
        await fileService.uploadFilesToContainer(container, files);
      }

      // 2. 检测并安装依赖
      if (files && Object.keys(files).length > 0) {
        const installResult = await this.dependencyService.installDependenciesIfNeeded(container, files);

        if (!installResult.success) {
          return {
            id: `exec_${uuidv4()}`,
            status: 'error',
            duration: 0,
            stdout: installResult.logs,
            stderr: installResult.error || 'Dependency installation failed',
            error: 'Dependency installation failed',
          };
        }

        // 可选：记录依赖安装日志
        logger.info(`Dependencies installed for container ${containerId}`, {
          logs: installResult.logs,
        });
      }

      // 3. 执行命令
      const result = await this.execInContainer(container, command);

      // 4. 返回结果
      // ...
    } catch (error) {
      // ...
    }
  }
}
```

## 4. 安全考虑

1. **依赖审查**: 考虑实现依赖白名单/黑名单机制
2. **资源限制**: 限制依赖安装过程的CPU、内存和网络使用
3. **超时处理**: 为依赖安装设置最大超时时间
4. **版本锁定**: 提示用户明确指定依赖版本
5. **日志记录**: 记录所有依赖安装活动以便审计

## 5. 错误处理

1. **依赖冲突**: 检测并报告依赖冲突
2. **安装失败**: 提供详细的错误信息和安装日志
3. **超时处理**: 在超时情况下终止安装并清理
4. **网络问题**: 处理网络连接问题并提供诊断信息

## 6. 扩展性考虑

1. **支持更多语言**: 扩展依赖处理器以支持更多语言（如Ruby的Gemfile、Java的pom.xml等）
2. **缓存机制**: 未来可以实现依赖缓存以提高性能
3. **预装镜像**: 考虑提供包含常用依赖的预构建镜像
4. **多配置文件支持**: 支持项目中的多种配置文件（例如同时支持package.json和package-lock.json）

## 7. 实施路线图

### 第一阶段: 核心功能

- 实现Python和Node.js依赖处理器
- 实现依赖检测服务
- 集成到执行流程中

### 第二阶段: 增强功能

- 添加依赖审查和安全机制
- 优化性能和资源使用
- 添加更多语言支持

### 第三阶段: 高级功能

- 实现依赖缓存
- 提供预构建镜像
- 添加依赖分析和建议功能
