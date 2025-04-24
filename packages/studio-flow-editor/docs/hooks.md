---
order: 2
title: Hooks
---

## useGraphStore

状态管理 hook，用于访问和更新编辑器状态。

### 使用方式

```bash
import { updateStore } from '@graphscope/studio-flow-editor';
const { store, updateStore } = useGraphStore();
const { nodes, edges } = store;

// 更新状态
updateStore(draft => {
  draft.nodes = newNodes;
  draft.edges = newEdges;
});
```

### 状态结构

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
}
```

## useAddNode

提供添加节点的功能。

### 使用方式

```bash
import { useAddNode } from '@graphscope/studio-flow-editor';
const { addNode } = useAddNode();

// 添加节点
addNode();
```

## useClearCanvas

提供清空画布的功能。

### 使用方式

```bash
import { useClearCanvas } from '@graphscope/studio-flow-editor';
const { clearCanvas } = useClearCanvas();

// 清空画布
clearCanvas();
```

## useExportSvg

提供导出 SVG 图片的功能。

### 使用方式

```bash
import { useExportSvg } from '@graphscope/studio-flow-editor';
const { exportSvg } = useExportSvg();

// 导出 SVG
exportSvg('graph.svg');
``` 