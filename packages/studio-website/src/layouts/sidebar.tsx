import React, { useState } from 'react';
import { SettingFilled, GithubOutlined, ReadOutlined, LinkOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu, Flex, Button, theme, Tooltip } from 'antd';
import { history, useLocation } from 'umi';
import { FormattedMessage, useIntl } from 'react-intl';

import { useContext } from './useContext';
import Logo from '@/components/logo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCoins,
  faMagnifyingGlass,
  faDownload,
  faListCheck,
  faBell,
  faPuzzlePiece,
  faDiagramProject,
} from '@fortawesome/free-solid-svg-icons';
import { Utils } from '@graphscope/studio-components';
import { modalGlobalConfig } from 'antd/es/modal/confirm';
import { TOOLS_MENU } from './const';
const { useToken } = theme;

const items: MenuProps['items'] = [
  {
    label: <FormattedMessage id="navbar.graphs" />,
    key: '/graphs',
    icon: <FontAwesomeIcon icon={faCoins} />,
  },
  {
    type: 'divider',
  },
  ...TOOLS_MENU,
  {
    type: 'divider',
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

export const SideWidth = 150;
const Sidebar: React.FunctionComponent = () => {
  const location = useLocation();
  const intl = useIntl();
  let defaultPath = '/' + location.pathname.split('/')[1];
  if (defaultPath === '/') {
    defaultPath = '/graphs';
  }
  const { token } = useToken();
  const { store, updateStore } = useContext();
  const { collapse } = store;

  const onClick: MenuProps['onClick'] = e => {
    if (e.key === '/layout') {
      updateStore(draft => {
        draft.collapse = !draft.collapse;
      });
      return;
    }

    const graphId = Utils.searchParamOf('graph_id');
    const url = graphId ? `${e.key}?graph_id=${graphId}` : e.key;
    history.push(`${url}`);
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
          selectedKeys={[defaultPath]}
          items={[...items, ...otherItems]}
          mode="vertical"
          style={{ borderInlineEnd: 'none' }}
        />

        <div style={{ marginBottom: '16px' }}>
          <Menu
            inlineCollapsed={collapse}
            onClick={onClick}
            // defaultSelectedKeys={[location.pathname]}
            selectedKeys={[defaultPath]}
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
