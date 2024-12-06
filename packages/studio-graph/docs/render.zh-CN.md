---
order: 2
title: 渲染相关
---

| 组件名       | 功能描述                                                 |
| ------------ | -------------------------------------------------------- |
| Canvas       | 负责画布渲染和布局                                       |
| Prepare      | 负责通过Props接收图数据和图模型，符合React组件的使用习惯 |
| SwitchEngine | 启用后支持3D功能，可以点击切换 2D/3D 模式                |

## 基础渲染（符合 React 习惯）

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

## 推荐方式

## 大数量渲染

## 2D/3D 渲染切换
