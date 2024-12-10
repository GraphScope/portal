---
group:
  title: 性能测试
order: 5
title: G6-Dataset-G(55001,4862)
---

- dataset: https://assets.antv.antgroup.com/g6/60000.json
- live: https://g6.antv.antgroup.com/examples/performance/massive-data#20000

备注：此数据集中节点有x，y字段，设置布局为 `preset`，则节点会按照数据中的 x, y 坐标进行布局

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
      const { nodes, edges } = await fetch('https://assets.antv.antgroup.com/g6/60000.json').then(res => res.json());
      const data = {
        nodes: nodes.map(item => ({ id: item.id, properties: item.data, x: item.x, y: item.y })),
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
        draft.layout = {
          type: 'preset',
          options: {},
        };
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
