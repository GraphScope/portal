/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { memo } from 'react';
import { Utils, SegmentedTabs, SegmentedTabsProps, SideTabs } from '@graphscope/studio-components';
import { RollbackOutlined, PicLeftOutlined, SlidersOutlined } from '@ant-design/icons';
import { Space, Button, theme, Flex, Typography, Tooltip, Divider, Tag } from 'antd';
const { useToken } = theme;

interface SidebarProps {
  title?: string;
  items: SegmentedTabsProps['items'];
  displaySidebarPosition?: boolean;
}

// <SideTabs items={items}></SideTabs>
// <SegmentedTabs items={items} block></SegmentedTabs>
const Sidebar: React.FunctionComponent<SidebarProps> = props => {
  const { items } = props;
  return <SegmentedTabs items={items} block rootStyle={{ padding: '9px 8px 8px 4px' }}></SegmentedTabs>;
};

export default memo(Sidebar);
