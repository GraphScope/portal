---
group:
  title: 性能测试
order: 4
title: G6-Dataset-G(7167,5421)
---

## 渲染与布局性能

- dataset: https://assets.antv.antgroup.com/g6/20000.json
- live: https://g6.antv.antgroup.com/examples/performance/massive-data#20000

```jsx
import React, { useEffect } from 'react';
import { Canvas, GraphProvider, Prepare, useContext, Loading } from '@graphscope/studio-graph';
import { schema } from './const';
const CustomGraphFetch = () => {
  const { store, updateStore } = useContext();
  useEffect(() => {
    (async () => {
      updateStore(draft => {
        draft.isLoading = true;
      });
      const { nodes, edges } = await fetch('https://assets.antv.antgroup.com/g6/20000.json').then(res => res.json());
      const data = {
        nodes: nodes.map(item => ({ id: item.id, properties: item.data })),
        edges: edges.map((item, index) => ({
          id: `${item.source}-${item.target}-${index}`,
          source: item.source,
          target: item.target,
          properties: item.data,
        })),
      };
      updateStore(draft => {
        draft.data = data;
        draft.isLoading = false;
      });
      console.log(data);
    })();
  }, []);
  return null;
};
export default () => {
  return (
    <div style={{ height: '600px' }}>
      <GraphProvider id="my-graph">
        <CustomGraphFetch />
        <Canvas />
        <Loading />
      </GraphProvider>
    </div>
  );
};
```
