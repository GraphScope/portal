---
order: 1
title: 快速开始
---

## 安装依赖

```bash
pnpm add @graphscope/studio-graph
```

## 准备图数据

数据结构和 Property Graph 的格式一致，有节点 nodes 和 边 edges

- nodes 必须包含节点 id 和 properties
- edges 必须包含 source, target, id 和 properties

其中边上的 `source` 和 `target` 必须有对应的 nodes 中的 `id` ，推荐用户的数据都存放在 `properties` 中，如下图所示

```jsx | pure
const data = {
  nodes: [
    { id: 'id-1', properties: {} },
    { id: 'id-2', properties: {} },
  ],
  edges: [{ source: 'id-1', target: 'id-2', id: 'e1', properties: {} }],
};
```

## 开始渲染

### 方式一：符合 React 使用习惯，使用 Perpare 组件

点击下方的`<>`图标，查看源码可见

- `GraphProvider` 提供了全局 Context 的 Provider，`id` 为 Context 的 key，用户多实例管理，必须传入。
- `Prepare` 是内置的组件，可以根据用户设置的 props.data 和 props.schema（稍后会介绍） 进行画布渲染，符合传统 React 组件使用的逻辑

```jsx
import React from 'react';
import { Canvas, GraphProvider, Prepare } from '@graphscope/studio-graph';
import { data, schema } from './const';
export default () => {
  return (
    <div style={{ height: '100px' }}>
      <GraphProvider id="my-graph">
        <Prepare data={data} schema={schema} />
        <Canvas />
      </GraphProvider>
    </div>
  );
};
```

### 方式二：推荐的方式，自定义数据请求组件

在方式二中，用户自定义的 `CustomGraphFetch` 组件和 `@graphscope-studio`提供的内置 Perpare 组件实现逻辑是一样的，这也是我们推荐的方式：

```jsx
import React, { useEffect } from 'react';
import { Canvas, GraphProvider, Prepare, useContext } from '@graphscope/studio-graph';
import { data, schema } from './const';
const CustomGraphFetch = () => {
  const { store, updateStore } = useContext();
  useEffect(() => {
    updateStore(draft => {
      draft.data = data;
      draft.schema = schema;
      draft.source = data;
    });
  }, []);
  return null;
};
export default () => {
  return (
    <div style={{ height: '100px' }}>
      <GraphProvider id="my-graph-custom">
        <CustomGraphFetch />
        <Canvas />
      </GraphProvider>
    </div>
  );
};
```

`const { store,updateStore } = useContext() ` 用户通过 `store` 去获取全局的数据，通过 `updateStore`来修改全局的数据。后面我们会介绍到：`store.data` 是控制全局画布渲染的数据.因此，自定义的组件只要调用 `updateStore` 就可以修它，从而实现自定义数据请求和画布渲染

## 设置样式

在 `@graphscope/studio-graph`的设计中，样式数据和图数据是分离的。节点的样式数据在 `store.nodeStyle` 中，边的样式数据在 `store.edgeStyle` 中。

考虑到Schema的批量映射和高级映射，

```jsx
import React, { useEffect } from 'react';
import { Canvas, GraphProvider, Prepare, useContext } from '@graphscope/studio-graph';
import { data, schema } from './const';
const CustomGraphFetch = () => {
  const { store, updateStore } = useContext();
  useEffect(() => {
    updateStore(draft => {
      draft.data = data;
      draft.schema = schema;
      draft.source = data;
      draft.nodeStyle = {
        'id-1': {
          color: 'red',
          size: 10,
          caption: ['name', 'age'],
        },
      };
    });
  }, []);
  return null;
};
export default () => {
  return (
    <div style={{ height: '100px' }}>
      <GraphProvider id="graph-3">
        <CustomGraphFetch />
        <Canvas />
      </GraphProvider>
    </div>
  );
};
```

目前在 `store.nodeStyle` 和 `store.edgeStyle` 中，只有4个参数可以配置，分别是：

| key     | desc                   | default |
| ------- | ---------------------- | ------- |
| color   | 节点/边的颜色          | #ddd    |
| size    | 节点大小 或者 边的粗细 | 2       |
| caption | 节点/边的标签          | []      |
| icon    | 节点图标               | ''      |

需要注意的是 `caption` 是数组，可以配置多个展示标签，考虑文本的映射可以根据Schema批量设置和高级映射配置，因此`caption`是一组图数据中`properties`的数值映射字段，而非静态数值

## 添加交互

```bash
import {  BasicInteraction } from '@graphscope/studio-graph';

```

`BasicInteraction`组件提供了画布的基础交互，节点的点击，拖拽，边的点击，以及点击后的高亮效果。更多的交互组件，请查看交互组件以及事件监听

```jsx
import React from 'react';
import { Canvas, GraphProvider, Prepare, BasicInteraction } from '@graphscope/studio-graph';

import { data, schema } from './const';

export default () => {
  return (
    <div style={{ height: '100px' }}>
      <GraphProvider id="4">
        <Prepare data={data} schema={schema} />
        <Canvas />
        <BasicInteraction />
      </GraphProvider>
    </div>
  );
};
```
