import React, { useState } from 'react';
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
  DesktopOutlined,
  FileSearchOutlined,
  DashboardOutlined,
  OrderedListOutlined,
  AppstoreAddOutlined,
  SettingFilled,
  LayoutOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu, Divider, ColorPicker, Space } from 'antd';
import styles from './styles';
import { history, useLocation } from 'umi';
import { FormattedMessage } from 'react-intl';

import { useContext } from './useContext';
import Logo from './logo';

interface ISidebarProps {}

const items: MenuProps['items'] = [
  {
    label: <FormattedMessage id="navbar.graphs" />,
    key: '/instance',
    icon: <DesktopOutlined />,
  },
  {
    label: <FormattedMessage id="navbar.query" />,
    key: '/query',
    icon: <FileSearchOutlined />,
  },
];

const otherItems: MenuProps['items'] = [
  {
    label: <FormattedMessage id="navbar.jobs" />,
    key: '/job',
    icon: <OrderedListOutlined />,
  },
  {
    label: <FormattedMessage id="navbar.alert" />,
    key: '/alert',
    icon: <DashboardOutlined />,
  },
  {
    label: <FormattedMessage id="navbar.extension" />,
    key: '/extension',
    icon: <AppstoreAddOutlined />,
  },
];

const settingMenu: MenuProps['items'] = [
  {
    label: <FormattedMessage id="navbar.setting" />,
    key: '/setting',
    icon: <SettingFilled />,
  },
  {
    label: <FormattedMessage id="collasped sidebar" />,
    key: '/layout',
    icon: <LayoutOutlined />,
  },
];

let currentPath = window.location.pathname;
export const SideWidth = 150;
const Sidebar: React.FunctionComponent<ISidebarProps> = props => {
  const location = useLocation();
  console.log('location', location.pathname);
  const { store, updateStore } = useContext();
  const { locale, primaryColor, collapse } = store;
  const [current, setCurrent] = useState(location.pathname);

  const onClick: MenuProps['onClick'] = e => {
    if (e.key === '/layout') {
      updateStore(draft => {
        draft.collapse = !draft.collapse;
      });
      return;
    }
    setCurrent(e.key);
    history.push(`${e.key}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Logo></Logo>
      <div
        style={{
          flex: 1,
          width: `${SideWidth}px`,
          padding: '0px 0px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Menu
          inlineCollapsed={collapse}
          onClick={onClick}
          // defaultSelectedKeys={[location.pathname]}
          selectedKeys={[current]}
          items={[...items, ...otherItems]}
          mode="vertical"
          style={{ borderInlineEnd: 'none' }}
        />

        <div style={{}}>
          <Menu
            inlineCollapsed={collapse}
            onClick={onClick}
            // defaultSelectedKeys={[location.pathname]}
            selectedKeys={[current]}
            items={settingMenu}
            mode="vertical"
            style={{ borderInlineEnd: 'none' }}
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
