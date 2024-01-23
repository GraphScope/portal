import { Outlet } from 'umi';
import { ConfigProvider, Space, Input, ColorPicker, Divider } from 'antd';
import './index.less';
import Sidebar from './sidebar';

import Content from './content';
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
    <>
      <IntlProvider messages={messages} locale={locale}>
        <ConfigProvider
          theme={{
            components: {
              Menu: {
                itemBg: 'rgba(255, 255, 255, 0)',
                subMenuItemBg: 'rgba(255, 255, 255, 0)',
                // itemMarginInline: 16,
                itemPaddingInline: 16,
              },
            },
            token: {
              colorPrimary: primaryColor,
            },
          }}
        >
          <Sidebar />
          <Content>
            <Outlet />
            <Footer />
          </Content>
        </ConfigProvider>
      </IntlProvider>
    </>
  );
}
