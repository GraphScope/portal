---
order: 1
title: GraphProvider
---

## GraphProvider

GraphProvider是一个全局数据的提供者，在其内部的组件，即可通过 useGraphStore获得全局数据
| props | desc | default |
| -------- | --------------------------------------- | ---------------- |
| id | 多实例管理需要的唯一表示 | 默认是uuid生成的 |

### 数据隔离

GraphProvider 实现数据隔离的核心机制在于使用了 唯一实例 ID 和 上下文（Context）。即使在不传递id的情况下，也会生成一个唯一的 ID，并通过 React 的 Context API 将该 ID 传递给 GraphProvider 和 GraphEditor 组件。这样即使它们都使用相同的 GraphProvider 组件，在多个实例中，每个实例都可以独立地管理自己的数据，而不会影响其他实例的数据，下面我们通过代码来进行演示；

```jsx
import * as React from 'react';
import { GraphProvider, GraphEditor } from '@graphscope/studio-flow-editor';
import { Divider } from 'antd';
export default () => {
  return (
    <>
      <div style={{ width: '100%', height: '20vh', position: 'relative' }}>
        <GraphProvider>
          <GraphEditor />
        </GraphProvider>
      </div>
      <Divider />
      <div style={{ width: '100%', height: '20vh', position: 'relative' }}>
        <GraphProvider>
          <GraphEditor />
        </GraphProvider>
      </div>
    </>
  );
};
```

### 更新、获取数据
@graphscope/studio-flow-editor包提供了useGraphStore钩子，该钩子提供了对GraphProvider组件内部数据的更新和获取能力。

```jsx
import * as React from 'react';
import { GraphProvider, GraphEditor, useGraphStore } from '@graphscope/studio-flow-editor';
import { Divider, Button } from 'antd';
const Edit = () => {
  const { store,updateStore } = useGraphStore();

  React.useEffect(() => {
    updateStore(draft=>{
        draft.nodes = [];
    })
  },[])
  const { nodes, edges, nodePositionChange, hasLayouted, elementOptions, displayMode } = store;

  const printData = () => {
    console.log('nodes::: ', nodes);
    console.log('edges::: ', edges);
    console.log('nodePositionChange::: ', nodePositionChange);
    console.log('hasLayouted::: ', hasLayouted);
    console.log('displayMode::: ', displayMode);
    console.log('elementOptions::: ', elementOptions);
  };
  return (
    <>
      <div style={{ position: 'absolute', top: 38, left: 0 }}>{JSON.stringify(store)}</div>
      <Button style={{ position: 'absolute', top: 0, left: 0, zIndex: 4 }} onClick={printData}>
        打印节点数据
      </Button>
    </>
  );
};
export default () => {
  return (
    <div style={{ width: '100%', height: '50vh', position: 'relative' }}>
      <GraphProvider>
        <GraphEditor showMinimap={false}>
          <Edit />
        </GraphEditor>
      </GraphProvider>
    </div>
  );
};
```
### store数据属性
| attr | desc | default |
| -------- | --------------------------------------- | ---------------- |
| nodes | 节点数据 | [] |
| edges | 连线数据 | [] |
| nodePositionChange | 节点位置变化存储 | [] |
| hasLayouted | 是否第一次渲染 | false |
| elementOptions.isEditable | 如使用默认按钮控制器（showDefaultBtn为true的情况） 是否可以编辑 | true |
| elementOptions.isConnectable | 是否可以进行连线 | true |
| currentId | 当前选中（node/edge）id | '' |
| currentType | 当前选中类型 | 'nodes' |
| theme.primaryColor | 连线/节点的主题色 | '#1978FF' |
