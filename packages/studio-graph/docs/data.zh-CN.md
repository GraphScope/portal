---
order: 4
title: 数据相关
---

## 01. 渲染数据

## 02. 增量数据变化

```jsx
import React, { useEffect } from 'react';
import { Canvas, GraphProvider, Prepare, useContext, registerIcons } from '@graphscope/studio-graph';
import { data, schema } from './const';
registerIcons();
let timer;
let timerSystem;
const CustomGraphFetch = () => {
  const { store, updateStore } = useContext();
  const { data } = store;
  console.log('data', data);

  const fetchDynamicData = async () => {
    const { nodes, edges } = data;
    const id = nodes.length;

    let nextData;
    if (id === 0) {
      nextData = {
        nodes: [{ id: 0 }],
        edges: [],
      };
    } else {
      nextData = {
        nodes: [{ id }],
        edges: [{ source: id, target: Math.round(Math.random() * (id - 1)) }],
      };
    }

    clearTimeout(timer);
    return new Promise(resolve => {
      timer = setTimeout(() => {
        resolve(nextData);
      }, 200);
    });
  };

  useEffect(() => {
    if (data.nodes.length > 30) {
      return;
    }
    timerSystem = setInterval(async () => {
      const { nodes, edges } = await fetchDynamicData().then(res => {
        return {
          nodes: res.nodes.map(item => {
            return {
              id: item.id,
              properties: {},
            };
          }),
          edges: res.edges.map((item, index) => {
            return {
              id: index,
              source: item.source,
              target: item.target,
              properties: {},
            };
          }),
        };
      });

      updateStore(draft => {
        draft.data = {
          nodes: [...draft.data.nodes, ...nodes],
          edges: [...draft.data.edges, ...edges],
        };
        draft.schema = schema;
      });
    }, 1000);
    return () => {
      clearInterval(timerSystem);
    };
  }, [data]);
  return null;
};
export default () => {
  return (
    <div style={{ height: '400px' }}>
      <GraphProvider id={String(Math.random())}>
        <CustomGraphFetch />
        <Canvas />
      </GraphProvider>
    </div>
  );
};
```

## 03. 内置数据组件

| 组件名          | 功能描述                                       |
| --------------- | ---------------------------------------------- |
| PropertiesPanel | 负责查看点边元素的属性详情信息，支持单选和多选 |
| LoadCSV         | 支持通过CSV加载图数据                          |
