import React from 'react';
import { Outlet } from 'react-router-dom';
import { ThemeProvider, Section, useSection, Logo } from '@graphscope/studio-components';
import locales from '../locales';
import Header from './header';
import Sidebar from './sidebar';
import { Button, Space, Segmented, Breadcrumb, Divider } from 'antd';
import { ReadOutlined, GithubOutlined, BarsOutlined, AppstoreOutlined } from '@ant-design/icons';
import CollapsedButton from './collapsed';

interface ILayoutProps {}

const Layout: React.FunctionComponent<ILayoutProps> = props => {
  const locale = 'en-US';
  return (
    <Section
      leftSide={
        <>
          <Sidebar />
        </>
      }
      splitBorder
      leftSideStyle={{
        width: '180px',
        margin: '0px',
        padding: '0px',
        minWidth: '50px',
      }}
      defaultCollapsed={{}}
    >
      <Header style={{ padding: '0px 12px', justifyContent: 'space-between', display: 'flex', alignItems: 'center' }}>
        <Space>
          <CollapsedButton />
          <div id="header-breadcrumb"></div>
        </Space>
        <Space>
          <Button
            onClick={() => {
              window.open('https://graphscope.io/', '_blank');
            }}
            icon={<ReadOutlined />}
            type="text"
          ></Button>
          <Button
            onClick={() => {
              window.open('https://github.com/GraphScope/portal', '_blank');
            }}
            icon={<GithubOutlined />}
            type="text"
          ></Button>
        </Space>
      </Header>
      <Outlet />
    </Section>
  );
};

export default Layout;
