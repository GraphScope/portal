import * as React from 'react';
import { Breadcrumb, Divider, Typography, Tabs } from 'antd';
import { FormattedMessage } from 'react-intl';
import type { BreadcrumbProps, TabsProps } from 'antd';

interface ISectionProps {
  title: string;
  desc: string;
  breadcrumb: BreadcrumbProps['items'];
  children?: React.ReactNode;
  items?: TabsProps['items'];
  style?: React.CSSProperties;
}

const Section: React.FunctionComponent<ISectionProps> = props => {
  const { title, desc, breadcrumb, children, items, style } = props;

  const onChange = (key: string) => {};
  const hasDivider = title && desc && !items;
  return (
    <section style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '12px 24px' }}>
        <Breadcrumb items={breadcrumb} />
        {title && (
          <Typography.Title level={1} style={{ fontSize: 40 }}>
            <FormattedMessage id={title} />
          </Typography.Title>
        )}
        {desc && (
          <Typography.Title type="secondary" level={4} style={{ fontWeight: 300 }}>
            <FormattedMessage id={desc} />
          </Typography.Title>
        )}
      </div>
      {hasDivider && <Divider />}
      {items && (
        <div style={{ padding: '0px 24px' }}>
          <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
        </div>
      )}
      <div
        style={{
          padding: '12px 24px',
          flex: 1,
          ...style,
        }}
      >
        {children}
      </div>
    </section>
  );
};

export default Section;
