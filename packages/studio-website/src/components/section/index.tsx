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
        <Typography.Title level={2}>
          <FormattedMessage id={title} />
        </Typography.Title>
        <Typography.Text type="secondary">
          <FormattedMessage id={desc} />
        </Typography.Text>
      </div>
      <Divider />
      <div style={style}>{children}</div>
    </section>
  );
};

export default Section;
