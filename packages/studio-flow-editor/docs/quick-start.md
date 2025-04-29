---
order: 1
title: 快速开始
---
# 快速开始

## 安装

```bash
# 使用npm
npm install @graphscope/studio-flow-editor

# 使用yarn
yarn add @graphscope/studio-flow-editor

# 使用pnpm
pnpm add @graphscope/studio-flow-editor
```

## 基本用法

下面是一个最简单的例子，展示了如何创建一个基本的图编辑器：

```jsx
import React from 'react';
import { GraphProvider, GraphEditor } from '@graphscope/studio-flow-editor';

const App = () => {
  return (
    <div style={{ width: '100%', height: '600px', position: 'relative' }}>
      <GraphProvider>
        <GraphEditor />
      </GraphProvider>
    </div>
  );
};

export default App;
```
