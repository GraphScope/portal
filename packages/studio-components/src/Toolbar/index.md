---
title: Toolbar 工具栏
group:
  title: 导航
  order: 2
---

# Toolbar 工具栏

一个可自定义的工具栏组件，支持水平和垂直排列，可配置位置、样式等。

## 何时使用

- 需要在一个固定位置展示一组操作按钮时
- 需要自定义工具栏样式和位置时
- 需要控制工具栏的显示效果时

## 代码演示

### 基础用法

```tsx
import React from 'react';
import { Button } from 'antd';
import { Toolbar } from '@graphscope/studio-components';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const Demo = () => {
  return (
    <div style={{ position: 'relative', height: '200px', border: '1px dashed #d9d9d9' }}>
      <Toolbar>
        <Button type="text" icon={<PlusOutlined />} />
        <Button type="text" icon={<EditOutlined />} />
        <Button type="text" icon={<DeleteOutlined />} />
      </Toolbar>
    </div>
  );
};

export default Demo;
```

### 水平排列

```tsx
import React from 'react';
import { Button } from 'antd';
import { Toolbar } from '@graphscope/studio-components';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const Demo = () => {
  return (
    <div style={{ position: 'relative', height: '200px', border: '1px dashed #d9d9d9' }}>
      <Toolbar direction="horizontal">
        <Button type="text" icon={<PlusOutlined />} />
        <Button type="text" icon={<EditOutlined />} />
        <Button type="text" icon={<DeleteOutlined />} />
      </Toolbar>
    </div>
  );
};

export default Demo;
```

### 自定义位置

```tsx
import React from 'react';
import { Button } from 'antd';
import { Toolbar } from '@graphscope/studio-components';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';

const Demo = () => {
  return (
    <div style={{ position: 'relative', height: '200px', border: '1px dashed #d9d9d9' }}>
      <Toolbar position={{ top: '50px', right: '24px' }}>
        <Button type="text" icon={<PlusOutlined />} />
        <Button type="text" icon={<EditOutlined />} />
      </Toolbar>
    </div>
  );
};

export default Demo;
```

### 自定义样式

```tsx
import React from 'react';
import { Button } from 'antd';
import { Toolbar } from '@graphscope/studio-components';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';

const Demo = () => {
  return (
    <div style={{ position: 'relative', height: '200px', border: '1px dashed #d9d9d9' }}>
      <Toolbar shadow={false} background={false} rounded={false} padding="8px" style={{ border: '1px solid #d9d9d9' }}>
        <Button type="text" icon={<PlusOutlined />} />
        <Button type="text" icon={<EditOutlined />} />
      </Toolbar>
    </div>
  );
};

export default Demo;
```

## API

### Toolbar

| 参数       | 说明           | 类型                                                                                                        | 默认值                          |
| ---------- | -------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------- |
| children   | 工具栏内容     | `React.ReactNode`                                                                                           | -                               |
| style      | 自定义样式     | `React.CSSProperties`                                                                                       | -                               |
| direction  | 排列方向       | `'horizontal' \| 'vertical'`                                                                                | `'vertical'`                    |
| noSpace    | 是否禁用间距   | `boolean`                                                                                                   | `false`                         |
| position   | 工具栏位置     | `{ top?: string \| number; left?: string \| number; right?: string \| number; bottom?: string \| number; }` | `{ top: '12px', left: '24px' }` |
| shadow     | 是否显示阴影   | `boolean`                                                                                                   | `true`                          |
| background | 是否显示背景色 | `boolean`                                                                                                   | `true`                          |
| rounded    | 是否显示圆角   | `boolean`                                                                                                   | `true`                          |
| padding    | 内边距         | `string \| number`                                                                                          | `'4px'`                         |
