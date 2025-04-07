import * as React from 'react';
import { Breadcrumb, theme, Flex } from 'antd';

import type { TabsProps } from 'antd';
import { CreatePortal } from '@graphscope/studio-components';
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
        // background: isLight ? '#fafafa' : '#242424',
        background: token.colorBgLayout,
        position: 'relative',
        overflowY: 'scroll',
      }}
    >
      <CreatePortal targetId="header-breadcrumb">
        <Breadcrumb items={breadcrumb} style={{ fontSize: '18px', marginLeft: '8px' }} />
      </CreatePortal>
      <Flex
        vertical
        style={{
          padding: '12px 12px',
          borderRadius: token.borderRadius,
          gap: 12,
          ...style,
        }}
      >
        {children}
      </Flex>
    </div>
  );
};

export default Section;
