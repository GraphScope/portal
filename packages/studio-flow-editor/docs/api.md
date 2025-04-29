---
order: 6
title: API 文档
---

# API 文档

本文档详细介绍了 `@graphscope/studio-flow-editor` 包提供的所有 API，包括组件、钩子和类型定义。

## GraphProvider

### 描述

`GraphProvider` 是图编辑器的状态提供者，用于创建和管理图编辑器的状态。所有需要访问或修改图状态的组件都必须放在其内部。

### 属性

| 属性名     | 类型      | 必填 | 默认值         | 描述                               |
| ---------- | --------- | ---- | -------------- | ---------------------------------- |
| `id`       | string    | 否   | 自动生成的UUID | 图实例ID，用于区分多个图编辑器实例 |
| `children` | ReactNode | 是   | -              | 子组件                             |

### 示例

```bash
<GraphProvider id="my-graph">
  <GraphEditor />
  {/* 其他需要访问图状态的组件 */}
</GraphProvider>
```

## GraphEditor

### 描述

`GraphEditor` 是主要的图编辑器组件，提供了交互式的图形编辑界面。它必须包裹在 `GraphProvider` 内部。

### 属性

| 属性名              | 类型                                                 | 必填 | 默认值 | 描述                                 |
| ------------------- | ---------------------------------------------------- | ---- | ------ | ------------------------------------ |
| `children`          | ReactNode                                            | 否   | -      | 子组件，可用于添加自定义UI           |
| `nodesDraggable`    | boolean                                              | 否   | true   | 节点是否可拖动                       |
| `isPreview`         | boolean                                              | 否   | false  | 是否预览模式，预览模式下禁用编辑功能 |
| `onNodesChange`     | (nodes: ISchemaNode[]) => void                       | 否   | -      | 节点变化时的回调函数                 |
| `onEdgesChange`     | (edges: ISchemaEdge[]) => void                       | 否   | -      | 边变化时的回调函数                   |
| `onSelectionChange` | (nodes: ISchemaNode[], edges: ISchemaEdge[]) => void | 否   | -      | 选择变化时的回调函数                 |
| `noDefaultLabel`    | boolean                                              | 否   | false  | 是否不使用默认标签                   |
| `defaultNodes`      | ISchemaNode[]                                        | 否   | []     | 默认节点数据                         |
| `defaultEdges`      | ISchemaEdge[]                                        | 否   | []     | 默认边数据                           |

### 示例

```bash
<GraphEditor
  nodesDraggable={true}
  isPreview={false}
  onNodesChange={(nodes) => console.log('Nodes changed:', nodes)}
  onEdgesChange={(edges) => console.log('Edges changed:', edges)}
  noDefaultLabel={false}
  defaultNodes={initialNodes}
  defaultEdges={initialEdges}
>
  {/* 可选的自定义UI组件 */}
</GraphEditor>
```

## Hooks

### useGraphStore

#### 描述

访问和修改图编辑器状态的主要钩子。

#### 签名

```bash
function useGraphStore(id?: string): {
  store: GraphState;
  updateStore: (updater: (draft: GraphState) => void) => void;
};
```

#### 参数

| 参数名 | 类型   | 必填 | 默认值         | 描述             |
| ------ | ------ | ---- | -------------- | ---------------- |
| `id`   | string | 否   | 当前上下文的ID | 要访问的图实例ID |

#### 返回值

| 名称          | 类型                                           | 描述               |
| ------------- | ---------------------------------------------- | ------------------ |
| `store`       | GraphState                                     | 图状态对象         |
| `updateStore` | (updater: (draft: GraphState) => void) => void | 用于更新状态的函数 |

#### 示例

```bash
import { useGraphStore } from '@graphscope/studio-flow-editor';

const MyComponent = () => {
  const { store, updateStore } = useGraphStore();

  const addNewNode = () => {
    updateStore(draft => {
      draft.nodes.push({
        id: `node-${Date.now()}`,
        position: { x: 100, y: 100 },
        data: { label: '新节点' },
        type: 'graph-node'
      });
    });
  };

  return (
    <div>
      <button onClick={addNewNode}>添加节点</button>
      <div>节点数量: {store.nodes.length}</div>
    </div>
  );
};
```

### useClearCanvas

#### 描述

提供清除画布或删除选中元素的功能。

#### 签名

```bash
function useClearCanvas(): {
  handleClear: () => void;
};
```

#### 返回值

| 名称          | 类型       | 描述                         |
| ------------- | ---------- | ---------------------------- |
| `handleClear` | () => void | 删除选中元素或清空画布的函数 |

#### 行为

- 如果有选中的节点（selectedNodeIds 不为空），会删除这些节点及与之相关的边
- 如果有选中的边（selectedEdgeIds 不为空），会删除这些边
- 如果没有选中任何元素，会清空整个画布并重置标签索引

#### 示例

```bash
import { useClearCanvas } from '@graphscope/studio-flow-editor';

const DeleteButton = () => {
  const { handleClear } = useClearCanvas();

  return (
    <button onClick={handleClear}>
      删除选中/清空
    </button>
  );
};
```

### useAddNode

#### 描述

提供添加新节点的功能。

#### 签名

```bash
function useAddNode({noDefaultLabel}:{noDefaultLabel: string}): {handleAddVertex:(position?: { x: number; y: number }) => void;}
```

#### 返回值

| 名称              | 类型                                          | 描述           |
| ----------------- | --------------------------------------------- | -------------- |
| `handleAddVertex` | (position?: { x: number; y: number }) => void | 添加节点的函数 |

#### 参数

