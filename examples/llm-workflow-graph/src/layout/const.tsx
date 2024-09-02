import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { SettingFilled, DatabaseOutlined } from '@ant-design/icons';

import { MenuProps } from 'antd';

export const SIDE_MENU: MenuProps['items'] = [
  {
    label: <FormattedMessage id="Dataset" />,
    key: '/dataset',
    icon: <DatabaseOutlined />,
  },
  // {
  //   type: 'divider',
  // },
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
