# Studio Flow Editor

一个基于 ReactFlow 的流程图编辑器组件，提供图形化编辑、节点管理、边连接等功能。

## 特性

- 🎨 基于 ReactFlow 的流程图编辑器
- 📦 支持节点和边的增删改查
- 🖱️ 支持拖拽、缩放、平移等交互
- 🎯 支持自定义节点和边的样式
- 🔄 支持数据导入导出
- 🎮 提供丰富的工具函数和 hooks

## 安装

```bash
npm install @graphscope/studio-flow-editor
# 或
yarn add @graphscope/studio-flow-editor
```

## 快速开始

```tsx
import { GraphCanvas, GraphProvider } from '@graphscope/studio-flow-editor';

function App() {
  return (
    <GraphProvider>
      <GraphCanvas/>
    </GraphProvider>
  );
}
```

## 组件

### GraphCanvas

流程图编辑器主组件。

```tsx
<GraphCanvas/>
```

#### Props


| 参数           | 类型            | 说明                                       |
| -------------- | --------------- | ------------------------------------------ |
| children       | React.ReactNode | 可以在 ReactFlow 内部添加自定义子组件      |
| showBackground | boolean         | 可以在 ReactFlow 是否显示背景，默认为 true |
| showMinimap    | boolean         | 是否显示迷你地图，默认为 true              |
| showDefaultBtn | boolean         | 是否显示默认按钮控制器，默认为 true        |

### 按钮组件

#### AddNode

添加节点按钮。

```tsx
import { AddNode } from '@graphscope/studio-flow-editor';

<AddNode />
```

#### ClearCanvas

清空画布按钮。

```tsx
import { ClearCanvas } from '@graphscope/studio-flow-editor';

<ClearCanvas />
```

#### ExportSvg

导出 SVG 按钮。

```tsx
import { ExportSvg } from '@graphscope/studio-flow-editor';

<ExportSvg />
```

## Hooks

### useGraphStore

状态管理 hook。

```tsx
import { useGraphStore } from '@graphscope/studio-flow-editor';

const { store, updateStore } = useGraphStore();
```

### useClearCanvas

清空画布 hook。

```tsx
import { useClearCanvas } from '@graphscope/studio-flow-editor';

const { clearCanvas } = useClearCanvas();
```

### useAddNode

添加节点 hook。

```tsx
import { useAddNode } from '@graphscope/studio-flow-editor';

const { addNode } = useAddNode();
```

### useExportSvg

导出 SVG hook。

```tsx
import { useExportSvg } from '@graphscope/studio-flow-editor';

const { exportSvg } = useExportSvg();
```

## 工具函数

### 布局工具

```typescript
import {  getBBox } from '@graphscope/studio-flow-editor';

// 获取节点边界框
const bbox = getBBox(nodes);
```

### 标签工具

```typescript
import { createNodeLabel, createEdgeLabel } from '@graphscope/studio-flow-editor';

// 创建节点标签
const nodeLabel = createNodeLabel();

// 创建边标签
const edgeLabel = createEdgeLabel();
```

### 数据处理

```typescript
import { fakeSnapshot } from '@graphscope/studio-flow-editor';

// 创建数据快照
const snapshot = fakeSnapshot(data);


## 类型定义

```typescript
import { ISchemaNode, ISchemaEdge } from '@graphscope/studio-flow-editor';

// 节点类型
const node: ISchemaNode = {
  id: '1',
  type: 'default',
  position: { x: 0, y: 0 },
  data: { label: 'Node 1' }
};

// 边类型
const edge: ISchemaEdge = {
  id: 'e1-2',
  source: '1',
  target: '2',
  data: { label: 'Edge 1-2' }
};
```

