---
order: 2
title: GraphProvider
---

# 状态管理与Provider

`@graphscope/studio-flow-editor` 包使用Provider组件来管理应用中的状态和上下文。这些Provider组件是图形编辑器正常运行的基础。

## GraphProvider

`GraphProvider` 是图形编辑器的主要状态提供者。它创建一个上下文，用于保存和管理节点、边和其他图形相关数据的状态。

### 导入方式

```bash
import { GraphProvider } from '@graphscope/studio-flow-editor';
```

### 基本用法

```bash
import React from 'react';
import { GraphProvider, GraphCanvas } from '@graphscope/studio-flow-editor';

const App = () => {
  return (
    <GraphProvider id="my-graph">
      <GraphCanvas />
      {/* 其他需要访问图形状态的组件 */}
    </GraphProvider>
  );
};
```

### 属性配置

| 属性名     | 类型      | 默认值         | 说明                     |
| ---------- | --------- | -------------- | ------------------------ |
| `id`       | string    | 自动生成的UUID | 该图实例的唯一标识符     |
| `children` | ReactNode | -              | 需要访问图形状态的子组件 |

### 状态管理

`GraphProvider` 内部使用 [Zustand](https://github.com/pmndrs/zustand)（通过 `@graphscope/use-zustand`）来管理状态。初始状态结构如下：

```typescript
interface GraphState {
  displayMode: 'graph' | 'table';
  nodes: ISchemaNode[];
  edges: ISchemaEdge[];
  nodePositionChange: NodePositionChange[];
  hasLayouted: boolean;
  elementOptions: {
    isEditable: boolean;
    isConnectable: boolean;
  };
  theme: {
    primaryColor: string;
  };
  currentId: string;
  currentType: 'nodes' | 'edges';
  selectedNodeIds: string[];
  selectedEdgeIds: string[];
}
```

## 多实例支持

可以在同一页面创建多个独立的图编辑器实例：

```jsx
import React from 'react';
import { Toolbar } from '@graphscope/studio-components';
import { GraphProvider, GraphCanvas, AddNode, ClearCanvas, ExportSvg } from '@graphscope/studio-flow-editor';
import { Divider } from 'antd';

const App = () => {
  return (
    <div style={{ display: 'flex', height: '300px' }}>
      <div style={{ flex: 1, position: 'relative' }}>
        <GraphProvider>
          <GraphCanvas>
            <Toolbar>
              <AddNode />
              <ClearCanvas />
              <ExportSvg />
            </Toolbar>
          </GraphCanvas>
        </GraphProvider>
      </div>
      <Divider type="vertical" style={{ height: '100%' }} />
      <div style={{ flex: 1, position: 'relative' }}>
        <GraphProvider>
          <GraphCanvas>
            <Toolbar>
              <AddNode />
              <ClearCanvas />
              <ExportSvg />
            </Toolbar>
          </GraphCanvas>
        </GraphProvider>
      </div>
    </div>
  );
};

export default App;
```


## ReactFlowProvider

`ReactFlowProvider` 在内部用于为所有组件提供 ReactFlow 上下文。它已自动包含在 `GraphCanvas` 组件中，因此通常不需要直接使用它。

### 访问状态

要在 `GraphProvider` 的子组件中访问图状态，使用 `useGraphStore` 钩子：

```bash
import { useGraphStore } from '@graphscope/studio-flow-editor';

const MyComponent = () => {
  const { store, updateStore } = useGraphStore();

  return (
    <div>
      <p>节点数量: {store.nodes.length}</p>
      <p>边数量: {store.edges.length}</p>
    </div>
  );
};
```

### 更新状态

要更新图状态，使用 `useGraphStore` 提供的 `updateStore` 函数：

```bash
import { useGraphStore } from '@graphscope/studio-flow-editor';

const AddRandomNode = () => {
  const { updateStore } = useGraphStore();

  const handleClick = () => {
    updateStore(draft => {
      draft.nodes.push({
        id: `node-${Math.random().toString(36).substring(2, 9)}`,
        position: { x: Math.random() * 500, y: Math.random() * 500 },
        data: { label: '随机节点' },
        type: 'graph-node',
      });
    });
  };

  return <button onClick={handleClick}>添加随机节点</button>;
};
```

## 高级用法

### 嵌套Provider

可以嵌套Provider来创建复杂的状态层次结构：

```bash
import { GraphProvider } from '@graphscope/studio-flow-editor';
import { ThemeProvider } from 'your-theme-provider';

const App = () => {
  return (
    <ThemeProvider theme="dark">
      <GraphProvider id="main-graph">
        <GraphCanvas />
      </GraphProvider>
    </ThemeProvider>
  );
};
```

