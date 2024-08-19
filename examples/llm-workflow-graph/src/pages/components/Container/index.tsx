import * as React from 'react';
import CreateHeaderPortal from '../CreateHeaderPortal';
import { Breadcrumb, BreadcrumbProps } from 'antd';
interface IContainerProps {
  breadcrumb: BreadcrumbProps['items'];
  children: React.ReactNode;
}

const Container: React.FunctionComponent<IContainerProps> = props => {
  const { breadcrumb, children } = props;
  return (
    <div style={{ boxSizing: 'border-box', padding: '20px', height: 'calc(100% - 50px)', background: '#fff' }}>
      <CreateHeaderPortal>
        <Breadcrumb items={breadcrumb} />
      </CreateHeaderPortal>
      {children}
    </div>
  );
};

export default Container;
