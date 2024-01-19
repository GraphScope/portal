import React, { useState } from 'react';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu, Divider, ColorPicker, Space } from 'antd';
import styles from './styles';
import { history, useLocation } from 'umi';
import { FormattedMessage } from 'react-intl';
import LocaleSwitch from '../components/locale-switch';
import { useContext } from './useContext';
import Logo from './logo';
interface ISidebarProps {}

const items: MenuProps['items'] = [
  {
    label: <FormattedMessage id="navbar.graphs" />,
    key: '/instance',
    icon: <AppstoreOutlined />,
  },
  {
    label: <FormattedMessage id="navbar.query" />,
    key: '/query',
    icon: <MailOutlined />,
  },
];

const otherItems: MenuProps['items'] = [
  {
    label: <FormattedMessage id="navbar.jobs" />,
    key: '/job',
    icon: <MailOutlined />,
  },
  {
    label: <FormattedMessage id="navbar.alert" />,
    key: '/alert',
    icon: <AppstoreOutlined />,
  },
  {
    label: <FormattedMessage id="navbar.extension" />,
    key: '/extension',
    icon: <AppstoreOutlined />,
  },
];

const Sidebar: React.FunctionComponent<ISidebarProps> = props => {
  const location = useLocation();
  console.log('location', location.pathname);
  const { store, updateStore } = useContext();
  const { locale, primaryColor } = store;
  const [current, setCurrent] = useState(location.pathname);

  const onClick: MenuProps['onClick'] = e => {
    setCurrent(e.key);
    history.push(`${e.key}`);
  };

  return (
    <div style={styles.sidebar}>
      <Logo></Logo>
      <Menu
        onClick={onClick}
        // defaultSelectedKeys={[location.pathname]}
        selectedKeys={[current]}
        items={items}
        mode="vertical"
        style={styles.menu}
      />
      <Divider style={{ minWidth: 240 - 24 + 'px', width: 240 - 24 + 'px', margin: '12px' }} />
      <Menu
        onClick={onClick}
        // defaultSelectedKeys={[location.pathname]}
        selectedKeys={[current]}
        items={otherItems}
        mode="vertical"
        style={styles.menu}
      />
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
      </Space>
    </div>
  );
};

export default Sidebar;
