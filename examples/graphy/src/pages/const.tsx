import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { SettingFilled, FilePdfOutlined, DeploymentUnitOutlined, AppstoreOutlined } from '@ant-design/icons';

import { MenuProps } from 'antd';

export const SIDE_MENU: MenuProps['items'] = [
  {
    label: <FormattedMessage id="Graphy" />,
    key: '/dataset',
    icon: <FilePdfOutlined />,
  },
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
