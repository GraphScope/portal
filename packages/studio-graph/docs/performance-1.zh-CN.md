---
group:
  order: 5
  title: 性能测试
order: 3
title: Sigmajs-Dataset-G(2085,5409)
---

- dataset: https://www.sigmajs.org/demo/dataset.json
- live: https://www.sigmajs.org/demo/index.html

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
      const { nodes, edges } = await fetch('https://www.sigmajs.org/demo/dataset.json').then(res => res.json());
      const data = {
        nodes: nodes.map(item => ({ id: item.key, properties: item })),
        edges: edges.map((item, index) => {
          const [source, target] = item;

          return {
            id: `${source}-${target}-${index}`,
            source: source,
            target: target,
            properties: {},
          };
        }),
      };
      console.log(data.nodes.length, data.edges.length);
      updateStore(draft => {
        draft.data = data;
        draft.isLoading = false;
      });
    })();
  }, []);
  return null;
};
export default () => {
  return (
    <div style={{ height: '600px' }}>
      <GraphProvider id="my-graph-custom">
        <CustomGraphFetch />
        <Canvas />
        <Loading />
      </GraphProvider>
    </div>
  );
};
```
