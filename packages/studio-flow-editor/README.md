# Studio Flow Editor

## 概述

`@graphscope/studio-flow-editor` 是一个基于 React 的图编辑器组件库，提供了一套完整的图数据可视化和交互编辑解决方案。该库基于 ReactFlow 构建，支持节点与边的直观编辑、自动布局以及高度可定制的图形表示。

## 主要特性

- **交互式编辑**：支持拖拽式创建、移动节点和连线
- **状态管理**：集成 Zustand 进行高效状态管理
- **多实例支持**：允许在同一页面创建多个独立图编辑器
- **自动布局**：内置力导向图布局算法
- **类型安全**：完整的 TypeScript 类型定义
- **自定义外观**：可定制节点和边的样式与行为
- **导出功能**：支持导出为 SVG 图片

## 安装

```bash
# 使用npm
npm install @graphscope/studio-flow-editor

# 使用yarn
yarn add @graphscope/studio-flow-editor

# 使用pnpm
pnpm add @graphscope/studio-flow-editor
```

## 基本用法

下面是一个最简单的例子，展示了如何创建一个基本的图编辑器：

```jsx
import React from 'react';
import { GraphProvider, GraphCanvas } from '@graphscope/studio-flow-editor';

const App = () => {
  return (
    <div style={{ width: '100%', height: '600px', position: 'relative' }}>
      <GraphProvider>
        <GraphCanvas />
      </GraphProvider>
    </div>
  );
};

export default App;
```

## 主要组件

### GraphProvider

状态管理提供者，负责管理图编辑器的所有状态。

```jsx
<GraphProvider id="custom-graph-id">
  {children}
</GraphProvider>
```

#### 属性

| 属性名    | 类型            | 必填 | 默认值 | 描述                       |
|-----------|-----------------|------|--------|----------------------------|
| id        | string          | 否   | 自动生成 | 图实例ID，用于多实例管理   |
| children  | React.ReactNode | 是   | -      | 子组件                     |

### GraphCanvas

主编辑器组件，提供可视化图编辑功能。

```jsx
<GraphCanvas
  nodesDraggable={true}
  isPreview={false}
  onNodesChange={(nodes) => console.log(nodes)}
  onEdgesChange={(edges) => console.log(edges)}
  onSelectionChange={(nodes, edges) => console.log('selection changed')}
  noDefaultLabel={false}
  defaultNodes={[]}
  defaultEdges={[]}
>
  {/* 自定义子组件 */}
</GraphCanvas>
```

#### 属性

| 属性名            | 类型                                                 | 必填 | 默认值  | 描述                       |
|-------------------|------------------------------------------------------|------|---------|----------------------------|
| children          | React.ReactNode                                      | 否   | -       | 子组件                     |
| nodesDraggable    | boolean                                              | 否   | true    | 节点是否可拖拽             |
| isPreview         | boolean                                              | 否   | false   | 是否为预览模式             |
| onNodesChange     | (nodes: ISchemaNode[]) => void                       | 否   | -       | 节点变化回调               |
| onEdgesChange     | (edges: ISchemaEdge[]) => void                       | 否   | -       | 边变化回调                 |
| onSelectionChange | (nodes: ISchemaNode[], edges: ISchemaEdge[]) => void | 否   | -       | 选择变化回调               |
| noDefaultLabel    | boolean                                              | 否   | false   | 是否禁用默认标签           |
| defaultNodes      | ISchemaNode[]                                        | 否   | []      | 初始节点                   |
| defaultEdges      | ISchemaEdge[]                                        | 否   | []      | 初始边                     |

## 工具组件

### AddNode

添加新节点的按钮组件。

```jsx
import { AddNode } from '@graphscope/studio-flow-editor';

// 基本用法
<AddNode />

// 自定义样式
<AddNode style={{ backgroundColor: '#1890ff', color: 'white' }} />
```

#### 属性

| 属性名 | 类型                | 必填 | 默认值 | 描述         |
|--------|---------------------|------|--------|--------------|
| style  | React.CSSProperties | 否   | -      | 内联样式对象 |

### ClearCanvas

清除画布或删除选中元素的按钮组件。

```jsx
import { ClearCanvas } from '@graphscope/studio-flow-editor';

// 基本用法
<ClearCanvas />

// 自定义样式
<ClearCanvas style={{ backgroundColor: '#ff4d4f', color: 'white' }} />
```

#### 属性

| 属性名 | 类型                | 必填 | 默认值 | 描述         |
|--------|---------------------|------|--------|--------------|
| style  | React.CSSProperties | 否   | -      | 内联样式对象 |

### ExportSvg

导出图为SVG文件的按钮组件。

```jsx
import { ExportSvg } from '@graphscope/studio-flow-editor';

// 基本用法
<ExportSvg />

// 自定义样式和文件名
<ExportSvg
  style={{ backgroundColor: '#52c41a', color: 'white' }}
  fileName="demo.svg"
  parentId="graph-container"
/>
```

#### 属性

