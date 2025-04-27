---
tag: New
---

# Icons

A collection of icon components for GraphScope Studio, based on Ant Design design system with theme customization support.

## Features

- Automatic theme color adaptation
- Customizable size and color
- Text content support (for specific icons)
- Unified usage pattern

## Examples

### Icon Preview

```jsx
import React from 'react';
import { Flex, Typography } from 'antd';
import { Icons } from '@graphscope/studio-components';

export default () => {
  return (
    <Flex wrap gap={44}>
      {Object.keys(Icons).map(key => {
        const Icon = Icons[key];
        return (
          <Flex key={key} gap={8} vertical align="center">
            <Icon style={{ fontSize: 46 }} />
            <Typography.Text>{key}</Typography.Text>
          </Flex>
        );
      })}
    </Flex>
  );
};
```

### Basic Usage

```jsx
import React from 'react';
import { Space } from 'antd';
import { Icons } from '@graphscope/studio-components';

export default () => {
  return (
    <Space>
      <Icons.AddNode />
      <Icons.File style={{ color: 'red' }} />
      <Icons.Database style={{ fontSize: 24 }} />
    </Space>
  );
};
```

## API

### IconProps

| Property | Description                                 | Type                                      | Default |
| -------- | ------------------------------------------- | ----------------------------------------- | ------- |
| style    | Custom styles, including fontSize and color | `React.CSSProperties & { text?: string }` | -       |

### Special Properties

Some icons support special style properties:

| Icon | Special Property | Description                                                 |
| ---- | ---------------- | ----------------------------------------------------------- |
| File | text             | Text content displayed in the file icon, defaults to 'JSON' |

## Icon Categories

### File Operation Icons

- File
- FileExport
- FileYaml

### Graph Operation Icons

- Graph2D
- Graph3D
- ZoomFit
- Cluster
- Lasso
- Arrow

### Node Operation Icons

- AddNode
- PrimaryKey
- Punctuation

### UI Control Icons

- Sidebar
- Explorer
- Lock
- Unlock

### Data Related Icons

- Database
- Qps
- Model
- Trash

```jsx
import React, { useState } from 'react';
import { Space } from 'antd';
import { Icons } from '@graphscope/studio-components';
export default () => {
  return (
    <div>
      <Space>
        <Icons.AddNode />
        <Icons.PrimaryKey style={{ color: 'red' }} />
        <Icons.Sidebar />
        <Icons.Sidebar revert />
        <Icons.Lasso />
      </Space>
    </div>
  );
};
```
