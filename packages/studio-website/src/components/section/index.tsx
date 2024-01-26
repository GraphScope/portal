import * as React from 'react';
import { Breadcrumb, Divider, Typography } from 'antd';
import { FormattedMessage } from 'react-intl';
import { BreadcrumbProps } from 'antd';

interface ISectionProps {
  title: string;
  desc: string;
  breadcrumb: BreadcrumbProps['items'];
  children: React.ReactNode;
}

const Section: React.FunctionComponent<ISectionProps> = props => {
  const { title, desc, breadcrumb, children } = props;
  const style = {
    padding: '12px 24px',
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
      <Divider />
      <div style={style}>{children}</div>
    </section>
  );
};

export default Section;
