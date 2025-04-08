---
title: ThemeProvider
---

```jsx
import React, { useState } from 'react';
import { Button, Space, Input } from 'antd';
import ThemeProvider from './index.tsx';
import { useStudioProvier } from './useThemeConfigProvider.tsx';
import { components, token } from './const.ts';
/** 修改主题色 */
const ToogleButton = () => {
  const { updateStudio } = useStudioProvier();
  return (
    <Button
      onClick={() => {
        updateStudio({
          components,
          token,
        });
      }}
    >
      edit
    </Button>
  );
};

export default () => {
  return (
    <ThemeProvider
      /** 主题模式 */
      mode="defaultAlgorithm"
    >
      <ToogleButton />
      <Button>colorPrimary</Button>
    </ThemeProvider>
  );
};
```
