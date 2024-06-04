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
      <ModelingApp
        /** 属性下拉选项值 */
        queryPrimitiveTypes={() => {
          return ['DT_DOUBLE', 'DT_STRING', 'DT_SIGNED_INT32', 'DT_SIGNED_INT64'].map(item => {
            return { label: item, value: item };
          });
        }}
        GS_ENGINE_TYPE={'interactive'}
        appMode="DATA_MODELING"
        createGraph={() => {}}
        uploadFile={() => {}}
      />
    </div>
  );
};
```
