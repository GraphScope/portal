---
title: CollapseCard 可折叠卡片
group:
  title: 数据展示
  order: 1
---

# CollapseCard 可折叠卡片

一个可折叠的卡片组件，支持自定义标题、内容和样式。

## 何时使用

- 需要展示可折叠的内容区域时
- 需要节省页面空间，同时保持内容可访问性时
- 需要分组展示相关内容时

## 代码演示

### 基础用法

```tsx
import React from 'react';
import { CollapseCard } from '@graphscope/studio-components';

const Demo = () => {
  return (
    <CollapseCard title="基础用法">
      <div>这是卡片的内容</div>
    </CollapseCard>
  );
};

export default Demo;
```

### 带提示信息

```tsx
import React from 'react';
import { CollapseCard } from '@graphscope/studio-components';

const Demo = () => {
  return (
    <CollapseCard title="带提示信息" tooltip="这是一个提示信息">
      <div>这是卡片的内容</div>
    </CollapseCard>
  );
};

export default Demo;
```

### 带边框

```tsx
import React from 'react';
import { CollapseCard } from '@graphscope/studio-components';

const Demo = () => {
  return (
    <CollapseCard title="带边框" bordered>
      <div>这是卡片的内容</div>
    </CollapseCard>
  );
};

export default Demo;
```

## API

### CollapseCard

| 参数            | 说明              | 类型                          | 默认值  |
| --------------- | ----------------- | ----------------------------- | ------- |
| bordered        | 是否显示边框      | `boolean`                     | `false` |
| ghost           | 是否透明背景      | `boolean`                     | `true`  |
| title           | 卡片标题          | `React.ReactNode`             | -       |
| children        | 卡片内容          | `React.ReactNode`             | -       |
| defaultCollapse | 默认是否折叠      | `boolean`                     | `false` |
| tooltip         | 提示信息          | `React.ReactNode`             | -       |
| style           | 自定义样式        | `React.CSSProperties`         | -       |
| className       | 自定义类名        | `string`                      | -       |
| onChange        | 展开/收起时的回调 | `(isActive: boolean) => void` | -       |

```

```
