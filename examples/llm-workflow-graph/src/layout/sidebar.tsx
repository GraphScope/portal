import React, { useState } from 'react';
import { GithubOutlined, ReadOutlined, LinkOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu, Flex, Button, theme, Tooltip } from 'antd';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useIntl } from 'react-intl';

import { Utils, Logo, useSection } from '@graphscope/studio-components';
import { SIDE_MENU } from './const';
import Header from './header';
import CollapsedButton from './collapsed';
const { useToken } = theme;

export const SideWidth = 160;
const Sidebar: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const { collapsed } = useSection();

  const { token } = useToken();

  const onClick: MenuProps['onClick'] = e => {
    navigate(e.key);
  };
  const iconStyle = {
    color: token.colorBgTextActive,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Logo style={{ width: collapsed.leftSide ? '28px' : '150px' }} onlyIcon={collapsed.leftSide}></Logo>
      </Header>

      <div style={{ display: 'flex', height: '100%', justifyContent: 'center', padding: '8px' }}>
        <Menu
          inlineCollapsed={collapsed.leftSide}
          onClick={onClick}
          defaultSelectedKeys={['/dataset']}
          // selectedKeys={[defaultPath]}
          items={SIDE_MENU}
          mode="vertical"
          style={{
            borderInlineEnd: 'none',
            width: collapsed.leftSide ? '50px' : `${SideWidth}px`,
          }}
        />
      </div>
    </div>
  );
};

export default Sidebar;
