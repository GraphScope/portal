---
title: Toolbar
group:
  title: Navigation
  order: 2
---

# Toolbar

A customizable toolbar component that supports horizontal and vertical arrangements, with configurable position and styles.

## When To Use

- When you need to display a group of action buttons in a fixed position
- When you need to customize toolbar styles and position
- When you need to control toolbar display effects

## Examples

### Basic Usage

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

### Horizontal Arrangement

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

### Custom Position

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

### Custom Styles

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

| Property   | Description                     | Type                                                                                                        | Default                         |
| ---------- | ------------------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------- |
| children   | Toolbar content                 | `React.ReactNode`                                                                                           | -                               |
| style      | Custom style                    | `React.CSSProperties`                                                                                       | -                               |
| direction  | Arrangement direction           | `'horizontal' \| 'vertical'`                                                                                | `'vertical'`                    |
| noSpace    | Whether to disable spacing      | `boolean`                                                                                                   | `false`                         |
| position   | Toolbar position                | `{ top?: string \| number; left?: string \| number; right?: string \| number; bottom?: string \| number; }` | `{ top: '12px', left: '24px' }` |
| shadow     | Whether to show shadow          | `boolean`                                                                                                   | `true`                          |
| background | Whether to show background      | `boolean`                                                                                                   | `true`                          |
| rounded    | Whether to show rounded corners | `boolean`                                                                                                   | `true`                          |
| padding    | Padding                         | `string \| number`                                                                                          | `'4px'`                         |
