---
order: 3
title: GraphCanvas 组件
---

# GraphCanvas 组件

`GraphCanvas` 组件是 `@graphscope/studio-flow-editor` 包的核心组件，提供了完整的图形可视化和交互编辑功能。本文档详细介绍该组件的用法和配置选项。

## 导入方式

```bash
import { GraphCanvas } from '@graphscope/studio-flow-editor';
```

## 基本用法

```bash
import React from 'react';
import { GraphProvider, GraphCanvas } from '@graphscope/studio-flow-editor';

const MyGraph = () => {
  return (
    <GraphProvider>
      <GraphCanvas>
        {/* 可在此添加自定义UI组件 */}
      </GraphCanvas>
    </GraphProvider>
  );
};
```

## 属性配置

| 属性名              | 类型          | 默认值  | 说明                                   |
| ------------------- | ------------- | ------- | -------------------------------------- |
| `children`          | ReactNode     | -       | 可以在编辑器内部渲染的自定义UI元素     |
| `nodesDraggable`    | boolean       | `true`  | 是否允许拖拽节点                       |
| `isPreview`         | boolean       | `false` | 是否为预览模式，预览模式下禁用编辑功能 |
| `onNodesChange`     | function      | -       | 节点变化时的回调函数                   |
| `onEdgesChange`     | function      | -       | 边变化时的回调函数                     |
| `onSelectionChange` | function      | -       | 选择变化时的回调函数                   |
| `noDefaultLabel`    | boolean       | -       | 是否禁用默认标签生成                   |
| `defaultNodes`      | ISchemaNode[] | -       | 初始节点列表                           |
| `defaultEdges`      | ISchemaEdge[] | -       | 初始边列表                             |

## 功能特性

`GraphCanvas` 组件提供以下核心功能：

1. **节点管理**

   - 点击或拖拽创建节点
   - 拖拽移动节点位置
   - 键盘或右键菜单删除节点
   - 使用Shift+点击或框选多选节点

2. **边管理**

   - 从一个节点拖拽到另一个节点创建边
   - 编辑边的属性和标签
   - 键盘或右键菜单删除边
   - 支持自环边和多边

3. **画布导航**

   - 拖拽背景平移视图
   - 鼠标滚轮缩放
   - 双击背景适应视图

4. **布局功能**
   - 自动力导向布局初始定位
   - 手动调整节点位置
   - 支持自定义布局配置

## 内部组件结构

`GraphCanvas` 组件内部由多个组件组合而成：

- **GraphCanvas**：主要的画布区域，包含节点和边
- **ReactFlow**：底层的 ReactFlow 组件，负责图形渲染
- **ArrowMarker**：定义边的箭头样式
- **ConnectionLine**：创建新连接时显示的连接线样式

## 键盘快捷键

- **Delete/Backspace**：删除选中的节点/边
- **Escape**：取消当前操作/选择

## 与 GraphProvider 集成

`GraphCanvas` 必须在 `GraphProvider` 内使用才能访问共享状态：

```bash
<GraphProvider>
  <GraphCanvas />
</GraphProvider>
```


## 添加初始数据

可以通过 `defaultNodes` 和 `defaultEdges` 属性为编辑器提供初始数据：

```jsx
import React from 'react';
import { GraphProvider, GraphCanvas } from '@graphscope/studio-flow-editor';

const App = () => {
  // 初始节点数据
  const initialNodes = [
    {
      id: 'node-1',
      type: 'graph-node',
      position: { x: 100, y: 100 },
      data: { label: '节点1' },
    },
    {
      id: 'node-2',
      type: 'graph-node',
      position: { x: 300, y: 200 },
      data: { label: '节点2' },
    },
  ];

  // 初始边数据
  const initialEdges = [
    {
      id: 'edge-1',
      source: 'node-1',
      target: 'node-2',
      type: 'graph-edge',
      data: { label: '连接线' },
    },
  ];

  return (
    <div style={{ width: '100%', height: '600px', position: 'relative' }}>
      <GraphProvider>
        <GraphCanvas defaultNodes={initialNodes} defaultEdges={initialEdges} />
      </GraphProvider>
    </div>
  );
};

export default App;
```

## 监听变化

编辑器支持通过回调函数监听节点和边的变化(打开控制台查看console面板)：

