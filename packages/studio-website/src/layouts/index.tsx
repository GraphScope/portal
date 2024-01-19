import { Link, Outlet, useLocation } from 'umi';
import { Button, ConfigProvider, Space, Input, ColorPicker, Divider } from 'antd';
import './index.less';
import Sidebar from './sidebar';

import Content from './content';
import Footer from './footer';
import { useState } from 'react';
import { IntlProvider, FormattedMessage, FormattedNumber } from 'react-intl';
import locales from '../locales';
import { useContext } from './useContext';
export default function Layout() {
  const location = useLocation();
  console.log('props', location);
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
              Select: {},
            },
            token: {
              colorPrimary: primaryColor,
            },
          }}
        >
          <Sidebar />
          <Content>
            <Outlet />
          </Content>
          <Footer />
        </ConfigProvider>
      </IntlProvider>
    </>
  );
}
