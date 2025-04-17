---
title: EditableText 可编辑文本
group:
  title: 数据展示
  order: 1
---

# EditableText 可编辑文本

可编辑文本组件，支持双击编辑、回车确认、失焦保存等功能。

## 何时使用

- 需要让用户直接编辑文本内容时
- 需要展示可编辑的文本字段时
- 需要实现类似 Excel 单元格编辑功能时

## 代码演示

### 基础用法

```tsx
import React from 'react';
import { EditableText } from '@graphscope/studio-components';

const Demo = () => {
  const handleTextChange = (text: string) => {
    console.log('文本已更新:', text);
  };

  return <EditableText text="双击编辑我" onTextChange={handleTextChange} />;
};

export default Demo;
```

### 禁用状态

```tsx
import React from 'react';
import { EditableText } from '@graphscope/studio-components';

const Demo = () => {
  return <EditableText text="不可编辑" onTextChange={() => {}} disabled />;
};

export default Demo;
```

### 自定义样式

```tsx
import React from 'react';
import { EditableText } from '@graphscope/studio-components';

const Demo = () => {
  return (
    <EditableText
      text="自定义样式"
      onTextChange={() => {}}
      style={{
        color: 'blue',
        fontSize: '16px',
      }}
      maxWidth={200}
      minWidth={100}
    />
  );
};

export default Demo;
```

## API

### EditableText

| 参数         | 说明                 | 类型                     | 默认值  |
| ------------ | -------------------- | ------------------------ | ------- |
| text         | 初始文本内容         | `string`                 | -       |
| onTextChange | 文本变化时的回调函数 | `(text: string) => void` | -       |
| id           | 组件唯一标识符       | `string`                 | -       |
| style        | 自定义样式           | `React.CSSProperties`    | -       |
| disabled     | 是否禁用编辑功能     | `boolean`                | `false` |
| maxWidth     | 最大宽度（像素）     | `number`                 | `100`   |
| minWidth     | 最小宽度（像素）     | `number`                 | `60`    |

```jsx
import React, { useState } from 'react';
import { EditableText } from '@graphscope/studio-components';
export default () => {
  const [state, updateState] = useState({
    text: 'double click',
  });
  const onChange = value => {
    console.log('value', value);
    updateState(preState => {
      return {
        ...preState,
        text: value,
      };
    });
  };
  const { text } = state;
  return (
    <div>
      <EditableText text={text} onTextChange={onChange} />
    </div>
  );
};
```
