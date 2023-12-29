import React, { useState } from 'react';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu, Divider } from 'antd';
import styles from './styles';
import { history, useLocation } from 'umi';

interface ISidebarProps {}

const items: MenuProps['items'] = [
  {
    label: '概览',
    key: '/',
    icon: <MailOutlined />,
  },
  {
    label: '图实例',
    key: '/instance',
    icon: <AppstoreOutlined />,
  },
];

const otherItems: MenuProps['items'] = [
  {
    label: '作业管理',
    key: '/job',
    icon: <MailOutlined />,
  },
  {
    label: '监控告警',
    key: '/alert',
    icon: <AppstoreOutlined />,
  },
  {
    label: '扩展插件',
    key: '/extension',
    icon: <AppstoreOutlined />,
  },
];

const Sidebar: React.FunctionComponent<ISidebarProps> = props => {
  const location = useLocation();
  console.log('location', location.pathname);

  const [current, setCurrent] = useState(location.pathname);

  const onClick: MenuProps['onClick'] = e => {
    setCurrent(e.key);
    history.push(`${e.key}`);
  };

  return (
    <div style={styles.sidebar}>
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
    </div>
  );
};

export default Sidebar;
