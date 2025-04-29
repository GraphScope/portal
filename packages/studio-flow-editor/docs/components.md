---
order: 4
title: 组件文档
---
# 组件文档

`@graphscope/studio-flow-editor` 提供了几个预构建的组件，可以直接集成到您的应用中，简化图编辑器的操作与控制。

## AddNode

### 描述

一个添加新节点的按钮组件。

### 属性

| 属性名 | 类型 | 必填 | 默认值 | 描述 |
|-------|------|------|-------|------|
| `style` | React.CSSProperties | 否 | - | 内联样式对象 |

### 示例

```bash
import { AddNode } from '@graphscope/studio-flow-editor';

// 基本用法
<AddNode />

// 自定义样式和文本
<AddNode
  style={{ backgroundColor: '#1890ff', color: 'white' }}
/>
```

## ClearCanvas

### 描述

一个清除画布或删除选中元素的按钮组件。

### 属性

| 属性名 | 类型 | 必填 | 默认值 | 描述 |
|-------|------|------|-------|------|
| `style` | React.CSSProperties | 否 | - | 内联样式对象 |

### 行为

- 如果有选中的节点，会删除这些节点及相关边
- 如果有选中的边，会删除这些边
- 如果没有选中任何元素，会清空整个画布

### 示例

```bash
import { ClearCanvas } from '@graphscope/studio-flow-editor';

// 基本用法
<ClearCanvas />

// 自定义样式
<ClearCanvas
  style={{ backgroundColor: '#ff4d4f', color: 'white' }}
/>
```

## ExportSvg

### 描述

一个导出图为SVG文件的按钮组件。

### 属性

| 属性名 | 类型 | 必填 | 默认值 | 描述 |
|-------|------|------|-------|------|
| `style` | React.CSSProperties | 否 | - | 内联样式对象 |
| `fileName` | string | 'graph.svg' | - | 导出文件名 |
| `parentId` | string | 否 | - | 当页面内存在多个图形实例是，可指定导出图上层dom的id |
### 示例

```bash
import { ExportSvg } from '@graphscope/studio-flow-editor';

// 基本用法
<ExportSvg />

// 自定义样式和文件名
<ExportSvg
  style={{ backgroundColor: '#52c41a', color: 'white' }}
  fileName="demo.svg"
/>
```

## 组合使用

这些组件通常组合在一起使用，创建一个完整的工具栏：

```jsx
import React from 'react';
import { 
  GraphProvider, 
  GraphEditor, 
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

const ButtonStyle = {
  padding: '4px 12px',
  borderRadius: '2px',
  cursor: 'pointer',
  border: '1px solid #d9d9d9',
  backgroundColor: '#fff',
};

const App = () => {
  return (
    <div style={{ width: '100%', height: '600px', position: 'relative' }} id="testZh">
      <GraphProvider>
        <GraphEditor>
          <div style={ToolbarStyle}>
            <AddNode 
              style={ButtonStyle} 
            />
            <ClearCanvas 
              style={{ ...ButtonStyle, color: '#ff4d4f' }} 
            />
            <ExportSvg 
              parentId="testZh"
              style={ButtonStyle} 
            />
          </div>
        </GraphEditor>
      </GraphProvider>
    </div>
  );
};

export default App;
```

## 自定义组件集成

您也可以将这些内置组件与自定义组件结合使用，创建更丰富的控制面板：

```jsx
import React from 'react';
import { 
  GraphProvider, 
  GraphEditor, 
  useGraphStore,
  AddNode, 
  ClearCanvas 
} from '@graphscope/studio-flow-editor';

// 自定义信息面板
const InfoPanel = () => {
  const { store } = useGraphStore();
  
  return (
    <div style={{ 
      position: 'absolute', 
      bottom: '10px', 
      left: '10px', 
      zIndex: 4,
      background: 'white',
      padding: '8px',
      borderRadius: '4px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
    }}>
      <div>节点数量: {store.nodes.length}</div>
      <div>边数量: {store.edges.length}</div>
      {store.currentId && (
        <div>当前选中: {store.currentType === 'nodes' ? '节点' : '边'} {store.currentId}</div>
      )}
    </div>
  );
};

const App = () => {
  return (
    <div style={{ width: '100%', height: '600px', position: 'relative' }}>
      <GraphProvider>
        <GraphEditor>
          <div style={{ 
            position: 'absolute', 
            top: '10px', 
            right: '10px', 
            zIndex: 4,
            display: 'flex',
            gap: '8px'
          }}>
            <AddNode />
            <ClearCanvas />
          </div>
          <InfoPanel />
        </GraphEditor>
      </GraphProvider>
    </div>
  );
};

export default App;
``` 