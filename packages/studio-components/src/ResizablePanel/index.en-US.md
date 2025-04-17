---
title: ResizablePanel
group:
  title: Layout
  order: 2
---

# ResizablePanel

## Component Introduction

ResizablePanel is a resizable panel component that supports left, middle, and right panel areas. Users can adjust the width of each panel by dragging the handle.

## Usage Scenarios

- When a resizable panel layout is needed
- When flexible panel width control is required

## Code Demo

```jsx
import React from 'react';
import { ResizablePanel } from '@graphscope/studio-components';

const Demo = () => {
  return (
    <ResizablePanel
      leftPanel={<div>Left Panel Content</div>}
      middlePanel={<div>Middle Panel Content</div>}
      rightPanel={<div>Right Panel Content</div>}
      leftMinWidth={20}
      leftMaxWidth={40}
      rightMinWidth={20}
      rightMaxWidth={40}
    />
  );
};

export default Demo;
```

## API

### ResizablePanel

| Property      | Description                             | Type                  | Default |
| ------------- | --------------------------------------- | --------------------- | ------- |
| leftPanel     | Left panel content                      | `React.ReactNode`     | -       |
| middlePanel   | Middle panel content                    | `React.ReactNode`     | -       |
| rightPanel    | Right panel content                     | `React.ReactNode`     | -       |
| leftMinWidth  | Minimum width percentage of left panel  | `number`              | 20      |
| leftMaxWidth  | Maximum width percentage of left panel  | `number`              | 40      |
| rightMinWidth | Minimum width percentage of right panel | `number`              | 20      |
| rightMaxWidth | Maximum width percentage of right panel | `number`              | 40      |
| style         | Custom styles                           | `React.CSSProperties` | -       |
| className     | Custom class name                       | `string`              | -       |
