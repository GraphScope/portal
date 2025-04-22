---
order: 2
title: Utils
---

### getBBox

获取节点的边界框。

```typescript
function getBBox(nodes: Node[]): {
  x: number;
  y: number;
  width: number;
  height: number;
}
```

## 标签工具

### createNodeLabel

创建节点标签名。

```typescript
function createNodeLabel(): string;
```

### createEdgeLabel

创建边标签名。

```typescript
function createEdgeLabel(): string;
```

## 数据处理

### fakeSnapshot

创建数据的快照。

```typescript
function fakeSnapshot<T>(data: T[]): T[];
```

## 类型定义

### ISchemaNode

节点类型定义。

```typescript
type ISchemaNode = Node<INodeData>;

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

### ISchemaEdge

边类型定义。

```typescript
type ISchemaEdge = Edge<IEdgeData> & { data: IEdgeData };

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