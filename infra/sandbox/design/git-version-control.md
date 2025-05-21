# Git-Based Version Control for Sandbox Environment

## 1. Overview

This document outlines the design for implementing Git-based version control in the `@ai-sandbox/server`. This feature replaces the current approach of creating new directories for each code execution with a Git-based version control system, providing better space efficiency and code history tracking.

## 2. Current vs Proposed Approach

### 2.1 Current Approach

Currently, the sandbox creates a new directory with a UUID for each code execution:

- Each execution generates a new directory: `/home/sandbox/{uuid}`
- All files are duplicated for each run, even if only minor changes are made
- No history tracking between executions
- Inefficient storage utilization

### 2.2 Proposed Git-Based Approach

With Git-based version control:

- Files are stored in a single Git repository per container
- Changes are committed to the repo with each execution
- Only the differences between versions are stored
- Complete history of all code executions is maintained
- Space efficiency is improved

## 3. Implementation Design

### 3.1 High-Level Process Flow

```
┌────────────────┐      ┌─────────────────────┐      ┌─────────────────┐
│                │      │                     │      │                 │
│  Initialize    │─────▶│  Add/Update Files   │─────▶│  Commit Changes │
│  Git Repo      │      │  to Working Dir     │      │  to Git Repo    │
│                │      │                     │      │                 │
└────────────────┘      └─────────────────────┘      └─────────────────┘
                                                              │
                                                              ▼
┌────────────────┐      ┌─────────────────────┐      ┌─────────────────┐
│                │      │                     │      │                 │
│  Return        │◀─────│  Execute Code in    │◀─────│  Tag Commit     │
│  Results       │      │  Working Directory  │      │  with Run ID    │
│                │      │                     │      │                 │
└────────────────┘      └─────────────────────┘      └─────────────────┘
```

### 3.2 Technical Components

1. **GitService**: A new service to manage Git operations
2. **Integration with FileService**: Update to use Git for version control
3. **Execution History**: Methods to retrieve execution history
4. **Repository Management**: Creation and cleanup of Git repositories

## 4. Detailed Implementation

### 4.1 Repository Initialization

When a new container is created:

- Initialize a Git repository in `/home/sandbox`
- Configure Git user information for the container
- Create an initial commit with a README.md

### 4.2 File Management

When executing code:

- Update files in the working directory
- Stage changes with `git add`
- Commit changes with a message including execution metadata
- Tag the commit with the execution ID for easy reference

### 4.3 History Management

- Provide API endpoints to retrieve execution history
- Allow viewing differences between executions
- Support rolling back to previous versions

### 4.4 API Extensions

**New endpoint**: `GET /api/sandbox/:containerId/history`

**Response**:

```json
{
  "history": [
    {
      "id": "exec_7683de5a",
      "commitId": "a1b2c3d4e5f6",
      "timestamp": "2025-05-13T10:00:00Z",
      "message": "Execution with Node.js",
      "files": ["index.js", "package.json"]
    },
    ...
  ]
}
```

**New endpoint**: `GET /api/sandbox/:containerId/diff`

**Request**:

```json
{
  "fromExecId": "exec_7683de5a",
  "toExecId": "exec_8794fe6b"
}
```

**Response**:

```json
{
  "diff": {
    "index.js": "--- old\n+++ new\n@@ -1,3 +1,4 @@\n console.log('hello');\n+console.log('new line');"
  }
}
```

## 5. Security Considerations

- Run Git operations with limited privileges
- Sanitize commit messages and input
- Limit repository size to prevent abuse
- Implement rate limiting for history-related API calls

## 6. Resource Requirements

- Install Git in container images
- Additional disk space for Git metadata (typically small compared to file duplication)
- Minimal CPU overhead for Git operations

## 7. Implementation Plan

### 7.1 Phase 1: Core Git Integration

- Create GitService
- Modify FileService to use Git for version control
- Update execution service to commit changes

### 7.2 Phase 2: History and Rollback

- Implement history API endpoints
- Add rollback functionality
- Support diffs between executions

### 7.3 Phase 3: Optimization and Cleanup

- Implement repository pruning
- Add advanced filtering and search for history
- Optimize storage with garbage collection

## 8. Migration Strategy

- Add a feature flag to enable Git-based versioning
- Initially support both approaches for backward compatibility
- Implement automatic migration of existing containers
- Gradually phase out directory-based versioning

## 9. Testing Strategy

- Unit tests for GitService
- Integration tests for execution history
- Performance tests to verify space savings
- Load tests to ensure Git operations don't impact performance

## 10. Advantages Over Current Approach

- **Space Efficiency**: Only stores code differences between runs
- **History Tracking**: Complete audit trail of all code executions
- **Developer Experience**: Familiar Git commands and interfaces
- **Rollback Support**: Easy reverting to previous working code
- **Execution Context**: Better context for debugging with commit history
