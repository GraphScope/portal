---
order: 4
title: 样式相关
---

# 节点样式

## 01. 设置颜色/大小/文本

在 `@graphscope/studio-graph`的设计中，样式数据和图数据是分离的。节点的样式数据在 `store.nodeStyle` 中，边的样式数据在 `store.edgeStyle` 中。

考虑到Schema的批量映射和高级映射，

```jsx
import React, { useEffect } from 'react';
import { Canvas, GraphProvider, Prepare, useContext, ZoomStatus } from '@graphscope/studio-graph';
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
    <div style={{ height: '100px', position: 'relative' }}>
      <GraphProvider id="graph-3">
        <CustomGraphFetch />
        <Canvas />
        <ZoomStatus />
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

## 02. 设置图标

`@graphscope/studio-graph` 提供了 `registerIcons`方法来注册节点图标，标的设置依然在 `store.nodeStyle` 中

```jsx | pure
import { registerIcons } from '@graphscope/studio-graph';
registerIcons();
```

```jsx
import React, { useEffect } from 'react';
import { Canvas, GraphProvider, Prepare, useContext, registerIcons } from '@graphscope/studio-graph';
import { data, schema } from './const';
registerIcons();
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
          icon: 'logo',
        },
      };
    });
  }, []);
  return null;
};
export default () => {
  return (
    <div style={{ height: '100px' }}>
      <GraphProvider id="5">
        <CustomGraphFetch />
        <Canvas />
      </GraphProvider>
    </div>
  );
};
```

## 03. 官方内置图标库

```jsx
import React, { useState, useEffect } from 'react';
import { Space, Flex, Typography } from 'antd';
import { registerIcons } from '@graphscope/studio-graph';

export default () => {
  const [icons, setIcons] = useState({});
  useEffect(() => {
    registerIcons().then(res => {
      setIcons(res);
    });
  }, []);

  return (
    <Flex wrap gap={44}>
      {Object.keys(icons).map(key => {
        return (
          <Flex key={key} gap={8} vertical align="center">
            <span style={{ fontFamily: 'iconfont', fontSize: '30px' }}>{icons[key]}</span>
            <Typography.Text>{key}</Typography.Text>
          </Flex>
        );
      })}
    </Flex>
  );
};
```

## 04. 自定义图标

在实际业务使用场景中，我们需要自定义图标，我们需要先在 [iconfont](https://www.iconfont.cn/) 平台上创建一个自己的图标项目，然后选择`unicode`生成链接。如下图所示，红框选出来的即使 iconfont 的`id`
![register icons](./images/icons.png)

我们只需要将此ID赋值给`registerIcons`即可

```jsx | pure
import { registerIcons } from '@graphscope/studio-graph';
const iconfontId = 'xxxxxxxxxxx';
registerIcons(iconfontId);
```

## 05. 更多样式设置

如果你需要更细节的样式设置，可以在`store.nodeStyle.options`中进行设置

| `store.nodeStyle.options` | 功能描述                                               | 默认值                  |
| ------------------------- | ------------------------------------------------------ | ----------------------- |
| textPosition              | 设置文本的位置，枚举值: `top,bottom,left,right,center` | `bottom`                |
| textColor                 | 设置文本的颜色                                         | `store.nodeStyle.color` |
| iconColor                 | 设置图标颜色                                           | `#fff`                  |
| iconSize                  | 设置图标大小                                           | `16px`                  |
| zoomLevel                 | 缩放级别范围                                           | `[3,15] `               |

注意⚠️： `store.nodeStyle.options.zoomLevel`是一个数组，每一项都是一个缩放比率(zoom ratio)默认值 `[3,15]`代表的是
当缩放比率分为三部分，分别是 `ratio < 3`，`3 <= ratio <= 15`，`ratio > 15`

- `ratio < 3` 的时候，画布处于极度缩小状态，节点的`caption`和`icon`都将隐藏。这即能提高渲染性能，也能用户看清楚图结构
- `3 <= ratio <= 15` 的时候，画布处于正常缩放状态，节点的`caption`和`icon`将显示，且节点整体大小会根据缩放比率变化
- `ratio > 15` 的时候，画布处于极度放大状态，节点的`icon`将隐藏，`caption`将展示在节点内部

