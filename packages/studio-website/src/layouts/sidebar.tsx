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
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu, Divider, ColorPicker, Space } from 'antd';
import styles from './styles';
import { history, useLocation } from 'umi';
import { FormattedMessage } from 'react-intl';
import LocaleSwitch from '../components/locale-switch';
import { useContext } from './useContext';
import Logo from './logo';
import { LayoutOutlined } from '@ant-design/icons';
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

let currentPath = window.location.pathname;
export const SideWidth = 150;
const Sidebar: React.FunctionComponent<ISidebarProps> = props => {
  const location = useLocation();
  console.log('location', location.pathname);
  const { store, updateStore } = useContext();
  const { locale, primaryColor, collapse } = store;
  const [current, setCurrent] = useState(location.pathname);

  const onClick: MenuProps['onClick'] = e => {
    setCurrent(e.key);
    history.push(`${e.key}`);
  };

  return (
    <div
      style={{
        // position: 'absolute',
        // top: '0px',
        // left: '0px',
        // bottom: '0px',
        width: collapse ? '80px' : `${SideWidth}px`,
        boxSizing: 'border-box',
        // border: '1px solid red',
      }}
    >
      <Logo></Logo>
      <div style={{ width: `${SideWidth}px`, padding: '0px 0px', boxSizing: 'border-box' }}>
        <Menu
          inlineCollapsed={collapse}
          onClick={onClick}
          // defaultSelectedKeys={[location.pathname]}
          selectedKeys={[current]}
          items={[...items, ...otherItems]}
          mode="vertical"
          style={{ borderInlineEnd: 'none' }}
        />
      </div>
      {/* <Divider style={{ margin: '12px' }} />
      <Menu
        onClick={onClick}
        // defaultSelectedKeys={[location.pathname]}
        selectedKeys={[current]}
        items={otherItems}
        mode="vertical"
        style={{ borderInlineEnd: 'none' }}
      /> */}
      <div style={{}}>
        <Space direction="vertical">
          <LocaleSwitch
            value={locale}
            onChange={value => {
              updateStore(draft => {
                draft.locale = value;
              });
            }}
          ></LocaleSwitch>
          <ColorPicker
            // style={{ display: 'block' }}
            showText
            value={primaryColor}
            onChangeComplete={color => {
              updateStore(draft => {
                draft.primaryColor = color.toHexString();
              });
            }}
          />
          <LayoutOutlined
            onClick={() => {
              updateStore(draft => {
                draft.collapse = !collapse;
              });
            }}
          />
        </Space>
      </div>
    </div>
  );
};

export default Sidebar;
