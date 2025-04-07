import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { MenuProps } from 'antd';
import { Menu, Flex, theme } from 'antd';
import Logo from '../Logo';
import { useSection } from '../Section/useSection';
import Header from './header';
import CollapsedButton from './collapsed';
import {  getCurrentNav } from '../Utils';

interface ISidebar {
  sideStyle: {
    width: number;
    collapsedWidth: number;
  };
  sideMenu: any[];
  onMenuClick?: (currentNav: string) => void;
}

const Sidebar: React.FunctionComponent<ISidebar> = props => {
  const { sideStyle, sideMenu, onMenuClick } = props;
  const { width, collapsedWidth } = sideStyle;
  const navigate = useNavigate();
  const { collapsed } = useSection();
  const [hovering, setHovering] = useState(false);
  const [SIDE_MENU, SETTING_MENU] = sideMenu;

  const activeKey = getCurrentNav();

  const onClick: MenuProps['onClick'] = e => {
    navigate(e.key);
    // const params = getAllSearchParams();
    // if (params && typeof params === 'object') {
    //   setSearchParams(params);
    // }
    if (onMenuClick) {
      onMenuClick(e.key);
    }
  };

  const onMouseEnter = () => {
    setHovering(true);
  };
  const onMouseLeave = () => {
    setHovering(false);
  };

  const { token } = theme.useToken();

  return (
    <Flex vertical style={{ height: '100%' }} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <Header
        style={{
          overflow: 'hidden',
          width: collapsed.leftSide ? `${collapsedWidth}px` : `${width}px`,
          padding: '0px 14px',
        }}
      >
        <Logo style={{ color: token.colorText }} />
      </Header>
      <div
        style={{
          height: '24px',
          display: 'flex',
          justifyContent: collapsed.leftSide ? 'center' : 'flex-end',
          padding: '0px 4px',
        }}
      >
        {hovering && <CollapsedButton />}
      </div>
      <Flex justify="space-between" vertical flex={1} style={{ marginBottom: '6px' }}>
        <Menu
          inlineCollapsed={collapsed.leftSide}
          onClick={onClick}
          defaultSelectedKeys={[activeKey]}
          selectedKeys={[activeKey]}
          items={SIDE_MENU}
          mode="inline"
          style={{
            boxSizing: 'border-box',
            borderInlineEnd: 'none',
            fontSize: '14px',
            // fontWeight: '600',
          }}
        />
        {SETTING_MENU && (
          <Menu
            inlineCollapsed={collapsed.leftSide}
            onClick={onClick}
            defaultSelectedKeys={[activeKey]}
            selectedKeys={[activeKey]}
            items={SETTING_MENU}
            mode="inline"
            style={{
              borderInlineEnd: 'none',
            }}
          />
        )}
      </Flex>
    </Flex>
  );
};

export default Sidebar;
