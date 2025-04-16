---
title: TypingText 打字机效果文本
group:
  title: 反馈
  order: 1
---

# TypingText 打字机效果文本

一个基于 typewriter-effect 实现的打字机效果文本组件，支持自定义打字速度、删除速度和循环播放。

## 何时使用

- 需要展示打字机效果时
- 需要强调文本内容时
- 需要展示加载或生成过程时

## 代码演示

### 基础用法

```tsx
import React from 'react';
import { TypingText } from '@graphscope/studio-components';

const Demo = () => {
  return <TypingText>这是一段打字机效果文本</TypingText>;
};

export default Demo;
```

### 自定义速度

```tsx
import React from 'react';
import { TypingText } from '@graphscope/studio-components';

const Demo = () => {
  return (
    <TypingText delay={50} deleteSpeed={30}>
      这是一段自定义速度的打字机效果文本
    </TypingText>
  );
};

export default Demo;
```

### 循环播放

```tsx
import React from 'react';
import { TypingText } from '@graphscope/studio-components';

const Demo = () => {
  return <TypingText loop>这是一段循环播放的打字机效果文本</TypingText>;
};

export default Demo;
```

### 完成回调

```tsx
import React from 'react';
import { TypingText } from '@graphscope/studio-components';

const Demo = () => {
  const handleComplete = () => {
    console.log('打字效果完成');
  };

  return <TypingText onComplete={handleComplete}>这是一段带有完成回调的打字机效果文本</TypingText>;
};

export default Demo;
```

### 自定义加载提示

```tsx
import React from 'react';
import { TypingText } from '@graphscope/studio-components';

const Demo = () => {
  return <TypingText loadingText="正在生成...">这是一段带有自定义加载提示的打字机效果文本</TypingText>;
};

export default Demo;
```

## API

### TypingText

| 参数        | 说明                 | 类型         | 默认值            |
| ----------- | -------------------- | ------------ | ----------------- |
| children    | 要显示的文本内容     | `string`     | -                 |
| delay       | 打字延迟时间（毫秒） | `number`     | `10`              |
| deleteSpeed | 删除速度（毫秒）     | `number`     | `10`              |
| loop        | 是否循环播放         | `boolean`    | `false`           |
| onComplete  | 打字完成后的回调函数 | `() => void` | -                 |
| loadingText | 加载提示文本         | `string`     | `'Generating...'` |

```

```