| 参数名     | 类型                     | 必填 | 默认值   | 描述             |
| ---------- | ------------------------ | ---- | -------- | ---------------- |
| `position` | { x: number; y: number } | 否   | 视口中心 | 新节点的位置坐标 |

#### 示例

```bash
import { useAddNode } from '@graphscope/studio-flow-editor';

const AddNodeButton = () => {
  const handleAddVertex = useAddNode();

  return <button onClick={() => handleAddVertex({ x: 100, y: 100 })}>添加节点</button>;
};
```

### useExportSvg

#### 描述

提供导出SVG图片的功能。

#### 签名

```bash
function useExportSvg(): { exportSvg: ({name?: string,parentId?: string}) => void };
```

#### 返回值

| 名称        | 类型                                        | 描述          |
| ----------- | ------------------------------------------- | ------------- |
| `exportSvg` | ({name?: string,parentId?: string}) => void | 导出SVG的函数 |

#### 参数

| 参数名 | 类型   | 必填 | 默认值      | 描述           |
| ------ | ------ | ---- | ----------- | -------------- |
| `name` | string | 否   | 'graph.svg' | 导出文件的名称 |
| `parentId` | string | 否 | - | 当存在多个图形实例时，指定要导出的图形实例的上层dom ID |

#### 示例

```bash
import { useExportSvg } from '@graphscope/studio-flow-editor';

const ExportButton = () => {
  const { exportSvg } = useExportSvg();

  return <button onClick={() => exportSvg({name:'my-graph.svg'})}>导出SVG</button>;
};
```

## 类型定义

### GraphState

图编辑器的完整状态类型。

```typescript
interface GraphState {
  displayMode: 'graph' | 'table'; // 显示模式
  nodes: ISchemaNode[]; // 节点列表
  edges: ISchemaEdge[]; // 边列表
  nodePositionChange: NodePositionChange[]; // 节点位置变更
  hasLayouted: boolean; // 是否已布局
  elementOptions: {
    // 元素选项
    isEditable: boolean; // 是否可编辑
    isConnectable: boolean; // 是否可连接
  };
  theme: {
    // 主题
    primaryColor: string; // 主色调
  };
  currentId: string; // 当前选中元素ID
  currentType: 'nodes' | 'edges'; // 当前选中元素类型
  selectedNodeIds: string[]; // 选中的节点ID数组
  selectedEdgeIds: string[]; // 选中的边ID数组
}
```

### ISchemaNode

图节点的类型定义。

```typescript
type ISchemaNode = Node<INodeData>;

interface INodeData {
  label: string; // 节点标签
  disabled?: boolean; // 是否禁用
  properties?: Property[]; // 节点属性
  dataFields?: string[]; // 数据字段
  delimiter?: string; // 分隔符
  datatype?: 'csv' | 'odps'; // 数据类型
  filelocation?: string; // 文件位置
  [key: string]: any; // 其他自定义属性
}
```

### ISchemaEdge

图边的类型定义。

```typescript
type ISchemaEdge = Edge<IEdgeData> & { data: IEdgeData };

interface IEdgeData {
  label: string; // 边标签
  disabled?: boolean; // 是否禁用
  saved?: boolean; // 是否已保存
  properties?: Property[]; // 边属性
  source_vertex_fields?: Property; // 源节点字段
  target_vertex_fields?: Property; // 目标节点字段
  dataFields?: string[]; // 数据字段
  delimiter?: string; // 分隔符
  datatype?: 'csv' | 'odps'; // 数据类型
  filelocation?: string; // 文件位置
  _extra?: {
    // 额外配置
    type?: string; // 类型
    offset?: string; // 偏移量
    isLoop: boolean; // 是否自环
    isRevert?: boolean; // 是否反向
    isPoly?: boolean; // 是否多边
    index?: number; // 索引
    count?: number; // 计数
  };
  [key: string]: any; // 其他自定义属性
}
```

## 工具函数

### getBBox

计算一组节点的边界框。

#### 签名

```typescript
function getBBox(nodes: Node[]): {
  x: number;
  y: number;
  width: number;
  height: number;
};
```

#### 参数

| 参数名  | 类型   | 描述                   |
| ------- | ------ | ---------------------- |
| `nodes` | Node[] | 要计算边界框的节点数组 |

#### 返回值

| 属性名   | 类型   | 描述                |
| -------- | ------ | ------------------- |
| `x`      | number | 边界框左上角的X坐标 |
| `y`      | number | 边界框左上角的Y坐标 |
| `width`  | number | 边界框宽度          |
| `height` | number | 边界框高度          |

### createNodeLabel

生成节点的默认标签，格式为 "Vertex_n"，其中 n 是自增序号。

#### 签名

```typescript
function createNodeLabel(): string;
```

#### 返回值

节点标签字符串，例如 "Vertex_1", "Vertex_2" 等。

### createEdgeLabel

生成边的默认标签，格式为 "Edge_n"，其中 n 是自增序号。

#### 签名

```typescript
function createEdgeLabel(): string;
```

#### 返回值

边标签字符串，例如 "Edge_1", "Edge_2" 等。

### resetIndex

重置节点和边标签的自增序号，使之重新从1开始。

#### 签名

```typescript
function resetIndex(): void;
```

### fakeSnapshot

创建对象的深拷贝。

#### 签名

```typescript
function fakeSnapshot<T>(obj: T): T;
```

#### 参数

| 参数名 | 类型 | 描述           |
| ------ | ---- | -------------- |
| `obj`  | T    | 要深拷贝的对象 |

#### 返回值

| 类型 | 描述           |
| ---- | -------------- |
| T    | 原对象的深拷贝 |
