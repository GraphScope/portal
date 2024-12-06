---
order: 0
title: 写在前面
---

当你在做图可视化选型的时候，请先确保你已经知道下面两个 JS 库

- https://github.com/antvis/g6
- https://github.com/vasturiano/force-graph

`@antv/g6` 是一个非常优秀的图可视化库，如果你追求快速上手和丰富定制，可以选择它。`force-graph` 同样拥有超高的布局和渲染性能，如果你追求性能，并且未来需要定制优化，可以选择它。

除此之外，你才可能需要考虑 `@graphscope/studio-graph`，它的定位更像是`Antd`，提供开箱即用的组件，而非可视化引擎的API。
就像 `Antd`组件内部也封装了丰富的`rc-components`,但是鲜有用户去直接使用。`@graphscope/studio-graph`也一样：

- 它提供了 `<Canvas />` 组件，其渲染能力来自 `force-graph`
- 它提供的`<ClusterAnalysis>`组件，其聚类分析算法来自`@antv/g6`

`@graphscope/studio-graph` 还提供了一些编程约束，致力于让图可视化能力组件化，从而像乐高积木一样在不同场景中快速组合使用。

## 组件列表

### 渲染相关

| 组件名       | 功能描述                                                 |
| ------------ | -------------------------------------------------------- |
| Canvas       | 负责画布渲染和布局                                       |
| Prepare      | 负责通过Props接收图数据和图模型，符合React组件的使用习惯 |
| SwitchEngine | 启用后支持3D功能，可以点击切换 2D/3D 模式                |

### 交互相关

| 组件名           | 功能描述                               |
| ---------------- | -------------------------------------- |
| BasicInteraction | 负责基础交互，节点/边/分组 的点击响应  |
| FixedMode        | 在力导布局下，启用后拖拽节点会固定位置 |
| Brush            | 启用后，可以进行框选操作               |
| Loading          | 数据查询时，出现的全局加载动画         |
| ZoomFit          | 点击可自动进行画布缩放居中             |
| ClearCanvas      | 清除画布的数据和状态                   |

### 右键菜单

| 组件名          | 功能描述                                              |
| --------------- | ----------------------------------------------------- |
| ContextMenu     | 启用右键菜单                                          |
| DeleteNode      | 删除选中的节点                                        |
| NeighborQuery   | 根据选中的节点，进行邻居查询（需要注册 Services ）    |
| CommonNeighbor  | 根据选中的节点，进行共同邻居查询 需要注册 Services ） |
| DeleteLeafNodes | 根据选中的节点，删除叶子节点                          |

### 布局组件

| 组件名     | 功能描述                   |
| ---------- | -------------------------- |
| RunCluster | 支持分组布局               |
| DagreMode  | 在力导布局下，启用分层布局 |

### 小分析工具

| 组件名      | 功能描述                   |
| ----------- | -------------------------- |
| Toolbar     | 工具栏容器                 |
| Export      | 负责图数据的导出和导入     |
| Placeholder | 当画布数据为空时的占位插画 |

### 样式相关

| 组件名         | 功能描述                                     |
| -------------- | -------------------------------------------- |
| StyleSetting   | 负责点边颜色，大小，文本的基础设置和高级映射 |
| CurvatureLinks | 展开或者合并多边，默认是合并多边             |

### 数据相关

| 组件名          | 功能描述                                       |
| --------------- | ---------------------------------------------- |
| PropertiesPanel | 负责查看点边元素的属性详情信息，支持单选和多选 |
| LoadCSV         | 支持通过CSV加载图数据                          |

## 简单的图示例

你可以点击下面容器的`<>`图标，从而展开源码，这是使用`dumi`搭建的，能让你所见即所得

```jsx
import React from 'react';
import { Canvas, GraphProvider, Prepare } from '@graphscope/studio-graph';
export default () => {
  const id = 'my-graph';
  const data = {
    nodes: [
      {
        id: 'id-1',
        properties: {},
      },
      {
        id: 'id-2',
        properties: {},
      },
    ],
    edges: [
      {
        source: 'id-1',
        target: 'id-2',
        id: 'e1',
        properties: {},
      },
    ],
  };
  const schema = {
    nodes: [],
    edges: [],
  };
  return (
    <div style={{ height: '300px' }}>
      <GraphProvider id={id}>
        <Prepare data={data} schema={schema} />
        <Canvas />
      </GraphProvider>
    </div>
  );
};
```

## 基本原理

让我们点开`<>`图标，进行代码查看，在 `import { Canvas, GraphProvider, Prepare } from '@graphscope/studio-graph';`中

### GraphProvider

`<GraphProvider />` 是一个全局数据的提供者，源码在[这里](https://github.com/GraphScope/portal/blob/main/packages/studio-graph/src/hooks/useContext.tsx#L101)，在其内部的组件，即可通过 `useContext`获得全局数据

| props    | desc                                    | default          |
| -------- | --------------------------------------- | ---------------- |
| id       | 多实例管理需要的唯一表示                | 默认是uuid生成的 |
| services | 注册的数据服务，可以通过getServices获得 | {}               |

-

### Prepare

`<Prepare />` 是一个内置的组件，它可以通过 props 接收 图数据（data） 和 图模型（schema），从而让画布渲染,源码在[这里](https://github.com/GraphScope/portal/blob/main/packages/studio-graph/src/components/Prepare/index.tsx) 这个组件设计的目的是为了方便传统 React 组件使用者，通过 props 传递参数控制图的渲染 的使用习惯。

| props  | desc     | default              |
| ------ | -------- | -------------------- |
| data   | 图数据   | `{nodes[],edges:[]}` |
| schema | 图schema | `{nods:[],edges:[]}` |

通过源码查看，我们可以知道，我们在实际使用中，可以自定义自己的 Perpare 组件，通过 `useContext`进行更新上下文数据，从而数据驱动，改变图画布

### Canvas

`<Canvas />` 是一个内置的组件，它负责渲染画布，源码在[这里](https://github.com/GraphScope/portal/blob/main/packages/studio-graph/src/components/Canvas/index.tsx)。
