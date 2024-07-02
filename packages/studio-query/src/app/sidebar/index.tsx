/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { memo } from 'react';
import { Utils, SegmentedTabs, SegmentedTabsProps } from '@graphscope/studio-components';
import { RollbackOutlined, PicLeftOutlined, SlidersOutlined } from '@ant-design/icons';
import { Space, Button, theme, Flex, Typography, Tooltip, Divider, Tag } from 'antd';
const { useToken } = theme;

interface SidebarProps {
  title?: string;
  items: SegmentedTabsProps['items'];
}

const Sidebar: React.FunctionComponent<SidebarProps> = props => {
  const { items } = props;
  return (
    <div>
      <SegmentedTabs items={items} block></SegmentedTabs>
    </div>
  );
};

export default memo(Sidebar);
