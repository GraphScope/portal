---
order: 7
title: 工具函数
---
# 工具函数

`@graphscope/studio-flow-editor` 包提供了多个工具函数，帮助您处理图编辑中常见的任务。

## 布局工具

### getBBox

计算一组节点的边界框，用于确定需要可见的区域。

```typescript
function getBBox(nodes: Node[]): {
  x: number;
  y: number;
  width: number;
  height: number;
};
```

**示例：**
```bash
import { getBBox } from '@graphscope/studio-flow-editor';

const nodes = [
  { id: '1', position: { x: 100, y: 100 } },
  { id: '2', position: { x: 200, y: 300 } }
];

const bbox = getBBox(nodes);
// 返回: { x: 100, y: 100, width: 200, height: 300 }
```

## 标签工具

### createNodeLabel

为新节点生成唯一标签。

```typescript
function createNodeLabel(): string;
```

**示例：**
```bash
import { createNodeLabel } from '@graphscope/studio-flow-editor';

const newNodeLabel = createNodeLabel();
// 返回: "Vertex_1", "Vertex_2", 等
```

### createEdgeLabel

为新边生成唯一标签。

```bash
function createEdgeLabel(): string;
```

**示例：**
```bash
import { createEdgeLabel } from '@graphscope/studio-flow-editor';

const newEdgeLabel = createEdgeLabel();
// 返回: "Edge_1", "Edge_2", 等
```

### resetIndex

重置用于生成节点和边标签的内部计数器。

```bash
function resetIndex(): void;
```

**示例：**
```bash
import { resetIndex } from '@graphscope/studio-flow-editor';

resetIndex();
// 下次调用 createNodeLabel() 将返回 "Vertex_1"
```

## 数据处理工具

### fakeSnapshot

创建对象的深拷贝。当您需要克隆图数据以避免意外修改时，这非常有用。

```bash
function fakeSnapshot<T>(obj: T): T;
```

**示例：**
```bash
import { fakeSnapshot } from '@graphscope/studio-flow-editor';

const originalNodes = [...];
const nodesCopy = fakeSnapshot(originalNodes);
// 现在可以修改 nodesCopy 而不会影响 originalNodes
```

## 类型定义

该包还导出了几个在处理图数据时有用的 TypeScript 类型定义：

### INodeData

```typescript
interface INodeData {
  label: string;
  disabled?: boolean;
  properties?: Property[];
  dataFields?: string[];
  delimiter?: string;
  datatype?: 'csv' | 'odps';
  filelocation?: string;
  [key: string]: any;
}
```

### IEdgeData

```typescript
interface IEdgeData {
  label: string;
  disabled?: boolean;
  saved?: boolean;
  properties?: Property[];
  source_vertex_fields?: Property;
  target_vertex_fields?: Property;
  dataFields?: string[];
  delimiter?: string;
  datatype?: 'csv' | 'odps';
  filelocation?: string;
  _extra?: {
    type?: string;
    offset?: string;
    isLoop: boolean;
    isRevert?: boolean;
    isPoly?: boolean;
    index?: number;
    count?: number;
  };
  [key: string]: any;
}
```

### ISchemaNode 和 ISchemaEdge

```typescript
type ISchemaNode = Node<INodeData>;
type ISchemaEdge = Edge<IEdgeData> & { data: IEdgeData };
```
