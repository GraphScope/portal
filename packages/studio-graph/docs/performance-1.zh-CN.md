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
import { Canvas, GraphProvider, Prepare, useContext, Loading, ZoomStatus } from '@graphscope/studio-graph';
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

      updateStore(draft => {
        draft.data = data;
        draft.isLoading = false;
        draft.nodeStyle = {
          undefined: {
            color: 'green',
            caption: ['label'],
            size: 2,
          },
        };
        draft.layout = {
          // type: 'circle-pack',
          // options: {
          //   groupBy: 'properties.cluster',
          // },
        };
      });
    })();
  }, []);
  return null;
};
export default () => {
  return (
    <div style={{ height: '600px', position: 'relative' }}>
      <GraphProvider id="my-graph-custom">
        <CustomGraphFetch />
        <Canvas />
        <Loading />
        <ZoomStatus />
      </GraphProvider>
    </div>
  );
};
```
