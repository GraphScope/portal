---
order: 2
title: GraphEditor
---

### GraphEditor属性配置

| 参数           | 类型            | 说明                                       |
| -------------- | --------------- | ------------------------------------------ |
| children       | React.ReactNode | 可以在 ReactFlow 内部添加自定义子组件      |
| showBackground | boolean         | 可以在 ReactFlow 是否显示背景，默认为 true |
| showMinimap    | boolean         | 是否显示迷你地图，默认为 true              |
| showDefaultBtn | boolean         | 是否显示默认按钮控制器，默认为 true        |

#### 举例不显示背景与Minimap

```jsx
import React, { useState, useEffect } from 'react';
import { GraphEditor, GraphProvider } from '@graphscope/studio-flow-editor';
export default () => {
  return (
    <div style={{ height: '400px', position: 'relative' }}>
      <GraphProvider>
        <GraphEditor showBackground={false} showMinimap={false} />
      </GraphProvider>
    </div>
  );
};
```

#### 插入自定义元素  
也可以插入自定义操作面板，来组装graph图形数据，以适配业务

```jsx
import React, { useState, useEffect } from 'react';
import { GraphEditor, GraphProvider, useGraphStore, useAddNode,ExportSvg } from '@graphscope/studio-flow-editor';
import { Toolbar, Icons } from '@graphscope/studio-components';

import { Button } from 'antd';
const Edit = () => {
  const { store, updateStore } = useGraphStore();
  const { handleAddVertex } = useAddNode();
  const handleClear = () => {
    updateStore(draft => {
      draft.nodes = [];
      draft.edges = [];
    });
  };
  const addNodeAction = () => {
    handleAddVertex();
  };
  return (
    <Toolbar style={{ top: '12px', right: '24px', left: 'unset' }} direction="vertical">
      <Button onClick={handleClear} type="text" icon={<Icons.Trash />}></Button>
      <Button onClick={addNodeAction} type="text" icon={<Icons.AddNode />}></Button>
      <ExportSvg />
    </Toolbar>
  );
};
export default () => {
  return (
    <div style={{ height: '400px', position: 'relative' }}>
      <GraphProvider>
        <GraphEditor showDefaultBtn={false}>
          <Edit />
        </GraphEditor>
      </GraphProvider>
    </div>
  );
};
```
