---
title: ResizablePanels
---

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