| 属性名   | 类型                | 必填 | 默认值     | 描述                                     |
|----------|---------------------|------|------------|------------------------------------------|
| style    | React.CSSProperties | 否   | -          | 内联样式对象                             |
| fileName | string              | 否   | 'graph.svg' | 导出文件名                               |
| parentId | string              | 否   | -          | 存在多个图形实例时，指定导出图上层dom的id |

## Hooks

### useGraphStore

访问和更新图状态的主要钩子。

```jsx
import { useGraphStore } from '@graphscope/studio-flow-editor';

// 获取状态和更新函数
const { store, updateStore } = useGraphStore();

// 读取状态
const { nodes, edges, currentId } = store;

// 更新状态
updateStore(draft => {
  draft.nodes.push(newNode);
});

// 使用选择器优化性能
const nodes = useGraphStore(state => state.nodes);
```

#### 状态结构

```typescript
interface GraphState {
  displayMode: 'graph' | 'table';              // 显示模式
  nodes: ISchemaNode[];                        // 节点列表
  edges: ISchemaEdge[];                        // 边列表
  nodePositionChange: NodePositionChange[];    // 节点位置变更
  hasLayouted: boolean;                        // 是否已布局
  elementOptions: {                            // 元素选项
    isEditable: boolean;                       // 是否可编辑
    isConnectable: boolean;                    // 是否可连接
  };
  theme: {                                     // 主题
    primaryColor: string;                      // 主色调
  };
  currentId: string;                           // 当前选中元素ID
  currentType: 'nodes' | 'edges';              // 当前选中元素类型
  selectedNodeIds: string[];                   // 选中的节点ID数组
  selectedEdgeIds: string[];                   // 选中的边ID数组
}
```

### useClearCanvas

清空画布或删除选中元素的钩子。

```jsx
import { useClearCanvas } from '@graphscope/studio-flow-editor';

const { handleClear } = useClearCanvas();

// 清空画布或删除选中元素
handleClear();
```

### useAddNode

添加新节点到画布的钩子。

```jsx
import { useAddNode } from '@graphscope/studio-flow-editor';

const { handleAddVertex } = useAddNode();

// 在指定位置添加节点
handleAddVertex({ x: 100, y: 100 });
```

### useExportSvg

导出图为SVG或图片的钩子。

```jsx
import { useExportSvg } from '@graphscope/studio-flow-editor';

const { exportSvg } = useExportSvg();

// 导出为SVG
exportSvg({ name: 'graph.svg' });
```

## 工具函数

### 布局工具

```jsx
import { getBBox } from '@graphscope/studio-flow-editor';

// 获取节点边界框
const bbox = getBBox(nodes);
// 返回: { x, y, width, height }
```

### 标签工具

```jsx
import { createNodeLabel, createEdgeLabel, resetIndex } from '@graphscope/studio-flow-editor';

// 创建节点标签（自动递增 - Vertex_1, Vertex_2, ...）
const nodeLabel = createNodeLabel();

// 创建边标签（自动递增 - Edge_1, Edge_2, ...）
const edgeLabel = createEdgeLabel();

// 重置标签索引
resetIndex();
```

### 数据处理

```jsx
import { fakeSnapshot } from '@graphscope/studio-flow-editor';

// 创建数据快照（深拷贝）
const snapshot = fakeSnapshot(data);
```

## 类型定义

```typescript
// 节点数据类型
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

// 边数据类型
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

// 节点和边的类型
type ISchemaNode = Node<INodeData>;
type ISchemaEdge = Edge<IEdgeData> & { data: IEdgeData };
```

## 组合使用示例

这些组件通常组合在一起使用，创建一个完整的工具栏：

```jsx
import React from 'react';
import { 
  GraphProvider, 
  GraphCanvas, 
  AddNode, 
  ClearCanvas, 
  ExportSvg 
} from '@graphscope/studio-flow-editor';

const ToolbarStyle = {
  position: 'absolute',
  top: '10px',
  right: '10px',
  zIndex: 10,
  display: 'flex',
  gap: '8px',
  background: 'white',
  padding: '8px',
  borderRadius: '4px',
  boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
};

const App = () => {
  return (
    <div style={{ width: '100%', height: '600px', position: 'relative' }} id="graph-container">
      <GraphProvider>
        <GraphCanvas>
          <div style={ToolbarStyle}>
            <AddNode />
            <ClearCanvas />
            <ExportSvg parentId="graph-container" />
          </div>
        </GraphCanvas>
      </GraphProvider>
    </div>
  );
};

export default App;
```

## 多实例支持

您可以通过指定不同的 `id` 在同一页面上创建多个独立的流程图实例：

```jsx
<div style={{ display: 'flex', width: '100%', height: '600px' }}>
  <div style={{ flex: 1, position: 'relative' }}>
    <GraphProvider id="graph1">
      <GraphCanvas />
    </GraphProvider>
  </div>
  
  <div style={{ flex: 1, position: 'relative' }}>
    <GraphProvider id="graph2">
      <GraphCanvas />
    </GraphProvider>
  </div>
</div>
```


