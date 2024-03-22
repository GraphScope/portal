import React, { useState } from 'react';
import { SettingFilled, GithubOutlined, ReadOutlined, LinkOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu, Flex, Button, theme, Tooltip } from 'antd';
import { history, useLocation } from 'umi';
import { FormattedMessage, useIntl } from 'react-intl';

import { useContext } from './useContext';
import Logo from '@/components/logo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins, faMagnifyingGlass, faListCheck, faBell, faPuzzlePiece } from '@fortawesome/free-solid-svg-icons';

const { useToken } = theme;
interface ISidebarProps {}

const items: MenuProps['items'] = [
  {
    label: <FormattedMessage id="navbar.graphs" />,
    key: '/instance',
    icon: <FontAwesomeIcon icon={faCoins} />,
  },
  // {
  //   label: <FormattedMessage id="navbar.query" />,
  //   key: '/query',
  //   icon: <FileSearchOutlined />,
  // },
  {
    label: <FormattedMessage id="Query" />,
    key: '/query-app',
    icon: <FontAwesomeIcon icon={faMagnifyingGlass} />,
  },
];

const AlertModule =
  window.GS_ENGINE_TYPE === 'groot'
    ? [
        {
          label: <FormattedMessage id="navbar.alert" />,
          key: '/alert',
          icon: <FontAwesomeIcon icon={faBell} />,
        },
      ]
    : [];
const otherItems: MenuProps['items'] = [
  {
    label: <FormattedMessage id="navbar.jobs" />,
    key: '/job',
    icon: <FontAwesomeIcon icon={faListCheck} />,
  },
  ...AlertModule,
  {
    label: <FormattedMessage id="navbar.extension" />,
    key: '/extension',
    icon: <FontAwesomeIcon icon={faPuzzlePiece} />,
  },
  {
    label: <FormattedMessage id="navbar.setting" />,
    key: '/setting',
    icon: <SettingFilled />,
  },
];

const settingMenu: MenuProps['items'] = [
  // {
  //   label: <FormattedMessage id="collasped sidebar" />,
  //   key: '/layout',
  //   icon: <LayoutOutlined />,
  // },
  // {
  //   label: <FormattedMessage id="navbar.setting" />,
  //   key: '/setting',
  //   icon: <SettingFilled />,
  // },
];

let currentPath = window.location.pathname;
export const SideWidth = 150;
const Sidebar: React.FunctionComponent<ISidebarProps> = props => {
  const location = useLocation();
  const intl = useIntl();
  let defaultPath = '/' + location.pathname.split('/')[1];
  if (defaultPath === '/') {
    defaultPath = '/instance';
  }
  const { token } = useToken();
  const { store, updateStore } = useContext();
  const { collapse } = store;
  const [current, setCurrent] = useState(defaultPath);

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
  const iconStyle = {
    color: token.colorBgTextActive,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Logo style={{}} onlyIcon={collapse}></Logo>
      <div
        style={{
          flex: 1,
          width: `${SideWidth}px`,
          padding: '16px 0px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          fontSize: '16px',
          fontWeight: '600',
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

        <div style={{ marginBottom: '16px' }}>
          <Menu
            inlineCollapsed={collapse}
            onClick={onClick}
            // defaultSelectedKeys={[location.pathname]}
            selectedKeys={[current]}
            items={settingMenu}
            mode="vertical"
            style={{ borderInlineEnd: 'none' }}
          />
          <Flex gap={12} style={{ padding: '0px 12px' }}>
            <Tooltip
              title={intl.formatMessage({
                id: 'docs',
              })}
            >
              <Button
                onClick={() => {
                  window.open('https://graphscope.io/', '_blank');
                }}
                icon={<ReadOutlined style={iconStyle} />}
                type="text"
              ></Button>
            </Tooltip>
            <Tooltip
              title={intl.formatMessage({
                id: 'github',
              })}
            >
              <Button
                onClick={() => {
                  window.open('https://github.com/GraphScope/portal', '_blank');
                }}
                icon={<GithubOutlined style={iconStyle} />}
                type="text"
              ></Button>
            </Tooltip>
            <Tooltip
              title={intl.formatMessage({
                id: 'graphscope',
              })}
            >
              <Button
                onClick={() => {
                  window.open('https://github.com/alibaba/graphscope', '_blank');
                }}
                icon={<LinkOutlined style={iconStyle} />}
                type="text"
              ></Button>
            </Tooltip>
          </Flex>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
