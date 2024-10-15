import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { MenuProps } from 'antd';
import { Menu, Flex } from 'antd';
import Logo from '../Logo';
import { useSection } from '../Section/useSection';

import Header from './header';
import CollapsedButton from './collapsed';

interface ISidebar {
  sideStyle: {
    width: number;
    collapsedWidth: number;
  };
  sideMenu: any[];
}

export const getActivekey = () => {
  const hashMode = window.location.hash.startsWith('#/');
  if (hashMode) {
    const [pathname] = window.location.hash.slice(1).split('?');
    return '/' + pathname.split('/')[1];
  } else {
    const { pathname } = window.location;
    return '/' + pathname.split('/')[1];
  }
};

const Sidebar: React.FunctionComponent<ISidebar> = props => {
  const { sideStyle, sideMenu } = props;
  const { width, collapsedWidth } = sideStyle;
  const navigate = useNavigate();
  const { collapsed } = useSection();
  const [hovering, setHovering] = useState(false);
  const [SIDE_MENU, SETTING_MENU] = sideMenu;

  const activeKey = getActivekey();

  const onClick: MenuProps['onClick'] = e => {
    navigate(e.key);
  };

  const onMouseEnter = () => {
    setHovering(true);
  };
  const onMouseLeave = () => {
    setHovering(false);
  };
  console.log(hovering, activeKey);

  return (
    <Flex vertical style={{ height: '100%' }} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <Header
        style={{
          overflow: 'hidden',
          width: collapsed.leftSide ? `${collapsedWidth}px` : `${width}px`,
          padding: '0px 14px',
        }}
      >
        <Logo />
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
          mode="vertical"
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
            mode="vertical"
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
