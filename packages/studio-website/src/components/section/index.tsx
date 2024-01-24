import * as React from 'react';
import { Breadcrumb, Divider } from 'antd';
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
  return (
    <section style={{ display: 'flex', flexDirection: 'column' }}>
      <Breadcrumb items={breadcrumb} />
      <h1>
        <FormattedMessage id={title} />
      </h1>
      <p style={{ marginTop: '0px' }}>
        <FormattedMessage id={desc} />
      </p>
      <Divider />
      {children}
    </section>
  );
};

export default Section;
