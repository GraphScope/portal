import { ConfigProvider, theme as AntdTheme } from 'antd';
import { IntlProvider } from 'react-intl';
import React from 'react';
import locales from '../locales';

export default function Provider(props) {
  const { locale, theme, children } = props;
  const { primaryColor, mode, inputNumber = '6px' } = theme;
  //@ts-ignore
  const messages = locales[locale];
  return (
    <IntlProvider messages={messages} locale={locale}>
      <ConfigProvider
        theme={{
          // 1. 单独使用暗色算法
          algorithm: mode === 'defaultAlgorithm' ? AntdTheme.defaultAlgorithm : AntdTheme.darkAlgorithm,
          components: {
            Table: {
              headerBg: mode === 'defaultAlgorithm' ? '#fff' : '#161616',
              headerColor: mode === 'defaultAlgorithm' ? 'rgba(0, 0, 0, 0.45)' : '#DBDBDB',
              headerSplitColor: mode === 'defaultAlgorithm' ? '#fff' : '#161616',
            },
          },
          token: {
            colorPrimary: primaryColor,
          },
        }}
      >
        {children}
      </ConfigProvider>
    </IntlProvider>
  );
}
