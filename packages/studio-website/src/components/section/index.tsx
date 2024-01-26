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
}

const Section: React.FunctionComponent<ISectionProps> = props => {
  const { title, desc, breadcrumb, children, items } = props;
  const style = {
    padding: '12px 24px',
  };
  const onChange = (key: string) => {
    console.log(key);
  };
  return (
    <section style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={style}>
        <Breadcrumb items={breadcrumb} />
        <Typography.Title level={1} style={{ fontSize: 40 }}>
          <FormattedMessage id={title} />
        </Typography.Title>
        <Typography.Title type="secondary" level={4} style={{ fontWeight: 300 }}>
          <FormattedMessage id={desc} />
        </Typography.Title>
      </div>
      {!items && <Divider />}
      {items && (
        <div style={{ padding: '0px 24px' }}>
          <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
        </div>
      )}

      <div style={style}>{children}</div>
    </section>
  );
};

export default Section;
