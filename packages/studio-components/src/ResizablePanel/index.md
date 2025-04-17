---
title: ResizablePanel 可调整大小面板
group:
  title: 布局
  order: 2
---

# ResizablePanel 可调整大小面板

## 组件介绍

ResizablePanel 是一个可调整大小的面板组件，支持左侧、中间和右侧三个面板区域。用户可以通过拖拽手柄来调整各个面板的宽度。

## 使用场景

- 需要可调整大小的面板布局
- 需要灵活的面板宽度控制

## 代码演示

### 基础用法

```tsx
import React from 'react';
import { ResizablePanel } from '@graphscope/studio-components';

const Demo = () => {
  return (
    <div style={{ height: '300px', border: '1px solid #d9d9d9' }}>
      <ResizablePanel
        leftPanel={<div style={{ padding: '16px', background: '#f0f0f0' }}>左侧面板</div>}
        middlePanel={<div style={{ padding: '16px', background: '#e6f7ff' }}>中间面板</div>}
        rightPanel={<div style={{ padding: '16px', background: '#f6ffed' }}>右侧面板</div>}
      />
    </div>
  );
};

export default Demo;
```

### 自定义最小和最大宽度

```tsx
import React from 'react';
import { ResizablePanel } from '@graphscope/studio-components';

const Demo = () => {
  return (
    <div style={{ height: '300px', border: '1px solid #d9d9d9' }}>
      <ResizablePanel
        leftPanel={<div style={{ padding: '16px', background: '#f0f0f0' }}>左侧面板</div>}
        middlePanel={<div style={{ padding: '16px', background: '#e6f7ff' }}>中间面板</div>}
        rightPanel={<div style={{ padding: '16px', background: '#f6ffed' }}>右侧面板</div>}
        leftMinWidth={20}
        leftMaxWidth={40}
        rightMinWidth={20}
        rightMaxWidth={40}
      />
    </div>
  );
};

export default Demo;
```

### 仅使用两个面板

```tsx
import React from 'react';
import { ResizablePanel } from '@graphscope/studio-components';

const Demo = () => {
  return (
    <div style={{ height: '300px', border: '1px solid #d9d9d9' }}>
      <ResizablePanel
        leftPanel={<div style={{ padding: '16px', background: '#f0f0f0' }}>左侧面板</div>}
        middlePanel={<div style={{ padding: '16px', background: '#e6f7ff' }}>右侧面板</div>}
      />
    </div>
  );
};

export default Demo;
```

## API

### ResizablePanel

| 属性          | 说明                   | 类型                | 默认值 |
| ------------- | ---------------------- | ------------------- | ------ |
| leftPanel     | 左侧面板内容           | React.ReactNode     | -      |
| middlePanel   | 中间面板内容           | React.ReactNode     | -      |
| rightPanel    | 右侧面板内容           | React.ReactNode     | -      |
| leftMinWidth  | 左侧面板最小宽度百分比 | number              | 20     |
| leftMaxWidth  | 左侧面板最大宽度百分比 | number              | 40     |
| rightMinWidth | 右侧面板最小宽度百分比 | number              | 20     |
| rightMaxWidth | 右侧面板最大宽度百分比 | number              | 40     |
| style         | 自定义样式             | React.CSSProperties | -      |
| className     | 自定义类名             | string              | -      |

```jsx
import React from 'react';
import ResizablePanel from './index.tsx';

export default () => {
  return (
    <ResizablePanel
      leftSide={
        <div style={{ minWidth: '300px', height: '300px', background: '#F7F7F7', textAlign: 'center' }}>leftSide</div>
      }
      middleSide={
        <div style={{ minWidth: '600px', height: '300px', background: '#FFA444', textAlign: 'center' }}>middleSide</div>
      }
      rightSide={
        <div
          style={{
            minWidth: '300px',
            height: '300px',
            background: '#91CAFA',
            textAlign: 'center',
          }}
        >
          rightSide
        </div>
      }
    />
  );
};
```
