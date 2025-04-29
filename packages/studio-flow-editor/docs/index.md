---
order: 0
title: 写在前面
---

# Studio Flow Editor

## 写在前面

### 概述

`@graphscope/studio-flow-editor` 是一个基于 React 的图编辑器组件库，提供了一套完整的图数据可视化和交互编辑解决方案。该库基于 ReactFlow 构建，支持节点与边的直观编辑、自动布局以及高度可定制的图形表示。

### 主要特性

- **交互式编辑**：支持拖拽式创建、移动节点和连线
- **状态管理**：集成 Zustand 进行高效状态管理
- **多实例支持**：允许在同一页面创建多个独立图编辑器
- **自动布局**：内置力导向图布局算法
- **类型安全**：完整的 TypeScript 类型定义
- **自定义外观**：可定制节点和边的样式与行为
- **导出功能**：支持导出为 SVG 图片

### 主要组件一览

#### GraphEditor

主编辑器组件，提供可视化图编辑功能。

```typescript
interface ImportorProps {
  id?: string;                                 // 编辑器实例ID
  children?: React.ReactNode;                  // 子组件
  nodesDraggable?: boolean;                    // 节点是否可拖拽
  isPreview?: boolean;                         // 是否为预览模式
  onNodesChange?: (nodes: ISchemaNode[]) => void; // 节点变化回调
  onEdgesChange?: (edges: ISchemaEdge[]) => void; // 边变化回调
  onSelectionChange?: (nodes: ISchemaNode[], edges: ISchemaEdge[]) => void; // 选择变化回调
  noDefaultLabel?: boolean;                    // 是否禁用默认标签
  defaultNodes?: ISchemaNode[];                // 初始节点
  defaultEdges?: ISchemaEdge[];                // 初始边
}
```

#### GraphProvider 

状态管理提供者，负责管理图编辑器的所有状态。

```typescript
interface GraphProviderProps {
  id?: string;                 // 图实例ID，默认自动生成
  children: React.ReactNode;   // 子组件
}
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

### 钩子(Hooks)一览

| 钩子名称 | 返回值 | 描述 |
|---------|-------|------|
| `useGraphStore` | `{ store, updateStore }` | 访问和更新图状态 |
| `useClearCanvas` | `{ handleClear }` | 清除画布或删除选中元素 |
| `useAddNode` | `{ handleAddVertex }` | 添加新节点到画布 |
| `useExportSvg` | `{ exportSvg }` | 导出图为SVG或图片 |

### 工具组件一览

| 组件名称 | 描述 |
|---------|------|
| `AddNode` | 添加节点按钮组件 |
| `ClearCanvas` | 清空/删除选中元素按钮组件 |
| `ExportSvg` | 导出SVG按钮组件 |

## 文档导航

- [快速开始](./quick-start.md) - 安装指南和基本使用方法
- [API文档](./api.md) - 详细的API参考
- [组件](./components.md) - 工具组件使用指南
- [示例](./demos.md) - 实用示例和高级用法
