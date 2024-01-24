import { Outlet } from 'umi';
import { ConfigProvider, Space, Input, ColorPicker, Divider } from 'antd';
import './index.less';
import Sidebar from './sidebar';
import Container from './container';

import Footer from './footer';
import { useState } from 'react';
import { IntlProvider, FormattedMessage, FormattedNumber } from 'react-intl';
import locales from '../locales';
import { useContext } from './useContext';
export default function Layout() {
  const { store } = useContext();
  const { locale, primaryColor } = store;
  //@ts-ignore
  const messages = locales[locale];
  return (
    <IntlProvider messages={messages} locale={locale}>
      <ConfigProvider
        theme={{
          components: {
            Menu: {
              itemBg: 'rgba(255, 255, 255, 0)',
              subMenuItemBg: 'rgba(255, 255, 255, 0)',
              iconMarginInlineEnd: 14,
              itemMarginInline: 4,
              iconSize: 14,
              collapsedWidth: 60,
            },
          },
          token: {
            colorPrimary: primaryColor,
          },
        }}
      >
        <Container sidebar={<Sidebar />} content={<Outlet />} footer={<Footer />} />
      </ConfigProvider>
    </IntlProvider>
  );
}