用户可以根据自己的业务策略进行修改，如下面 DEMO 所示（`zoomLevel: [3,5]`），可缩放查看节点样式的变化。

```jsx
import React, { useEffect } from 'react';
import {
  Canvas,
  GraphProvider,
  Prepare,
  useContext,
  registerIcons,
  ZoomStatus,
  BasicInteraction,
  ClearStatus,
} from '@graphscope/studio-graph';
import { data, schema } from './const';
registerIcons();
const CustomGraphFetch = () => {
  const { store, updateStore } = useContext();
  useEffect(() => {
    updateStore(draft => {
      draft.data = data;
      draft.schema = schema;
      draft.source = data;
      draft.nodeStyle = {
        'id-1': {
          color: 'blue',
          size: 10,
          caption: ['name'],
          icon: 'logo',
          options: {
            /** keyshape */
            selectColor: 'red',
            /** icon */
            iconColor: '#fff', // color of keyshape
            iconSize: 10, // half size of keyshape
            /** label text */
            textSize: 5,
            textColor: '#000', // color of keyshape
            textPosition: 'bottom',
            textBackgroundColor: 'rgba(255,255,255,0.8)',
            /** strategy */
            zoomLevel: [3, 15],
          },
        },
      };
      draft.edgeStyle = {
        e1: {
          size: 2,
          color: 'blue',
          caption: ['desc'],
          options: {
            /** keyshape */
            selectColor: 'red',
            /** arrow */
            arrowLength: undefined, // 默认是边宽的三倍
            arrowPosition: 1, //箭头的位置
            /** label  */
            textColor: '#fff', // 默认是边颜色
            textSize: 3, // 默认是边宽的三倍
            textBackgroundColor: 'blue',
          },
        },
      };
    });
  }, []);
  return null;
};
export default () => {
  return (
    <div style={{ height: '300px', position: 'relative' }}>
      <GraphProvider id={String(Math.random())}>
        <CustomGraphFetch />
        <Canvas />
        <ZoomStatus />
        <BasicInteraction />
        <ClearStatus />
      </GraphProvider>
    </div>
  );
};
```

# 边样式

| `store.edgeStatus.options` | 功能描述                                 | 默认值   |
| -------------------------- | ---------------------------------------- | -------- |
| arrowLength                | 方向箭头的宽度，设置为`0`则不展示        | `size*3` |
| arrowPosition              | 箭头距离目标节点的位置，是0到1之间的数值 | `0.9`    |

```jsx
import React, { useEffect } from 'react';
import { Canvas, GraphProvider, Prepare, useContext, registerIcons, ZoomStatus } from '@graphscope/studio-graph';
import { data, schema } from './const';
registerIcons();
const CustomGraphFetch = () => {
  const { store, updateStore } = useContext();
  useEffect(() => {
    updateStore(draft => {
      draft.data = data;
      draft.schema = schema;
      draft.source = data;
      draft.edgeStyle = {
        e1: {
          size: 1,
          color: 'red',
          caption: ['weight'],
          options: {
            arrowLength: 0,
            // textSize: 1,
          },
        },
      };
    });
  }, []);
  return null;
};
export default () => {
  return (
    <div style={{ height: '300px', position: 'relative' }}>
      <GraphProvider id={String(Math.random())}>
        <CustomGraphFetch />
        <Canvas />
        <ZoomStatus />
      </GraphProvider>
    </div>
  );
};
```

## 和样式相关的组件

| 组件名         | 功能描述                                     |
| -------------- | -------------------------------------------- |
| StyleSetting   | 负责点边颜色，大小，文本的基础设置和高级映射 |
| CurvatureLinks | 展开或者合并多边，默认是合并多边             |

```jsx | pure
import { StyleSetting, CurvatureLinks } from '@graphscope/studio-graph';
```
