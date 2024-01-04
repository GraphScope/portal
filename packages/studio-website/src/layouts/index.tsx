import { Link, Outlet, useLocation } from 'umi';
import { Button, ConfigProvider, Space, Input, ColorPicker, Divider } from 'antd';
import './index.less';
import Sidebar from './sidebar';
import Navbar from './navbar';
import Content from './content';
import Footer from './footer';
import { useState } from 'react';

export default function Layout() {
  const location = useLocation();
  console.log('props', location);
  const [primary, setPrimary] = useState('#1677ff');

  return (
    <>
      <ConfigProvider
        theme={{
          components: {
            Select: {
              selectorBg: 'red',
              optionSelectedBg: 'red',
            },
          },
          token: {
            colorPrimary: primary,
          },
        }}
      >
        <Navbar />
        <Sidebar />
        <Content>
          <ColorPicker
            showText
            value={primary}
            onChangeComplete={color => setPrimary(color.toHexString())}
            style={{ position: 'absolute', top: '-48px' }}
          />

          <Outlet />
        </Content>
        <Footer />
      </ConfigProvider>
    </>
  );
}
