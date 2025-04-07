---
title: ThemeProvider
---

```jsx
import React, { useState } from 'react';
import { Button, Layout, Typography, Flex } from 'antd';
import { SunOutlined, MoonOutlined } from '@ant-design/icons';
import { useThemes, ThemeProvider } from '@graphscope/studio-components';

const { Content } = Layout;
const { Text } = Typography;

/** 修改主题色 */
const ToogleButton = () => {
  const { algorithm, updateTheme, isDark } = useThemes();
  return (
    <Button
      onClick={() => {
        updateTheme();
      }}
      icon={isDark ? <SunOutlined /> : <MoonOutlined />}
    >
      {isDark ? '切换为亮色主题' : '切换为暗色主题'}
    </Button>
  );
};

export default () => {
  return (
    <ThemeProvider
      /** 主题模式 */
      mode="defaultAlgorithm"
    >
      <Layout>
        <Content style={{ height: '20vh' }}>
          <Flex justify="center" align="center" style={{ width: '100%', height: '100%' }}>
            <ToogleButton />
          </Flex>
        </Content>
      </Layout>
    </ThemeProvider>
  );
};
```
