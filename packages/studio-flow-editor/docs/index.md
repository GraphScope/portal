---
order: 0
title: 快速开始
---
### 1. 简介

GraphEditor 是一个基于 reactflow 的图形编辑器组件，用于创建和管理节点和边的可视化布局。它提供了丰富的交互功能，如节点拖拽、边连接、背景显示、迷你地图等。

### 2. 基本用法

以下是一个基本的使用示例

```jsx
import React, { useState, useEffect } from 'react';
import { GraphEditor, GraphProvider } from '@graphscope/studio-flow-editor';
export default () => {
  return (
    <div style={{ height: '400px', position: 'relative' }}>
      <GraphProvider>
        <GraphEditor  />
      </GraphProvider>
    </div>
  );
};
```




