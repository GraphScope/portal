---
order: 1
title: Modeling
---

```jsx
import React, { useState, useEffect } from 'react';
import ModelingApp from '@graphscope/studio-importor';
export default () => {
  return (
    <div
      style={{
        // padding: '12px',
        // height: 'calc(100vh - 64px)',
        // boxSizing: 'border-box',
        position: 'fixed',
        top: '65px',
        left: '0px',
        right: '0px',
        zIndex: 999,
        bottom: '0px',
        background: '#fff',
      }}
    >
      <ModelingApp />
    </div>
  );
};
```
