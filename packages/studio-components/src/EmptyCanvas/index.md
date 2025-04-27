---
title: EmptyCanvas 空画布
group:
  title: 数据展示
  order: 2
---

# EmptyCanvas 空画布

用于展示空状态的组件，支持自定义描述文本和样式。

## 何时使用

- 当没有数据需要展示时
- 当需要展示空状态提示时
- 当需要自定义空状态样式时

## 代码演示

### 基础用法

```tsx
import React from 'react';
import { EmptyCanvas } from '@graphscope/studio-components';

const Demo = () => {
  return <EmptyCanvas />;
};

export default Demo;
```

### 自定义描述

```tsx
import React from 'react';
import { EmptyCanvas } from '@graphscope/studio-components';

const Demo = () => {
  return <EmptyCanvas description="暂无内容" />;
};

export default Demo;
```

### 自定义样式

```tsx
import React from 'react';
import { EmptyCanvas } from '@graphscope/studio-components';

const Demo = () => {
  return <EmptyCanvas description="暂无内容" style={{ backgroundColor: '#f0f0f0' }} />;
};

export default Demo;
```

### 自定义图片大小

```tsx
import React from 'react';
import { EmptyCanvas } from '@graphscope/studio-components';

const Demo = () => {
  return <EmptyCanvas description="暂无内容" imageSize="40%" />;
};

export default Demo;
```

## API

### EmptyCanvas

| 参数        | 说明                         | 类型                        | 默认值       |
| ----------- | ---------------------------- | --------------------------- | ------------ |
| description | 空状态描述文本               | `string \| React.ReactNode` | `'暂无数据'` |
| style       | 自定义样式                   | `React.CSSProperties`       | -            |
| className   | 自定义类名                   | `string`                    | -            |
| imageSize   | 图片大小，可以是数字或百分比 | `number \| string`          | `'60%'`      |

```jsx
import React, { useState } from 'react';
import { EmptyCanvas } from '@graphscope/studio-components';
export default () => {
  return (
    <div>
      <EmptyCanvas description="This is a empty canvas" />
    </div>
  );
};
```
