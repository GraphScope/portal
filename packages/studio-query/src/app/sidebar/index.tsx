/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { memo } from 'react';
import { SegmentedTabs, SegmentedTabsProps, SideTabs } from '@graphscope/studio-components';

import { IStudioQueryProps } from '../context';

interface SidebarProps {
  title?: string;
  items: SegmentedTabsProps['items'];
  displaySidebarPosition?: boolean;
  type?: IStudioQueryProps['displaySidebarType'];
}

const Sidebar: React.FunctionComponent<SidebarProps> = props => {
  const { items, type } = props;
  if (type === 'Segmented') {
    return <SegmentedTabs items={items} block rootStyle={{ padding: '8px 8px 8px 4px' }}></SegmentedTabs>;
  }
  return <SideTabs items={items} width={320}></SideTabs>;
};

export default memo(Sidebar);
