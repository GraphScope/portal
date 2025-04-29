---
order: 5
title: Hooks
---

# 钩子函数

`@graphscope/studio-flow-editor` 包提供了多个自定义钩子（Hooks），帮助您与图编辑器交互并操作其状态。

## 核心钩子

### useGraphStore

用于访问和更新图状态的主要钩子。

```bash
import { useGraphStore } from '@graphscope/studio-flow-editor';

const MyComponent = () => {
  const { store, updateStore } = useGraphStore();
  const { nodes, edges, currentId, currentType } = store;

  const handleAddNode = () => {
    updateStore(draft => {
      draft.nodes.push({
        id: 'node-' + Date.now(),
        position: { x: 100, y: 100 },
        data: { label: '新节点' },
        type: 'graph-node'
      });
    });
  };

  return (
    <button onClick={handleAddNode}>添加节点</button>
  );
};
```

#### 存储属性

| 属性                 | 类型                                              | 说明                   |
| -------------------- | ------------------------------------------------- | ---------------------- |
| `displayMode`        | `'graph' \| 'table'`                              | 当前显示模式           |
| `nodes`              | `ISchemaNode[]`                                   | 图节点数组             |
| `edges`              | `ISchemaEdge[]`                                   | 图边数组               |
| `nodePositionChange` | `NodePositionChange[]`                            | 节点位置变更记录       |
| `hasLayouted`        | `boolean`                                         | 是否已应用自动布局     |
| `elementOptions`     | `{ isEditable: boolean, isConnectable: boolean }` | 元素交互选项           |
| `theme`              | `{ primaryColor: string }`                        | 主题设置               |
| `currentId`          | `string`                                          | 当前选中的节点或边的ID |
| `currentType`        | `'nodes' \| 'edges'`                              | 当前选中元素的类型     |

### useClearCanvas

提供当存在选中节点或连线时，删除选中节点及相关连线与选中连线的功能，当不存在选中节点时，提供清空画布（删除所有节点和边）的功能。

```bash
import { useClearCanvas } from '@graphscope/studio-flow-editor';

const ClearButton = () => {
  const {handleClear} = useClearCanvas();

  return (
    <button onClick={handleClear}>
      删除
    </button>
  );
};
```

### useAddNode

提供添加新节点到画布的功能。

```bash
import { useAddNode } from '@graphscope/studio-flow-editor';

const AddNodeButton = () => {
    const { handleAddVertex } = useAddNode();

  return (
    <button onClick={() => handleAddVertex({ x: 100, y: 100 })}>
      添加节点
    </button>
  );
};
```

### useExportSvg

提供将图导出为SVG或图片的功能。

```bash
import { useExportSvg } from '@graphscope/studio-flow-editor';

const ExportButton = () => {
  const {exportSvg} = useExportSvg();

  return (
    <button onClick={() => exportSvg({name:'graph.svg'})}>
      导出SVG
    </button>
  );
};
```

## 高级用法

### 组合多个钩子

```bash
import { useGraphStore, useAddNode, useClearCanvas } from '@graphscope/studio-flow-editor';

const GraphControls = () => {
  const { store } = useGraphStore();
  const {handleAddVertex} = useAddNode();
  const {handleClear} = useClearCanvas();

  return (
    <div className="graph-controls">
      <button onClick={() => handleAddVertex({ x: 100, y: 100 })}>添加节点</button>
      <button onClick={handleClear}>清空画布</button>
      <div>节点数量: {store.nodes.length}</div>
      <div>边数量: {store.edges.length}</div>
    </div>
  );
};
```

### 自定义钩子管理节点选择

```bash
import { useGraphStore } from '@graphscope/studio-flow-editor';
import { useCallback } from 'react';

export const useNodeSelection = () => {
  const { store, updateStore } = useGraphStore();

  const selectNode = useCallback((nodeId) => {
    updateStore(draft => {
      draft.currentId = nodeId;
      draft.currentType = 'nodes';
    });
  }, [updateStore]);

  const isSelected = useCallback((nodeId) => {
    return store.currentId === nodeId && store.currentType === 'nodes';
  }, [store.currentId, store.currentType]);

  return { selectNode, isSelected, selectedId: store.currentId };
};
```
