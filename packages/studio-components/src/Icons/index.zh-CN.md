---
tag: New
---

# Icons 图标

GraphScope Studio 提供的图标组件库，基于 Ant Design 的设计规范，支持主题定制。

## 特性

- 支持主题色自动适配
- 支持自定义大小和颜色
- 支持文本内容（特定图标）
- 统一的使用方式

## 代码演示

### 图标预览

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

### 基础用法

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

| 参数  | 说明                               | 类型                                      | 默认值 |
| ----- | ---------------------------------- | ----------------------------------------- | ------ |
| style | 自定义样式，包含 fontSize 和 color | `React.CSSProperties & { text?: string }` | -      |

### 特殊属性

部分图标支持特殊的 style 属性：

| 图标 | 特殊属性 | 说明                                    |
| ---- | -------- | --------------------------------------- |
| File | text     | 文件图标中显示的文本内容，默认为 'JSON' |

## 图标分类

### 文件操作相关图标

- File
- FileExport
- FileYaml

### 图形操作相关图标

- Graph2D
- Graph3D
- ZoomFit
- Cluster
- Lasso
- Arrow

### 节点操作相关图标

- AddNode
- PrimaryKey
- Punctuation

### 界面控制相关图标

- Sidebar
- Explorer
- Lock
- Unlock

### 数据相关图标

- Database
- Qps
- Model
- Trash
