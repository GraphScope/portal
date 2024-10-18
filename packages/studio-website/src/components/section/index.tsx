import * as React from 'react';
import { Breadcrumb, theme } from 'antd';

import type { TabsProps } from 'antd';
import { CreatePortal, SegmentedTabs } from '@graphscope/studio-components';
interface IFormattedMessage {
  id: string;
  values?: { [key: string]: string };
}
interface ISectionProps {
  title?: string;
  desc?: string | IFormattedMessage;
  breadcrumb?: { title: React.ReactNode }[];
  children?: React.ReactNode;
  items?: TabsProps['items'];
  style?: React.CSSProperties;
}

const Section: React.FunctionComponent<ISectionProps> = props => {
  const { breadcrumb = [], children, items, style } = props;
  const { token } = theme.useToken();

  return (
    <div
      style={{
        boxSizing: 'border-box',
        height: 'calc(100% - 50px)',
        background: token.colorBgContainer, // '#fafafa',
        position: 'relative',
        overflowY: 'scroll',
      }}
    >
      <CreatePortal targetId="header-breadcrumb">
        <Breadcrumb items={breadcrumb} style={{ fontSize: '18px', marginLeft: '8px' }} />
      </CreatePortal>

      {items && (
        <div style={{ padding: '24px' }}>
          {/** @ts-ignore */}
          <SegmentedTabs items={items} />
        </div>
      )}
      <div
        style={{
          padding: '24px 24px 24px 24px',
          flex: 1,
          ...style,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Section;
