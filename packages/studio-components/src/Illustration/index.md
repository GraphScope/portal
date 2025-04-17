---
title: Illustration 插画
group:
  title: 数据展示
  order: 3
---

# Illustration 插画

一套精美的插画组件，用于增强用户界面的视觉效果和用户体验。所有插画均来自 [unDraw](https://undraw.co/illustrations)，并经过优化以适应组件库的使用场景。

## 何时使用

- 需要在空状态、加载状态等场景下展示友好的视觉提示时
- 需要为界面添加生动的视觉元素时
- 需要统一管理项目中的插画资源时

## Examples

### Basic Usage

```tsx
import React from 'react';
import { Illustration } from '@graphscope/studio-components';

const Demo = () => {
  return <Illustration.Welcome />;
};

export default Demo;
```

### Illustration List

```tsx
import React from 'react';
import { Space, Flex, Typography } from 'antd';
import { Illustration } from '@graphscope/studio-components';

const Demo = () => {
  return (
    <Flex wrap gap={44}>
      {Object.keys(Illustration).map(key => {
        const Item = Illustration[key];
        return (
          <Flex key={key} gap={8} vertical align="center">
            <Item />
            <Typography.Text>{key}</Typography.Text>
          </Flex>
        );
      })}
    </Flex>
  );
};

export default Demo;
```

### Custom Color

```tsx
import React from 'react';
import { Illustration } from '@graphscope/studio-components';

const Demo = () => {
  return <Illustration.Welcome color="#1890ff" />;
};

export default Demo;
```

### Custom Size

```tsx
import React from 'react';
import { Illustration } from '@graphscope/studio-components';

const Demo = () => {
  return <Illustration.Welcome width={300} height={200} />;
};

export default Demo;
```

## API

### Illustration

| 插画名称     | 说明         | 使用场景             |
| ------------ | ------------ | -------------------- |
| Welcome      | 欢迎插画     | 欢迎页面、首页       |
| Job          | 工作插画     | 任务列表、工作台     |
| Explore      | 探索插画     | 数据探索、分析页面   |
| DesignSchema | 设计模式插画 | 设计页面、模式展示   |
| Process      | 流程插画     | 流程展示、步骤说明   |
| Success      | 成功插画     | 操作成功、完成状态   |
| Next         | 下一步插画   | 引导流程、步骤提示   |
| Loading      | 加载插画     | 加载状态、等待提示   |
| Upload       | 上传插画     | 文件上传、导入功能   |
| FunArrow     | 趣味箭头插画 | 交互提示、引导说明   |
| Programming  | 编程插画     | 代码相关、开发功能   |
| Experiment   | 实验插画     | 实验功能、测试场景   |
| Settings     | 设置插画     | 设置页面、配置功能   |
| Charts       | 图表插画     | 数据可视化、统计展示 |

### IIllustrationProps

| 参数      | 说明       | 类型                  | 默认值 |
| --------- | ---------- | --------------------- | ------ |
| style     | 自定义样式 | `React.CSSProperties` | -      |
| className | 自定义类名 | `string`              | -      |
