---
title: LocaleProvider
---

```jsx
import React, { useState } from 'react';
import { Button, Layout, Typography, Flex } from 'antd';
import { FormattedMessage } from 'react-intl';
import { useLocales, LocaleProvider, SvgEnToZh, SvgZhToEn } from '@graphscope/studio-components';

const { Content } = Layout;
const { Text } = Typography;

const locales = {
    'en-US': {
        'navbar.jobs': 'Jobs',
        'navbar.extension': 'Extensions',
        'navbar.alert': 'Alerts',
        'navbar.setting': 'Settings',
        'navbar.deployment': 'Deployment',
    },
    'zh-CN': {
        'navbar.jobs': '作业管理',
        'navbar.extension': '扩展插件',
        'navbar.alert': '告警监控',
        'navbar.setting': '应用设置',
        'navbar.deployment': '部署状态',
    }
}

/** 修改主题色 */
const ToogleButton = () => {
  const { locale = 'en-US', handleLocales } = useLocales();
  return (
    <Button
      onClick={() => {
        handleLocales();
      }}
      icon={locale === 'en-US' ? <SvgEnToZh /> : <SvgZhToEn />}
    >
      {locale === 'en-US' ? 'Switch to Chinese' : '切换为英文'}
    </Button>
  );
};

export default () => {
  return (
    <LocaleProvider locales={locales}>
      <Layout>
        <Content >
          <Flex justify="center" align="center" vertical style={{ padding: 24 }}>
            <Text><FormattedMessage id="navbar.jobs" /> </Text>
            <Text><FormattedMessage id="navbar.extension" /> </Text>
            <Text><FormattedMessage id="navbar.alert" /> </Text>
            <Text><FormattedMessage id="navbar.setting" /> </Text>
            <Text><FormattedMessage id="navbar.deployment" /> </Text>
            <ToogleButton />
          </Flex>
        </Content>
      </Layout>
    </LocaleProvider>
  );
};
```
