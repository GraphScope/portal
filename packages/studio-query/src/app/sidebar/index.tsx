/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { memo } from 'react';
import { Utils, SegmentedTabs, SegmentedTabsProps, SideTabs } from '@graphscope/studio-components';
import { RollbackOutlined, PicLeftOutlined, SlidersOutlined } from '@ant-design/icons';
import { Space, Button, theme, Flex, Typography, Tooltip, Divider, Tag } from 'antd';
import { IStudioQueryProps } from '../context';
const { useToken } = theme;

interface SidebarProps {
  title?: string;
  items: SegmentedTabsProps['items'];
  displaySidebarPosition?: boolean;
  type?: IStudioQueryProps['displaySidebarType'];
}

const Sidebar: React.FunctionComponent<SidebarProps> = props => {
  const { items, type } = props;
  if (type === 'Segmented') {
    return <SegmentedTabs items={items} block rootStyle={{ padding: '9px 8px 8px 4px' }}></SegmentedTabs>;
  }
  return <SideTabs items={items}></SideTabs>;
};

export default memo(Sidebar);