```jsx
import React, { useState } from 'react';
import { GraphProvider, GraphCanvas, AddNode, ClearCanvas } from '@graphscope/studio-flow-editor';
import { Card, Divider } from 'antd';
import { Toolbar } from '@graphscope/studio-components';

const App = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const handleNodesChange = newNodes => {
    console.log('节点发生变化:', newNodes);
    setNodes(newNodes);
  };

  const handleEdgesChange = newEdges => {
    console.log('边发生变化:', newEdges);
    setEdges(newEdges);
  };

  const handleSelectionChange = (selectedNodes, selectedEdges) => {
    console.log('选中节点:', selectedNodes);
    console.log('选中边:', selectedEdges);
    setSelectedNodes(selectedNodes);
    setSelectedEdges(selectedEdges);
  };

  return (
    <div style={{ width: '100%', height: '600px', position: 'relative' }}>
      <GraphProvider>
        <GraphCanvas onNodesChange={handleNodesChange} onEdgesChange={handleEdgesChange}>
          <Toolbar style={{ top: '12px', right: '24px', left: 'unset' }} direction="vertical">
            <AddNode />
            <ClearCanvas />
          </Toolbar>
          <div style={{ width: 300, position: 'absolute', top: '100px', right: '10px', zIndex: 10, overflow: 'auto' }}>
            <Card title="节点变化监控面板">
              <p style={{ overflow: 'auto' }}>节点变化：{JSON.stringify(nodes)}</p>
            </Card>
          </div>
          <div style={{ width: 300, position: 'absolute', top: '100px', left: '10px', zIndex: 10, overflow: 'auto' }}>
            <Card title="边变化监控面板">
              <p style={{ overflow: 'auto' }}>{JSON.stringify(edges)}</p>
            </Card>
          </div>
        </GraphCanvas>
      </GraphProvider>
    </div>
  );
};

export default App;
```

## 添加自定义控制面板

可以利用内置的钩子函数在编辑器中添加自定义控制面板：

```jsx
import React from 'react';
import {
  GraphProvider,
  GraphCanvas,
  useGraphStore,
  useAddNode,
  useClearCanvas,
  useExportSvg,
} from '@graphscope/studio-flow-editor';
import { MiniMap } from 'reactflow';

// 自定义控制面板组件
const ControlPanel = () => {
  const { store } = useGraphStore();
  const { nodes, edges, currentId, currentType } = store;
  const { handleAddVertex } = useAddNode();
  const { handleClear } = useClearCanvas();
  const { exportSvg } = useExportSvg();
  return (
    <div
      style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        zIndex: 10,
        background: 'white',
        padding: '10px',
        borderRadius: '4px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
      }}
    >
      <div style={{ marginBottom: '10px' }}>
        <button onClick={() => handleAddVertex({ x: 100, y: 100 })}>添加节点</button>
        <button onClick={handleClear} style={{ marginLeft: '8px' }}>
          删除选中/清空
        </button>
        <button onClick={() => exportSvg({ name: 'graph.svg', parentId: 'graphPanel' })} style={{ marginLeft: '8px' }}>
          导出SVG
        </button>
      </div>
      <div>
        <div>节点数量: {nodes.length}</div>
        <div>边数量: {edges.length}</div>
        {currentId && (
          <div>
            当前选中: {currentType === 'nodes' ? '节点' : '边'} {currentId}
          </div>
        )}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <div style={{ width: '100%', height: '600px', position: 'relative' }} id="graphPanel">
      <GraphProvider>
        <GraphCanvas>
          <ControlPanel />
          <MiniMap />
        </GraphCanvas>
      </GraphProvider>
    </div>
  );
};

export default App;
```

## 使用内置控制组件

Studio Flow Editor 提供了几个预定义的控制组件，可以直接使用：

```jsx
import React from 'react';
import { Toolbar } from '@graphscope/studio-components';
import { GraphProvider, GraphCanvas, AddNode, ClearCanvas, ExportSvg } from '@graphscope/studio-flow-editor';

const App = () => {
  return (
    <div style={{ width: '100%', height: '600px', position: 'relative' }}>
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
  );
};

export default App;
```



## 自定义节点编辑器示例

```jsx
import React from 'react';
import { Toolbar } from '@graphscope/studio-components';
import {
  GraphProvider,
  GraphCanvas,
  AddNode,
  ClearCanvas,
  useGraphStore,
} from '@graphscope/studio-flow-editor';

// 自定义节点编辑面板
const CustomNodePanel = () => {
  const { store, updateStore } = useGraphStore();
  const { currentId, nodes, edges } = store;

  const currentItem = [...nodes,...edges].find(item => item.id === currentId);


  const updateNodeLabel = newLabel => {
    updateStore(draft => {
      const node = draft.nodes.find(n => n.id === currentId);
      const edge = draft.edges.find(e => e.id === currentId);
      if (node) {
        node.data.label = newLabel;
      }
      if(edge){
        edge.data.label = newLabel;
      }
    });
  };

  return (
    <div style={{ position: 'absolute', right: 20, top: 20, width: 250, zIndex: 4 }}>
      {currentItem && <input value={currentItem.data.label} onChange={e => updateNodeLabel(e.target.value)} />}
    </div>
  );
};

// 完整示例
const MyGraphCanvas = () => {
  return (
    <div style={{ height: '50vh', position: 'relative' }}>
      <GraphProvider>
        <GraphCanvas>
          <Toolbar>
            <AddNode />
            <ClearCanvas />
          </Toolbar>
          <CustomNodePanel />
        </GraphCanvas>
      </GraphProvider>
    </div>
  );
};
export default MyGraphCanvas;
```
