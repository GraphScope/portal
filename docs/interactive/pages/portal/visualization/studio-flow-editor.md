# Studio Flow Editor

## 简介

Studio Flow Editor 是一个基于 React 的流程图编辑器组件，提供了完整的流程图编辑功能和状态管理方案。它基于 ReactFlow 构建，支持节点和边的创建、编辑，以及多种布局算法。

## 特性

- 完整的流程图编辑功能
- 支持多种布局算法（D3-force, Dagre）
- 响应式状态管理
- 支持国际化
- 支持图片导出
- 模块化设计

## 安装

```bash
npm install @graphscope/studio-flow-editor
# 或
yarn add @graphscope/studio-flow-editor
```

## 使用示例

```tsx
import { GraphProvider, GraphEditor } from '@graphscope/studio-flow-editor';

const App = () => {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <GraphProvider>
        <GraphEditor />
      </GraphProvider>
    </div>
  );
};
```

## API

### GraphProvider

提供编辑器所需的上下文。

```tsx
<GraphProvider>
  <GraphEditor />
</GraphProvider>
```

### GraphEditor

主编辑器组件，包含完整的编辑功能。

```tsx
<GraphEditor />
```

### useGraphStore

状态管理 hook，用于访问和更新编辑器状态。

```tsx
const { store, updateStore } = useGraphStore();
const { nodes, edges } = store;

// 更新状态
updateStore(draft => {
  draft.nodes = newNodes;
  draft.edges = newEdges;
});
```

## 状态管理

编辑器使用 Zustand 进行状态管理，主要状态包括：

- `nodes`: 节点列表
- `edges`: 边列表
- `nodePositionChange`: 节点位置变化
- `hasLayouted`: 是否已布局
- `elementOptions`: 元素选项
  - `isEditable`: 是否可编辑
  - `isConnectable`: 是否可连接

## 布局算法

支持两种布局算法：

1. D3-force: 力导向布局
2. Dagre: 层次布局

## 事件处理

编辑器支持以下事件：

- `onConnectStart`: 开始连接
- `onConnectEnd`: 结束连接
- `onNodesChange`: 节点变化
- `onEdgesChange`: 边变化
- `onDoubleClick`: 双击事件

## 开发

```bash
# 安装依赖
npm install

# 开发模式
npm run start

# 构建
npm run build
```

## 贡献

欢迎提交 Issue 和 Pull Request。

## 许可证

ISC 