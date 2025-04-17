---
title: SegmentedTabs 分段式选项卡
group:
  title: 导航
  order: 1
---

# SegmentedTabs 分段式选项卡

基于 Ant Design Segmented 组件的选项卡，支持 URL 参数同步和自定义样式。

## 何时使用

- 需要在有限空间内展示多个相关内容时
- 需要将内容分类展示时
- 需要与 URL 参数同步的选项卡时

## 代码演示

### 基础用法

```tsx
import React from 'react';
import { SegmentedTabs } from '@graphscope/studio-components';

const Demo = () => {
  const items = [
    {
      key: 'tab1',
      label: '选项卡一',
      children: <div>选项卡一的内容</div>,
    },
    {
      key: 'tab2',
      label: '选项卡二',
      children: <div>选项卡二的内容</div>,
    },
  ];

  return <SegmentedTabs items={items} />;
};

export default Demo;
```

### 带图标

```tsx
import React from 'react';
import { SegmentedTabs } from '@graphscope/studio-components';
import { HomeOutlined, UserOutlined } from '@ant-design/icons';

const Demo = () => {
  const items = [
    {
      key: 'tab1',
      label: '选项卡一',
      icon: <HomeOutlined />,
      children: <div>选项卡一的内容</div>,
    },
    {
      key: 'tab2',
      label: '选项卡二',
      icon: <UserOutlined />,
      children: <div>选项卡二的内容</div>,
    },
  ];

  return <SegmentedTabs items={items} />;
};

export default Demo;
```

### 块级显示

```tsx
import React from 'react';
import { SegmentedTabs } from '@graphscope/studio-components';

const Demo = () => {
  const items = [
    {
      key: 'tab1',
      label: '选项卡一',
      children: <div>选项卡一的内容</div>,
    },
    {
      key: 'tab2',
      label: '选项卡二',
      children: <div>选项卡二的内容</div>,
    },
  ];

  return <SegmentedTabs items={items} block />;
};

export default Demo;
```

## API

### SegmentedTabs

| 参数          | 说明                                       | 类型                                                                                            | 默认值  |
| ------------- | ------------------------------------------ | ----------------------------------------------------------------------------------------------- | ------- |
| items         | 选项卡项配置                               | `{ key: string; children: React.ReactNode; label?: React.ReactNode; icon?: React.ReactNode }[]` | -       |
| queryKey      | URL 查询参数键名，用于保存当前激活的选项卡 | `string`                                                                                        | `'tab'` |
| rootStyle     | 根容器自定义样式                           | `React.CSSProperties`                                                                           | -       |
| tabStyle      | 选项卡自定义样式                           | `React.CSSProperties`                                                                           | -       |
| tableHeight   | 选项卡高度                                 | `number`                                                                                        | `40`    |
| defaultActive | 默认激活的选项卡                           | `string`                                                                                        | -       |
| block         | 是否块级显示                               | `boolean`                                                                                       | -       |
| value         | 受控模式下的当前值                         | `string`                                                                                        | -       |
| onChange      | 选项卡切换回调                             | `(value: string) => void`                                                                       | -       |

```jsx
import React, { useState } from 'react';
import { Space } from 'antd';
import { SegmentedTabs } from '@graphscope/studio-components';
const Tab1 = () => {
  return <div>Tab-1 components</div>;
};
const Tab2 = () => {
  return <div>Tab-2 components</div>;
};
const Tab3 = () => {
  return <div>Tab-3 components</div>;
};
export default () => {
  const items = [
    {
      key: 'Tab-1',
      children: <Tab1 />,
      label: 'Tab-1',
    },
    {
      key: 'Tab-2',
      children: <Tab2 />,
      label: 'Tab-2',
    },
    {
      key: 'Tab-3',
      children: <Tab3 />,
      label: 'Tab-3',
    },
  ];
  return (
    <div>
      <SegmentedTabs items={items}></SegmentedTabs>
    </div>
  );
};
```
