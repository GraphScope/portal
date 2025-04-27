---
title: EmptyCanvas
group:
  title: Data Display
  order: 2
---

# EmptyCanvas

A component for displaying empty states with customizable description and styles.

## When To Use

- When there is no data to display
- When you need to show an empty state message
- When you need to customize the empty state style

## Examples

### Basic Usage

```tsx
import React from 'react';
import { EmptyCanvas } from '@graphscope/studio-components';

const Demo = () => {
  return <EmptyCanvas />;
};

export default Demo;
```

### Custom Description

```tsx
import React from 'react';
import { EmptyCanvas } from '@graphscope/studio-components';

const Demo = () => {
  return <EmptyCanvas description="No Content" />;
};

export default Demo;
```

### Custom Style

```tsx
import React from 'react';
import { EmptyCanvas } from '@graphscope/studio-components';

const Demo = () => {
  return <EmptyCanvas description="No Content" style={{ backgroundColor: '#f0f0f0' }} />;
};

export default Demo;
```

### Custom Image Size

```tsx
import React from 'react';
import { EmptyCanvas } from '@graphscope/studio-components';

const Demo = () => {
  return <EmptyCanvas description="No Content" imageSize="40%" />;
};

export default Demo;
```

## API

### EmptyCanvas

| Property    | Description                               | Type                        | Default      |
| ----------- | ----------------------------------------- | --------------------------- | ------------ |
| description | Empty state description                   | `string \| React.ReactNode` | `'暂无数据'` |
| style       | Custom style                              | `React.CSSProperties`       | -            |
| className   | Custom class name                         | `string`                    | -            |
| imageSize   | Image size, can be a number or percentage | `number \| string`          | `'60%'`      |

```

```
