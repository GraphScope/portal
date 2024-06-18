---
title: ThemeProvider
---

```jsx
import React, { useState } from 'react';
import { ThemeProvider } from '@graphscope/studio-components';
/** 包含内部组件*/
const Container = () => {
  return <div>Container</div>;
};
/** 配置每个特殊组件主题色*/
const components = {
  Result: {
    iconFontSize: 62,
    titleFontSize: 20,
    colorError: '#00000073',
  },
};
/** 配置全局token 主题色*/
const token = {
    borderRadius={6},
    colorPrimary={'#1677ff'}
};
export default () => {
  return (
    <ThemeProvider
      /** 主题模式 */
      mode={'defaultAlgorithm'}
      components={componentsType}
      token={tokenType}
    >
      <Container />
    </ThemeProvider>
  );
};
```
