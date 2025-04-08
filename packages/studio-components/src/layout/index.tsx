import React from 'react';
import { Outlet } from 'react-router-dom';
import Section from '../Section';
import Header from './header';
import Sidebar from './sidebar';
import { Button, Space, theme, Tooltip } from 'antd';
import { ReadOutlined, GithubOutlined } from '@ant-design/icons';
import { getCurrentNav } from '../Utils';

interface ILayoutProps {
  sideStyle?: {
    width?: number;
    collapsedWidth?: number;
  };
  github?: string;
  sideMenu: any[];
  style?: React.CSSProperties;
  collapsedConfig?: Record<string, boolean>;
  onMenuClick?: (currentNav: string) => void;
  headerSlot?: React.ReactNode | null;
}

const Layout: React.FunctionComponent<ILayoutProps> = props => {
  const {
    sideStyle = {},
    github = 'https://github.com/GraphScope/portal',
    sideMenu,
    style = {},
    collapsedConfig = {},
    onMenuClick,
    headerSlot=null,
  } = props;

  const { width = 220, collapsedWidth = 56 } = sideStyle;
  const activeKey = getCurrentNav();
  const { token } = theme.useToken();

  const leftSideCollapsed = collapsedConfig[activeKey] || false;

  return (
    <Section
      style={{
        background: token.colorBgContainer,
        ...style,
      }}
      leftSide={
        <>
          <Sidebar sideStyle={{ width, collapsedWidth }} sideMenu={sideMenu} onMenuClick={onMenuClick} />
        </>
      }
      splitBorder
      leftSideStyle={{
        width: `${width}px`,
        margin: '0px',
        padding: '0px',
        minWidth: `${collapsedWidth}px`,
      }}
      defaultCollapsed={{
        leftSide: leftSideCollapsed,
      }}
    >
      <Header style={{ padding: '0px 12px', justifyContent: 'space-between', display: 'flex', alignItems: 'center' }}>
        <Space>
          <div id="header-breadcrumb"></div>
        </Space>
        <Space>
          {headerSlot}
          <Tooltip title="访问 GraphScope 官网">
            <Button
              onClick={() => {
                window.open('https://graphscope.io/', '_blank');
              }}
              icon={<ReadOutlined />}
              type="text"
            ></Button>
          </Tooltip>
          <Tooltip title="GraphScope Github">
            <Button
              onClick={() => {
                window.open(github, '_blank');
              }}
              icon={<GithubOutlined />}
              type="text"
            ></Button>
          </Tooltip>
        </Space>
      </Header>
      <Outlet />
    </Section>
  );
};

export default Layout;
