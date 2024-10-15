import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { SettingFilled } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMagnifyingGlass,
  faDownload,
  faDiagramProject,
  faListCheck,
  faPuzzlePiece,
  faBell,
  faCoins,
} from '@fortawesome/free-solid-svg-icons';
import { MenuProps } from 'antd';

export const SETTING_MENU = [
  {
    label: <FormattedMessage id="navbar.setting" />,
    key: '/setting',
    icon: <SettingFilled />,
  },
];
export const TOOLS_MENU = [
  {
    label: <FormattedMessage id="Modeling" />,
    value: '/modeling',
    key: '/modeling',
    icon: <FontAwesomeIcon icon={faDiagramProject} />,
  },
  {
    label: <FormattedMessage id="Importing" />,
    key: '/importing',
    value: '/importing',
    icon: <FontAwesomeIcon icon={faDownload} />,
  },
  {
    label: <FormattedMessage id="Querying" />,
    key: '/querying',
    value: '/querying',
    icon: <FontAwesomeIcon icon={faMagnifyingGlass} />,
  },
];

export const SYSTEM_MENU = [
  {
    label: <FormattedMessage id="navbar.jobs" />,
    key: '/job',
    icon: <FontAwesomeIcon icon={faListCheck} />,
  },
  {
    label: <FormattedMessage id="navbar.extension" />,
    key: '/extension',
    icon: <FontAwesomeIcon icon={faPuzzlePiece} />,
  },
];

export const SIDE_MENU: MenuProps['items'] = [
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
  ...SYSTEM_MENU,
];

export const STATUS_MAP = {
  Running: {
    color: 'green',
  },
  Stopped: {
    color: 'red',
  },
  Draft: {
    color: '#ddd',
  },
};
