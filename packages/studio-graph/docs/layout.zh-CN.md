---
order: 5
title: 布局相关
---

在 `@graphscope/studio-graph`的设计中，布局数据是由 `store.layout` 驱动的

| key     | desc           | default |
| ------- | -------------- | ------- |
| type    | 布局类型       | force   |
| options | 布局的具体参数 | {}      |

## 01. 力导布局 `force`

```jsx
import React, { useEffect } from 'react';
import { Canvas, GraphProvider, Prepare, useContext } from '@graphscope/studio-graph';
import { schema } from './const';
const CustomGraphFetch = () => {
  const { store, updateStore } = useContext();
  useEffect(() => {
    fetch('https://assets.antv.antgroup.com/g6/radial.json')
      .then(res => res.json())
      .then(res => {
        return {
          nodes: res.nodes.map(item => {
            return {
              id: item.id,
              properties: item,
            };
          }),
          edges: res.edges.map((item, index) => {
            return {
              id: String(index),
              source: item.source,
              target: item.target,
              properties: {},
            };
          }),
        };
      })
      .then(data => {
        updateStore(draft => {
          draft.data = data;
          draft.schema = schema;
          draft.source = data;
          //默认的layout就是这个，所以可以不用设置
          draft.layout = {
            type: 'force',
            options: {},
          };
        });
      });
  }, []);
  return null;
};
export default () => {
  return (
    <div style={{ height: '300px' }}>
      <GraphProvider id={String(Math.random())}>
        <CustomGraphFetch />
        <Canvas />
      </GraphProvider>
    </div>
  );
};
```

## 02. 层次布局 `dagre`

```jsx
import React, { useEffect } from 'react';
import { Canvas, GraphProvider, Prepare, useContext } from '@graphscope/studio-graph';
import { data, schema } from './const';
const CustomGraphFetch = () => {
  const { store, updateStore } = useContext();
  useEffect(() => {
    fetch('https://assets.antv.antgroup.com/g6/radial.json')
      .then(res => res.json())
      .then(res => {
        return {
          nodes: res.nodes.map(item => {
            return {
              id: item.id,
              properties: item,
            };
          }),
          edges: res.edges.map((item, index) => {
            return {
              id: String(index),
              source: item.source,
              target: item.target,
              properties: {},
            };
          }),
        };
      })
      .then(data => {
        updateStore(draft => {
          draft.data = data;
          draft.schema = schema;
          draft.source = data;
          //默认的layout就是这个，所以可以不用设置
          draft.layout = {
            type: 'dagre',
            options: {},
          };
        });
      });
  }, []);
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

## 03. 预设布局 `preset`

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
        draft.layout = {
          type: 'preset',
          options: {},
        };
      });
    })();
  }, []);
  return null;
};
export default () => {
  return (
    <div style={{ height: '600px' }}>
      <GraphProvider id={String(Math.random())}>
        <CustomGraphFetch />
        <Canvas />
        <Loading />
      </GraphProvider>
    </div>
  );
};
```

## 04. Combo布局 `circle-pack`

```jsx
import React, { useEffect } from 'react';
import {
  Canvas,
  GraphProvider,
  Prepare,
  useContext,
  Loading,
  ZoomStatus,
  BasicInteraction,
} from '@graphscope/studio-graph';
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
          type: 'circle-pack',
          options: {
            groupBy: 'properties.cluster',
          },
        };
      });
    })();
  }, []);
  return null;
};
export default () => {
  return (
    <div style={{ height: '600px', position: 'relative' }}>
      <GraphProvider id={String(Math.random())}>
        <CustomGraphFetch />
        <Canvas />
        <Loading />
        <ZoomStatus />
        <BasicInteraction />
      </GraphProvider>
    </div>
  );
};
```

## 04. Combo布局 `force-combo`

```jsx
import React, { useEffect } from 'react';
import {
  Canvas,
  GraphProvider,
  Prepare,
  useContext,
  Loading,
  ZoomStatus,
  BasicInteraction,
} from '@graphscope/studio-graph';
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
          type: 'force-combo',
          options: {
            groupBy: 'properties.cluster',
          },
        };
      });
    })();
  }, []);
  return null;
};
export default () => {
  return (
    <div style={{ height: '600px', position: 'relative' }}>
      <GraphProvider id={String(Math.random())}>
        <CustomGraphFetch />
        <Canvas />
        <Loading />
        <ZoomStatus />
        <BasicInteraction />
      </GraphProvider>
    </div>
  );
};
```
