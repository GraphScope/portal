import * as React from 'react';

import { Space, theme } from 'antd';
interface IToolbarProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  direction?: 'horizontal' | 'vertical';
  noSpace?: boolean;
}

const Toolbar: React.FunctionComponent<IToolbarProps> = props => {
  const { children, style, direction = 'vertical', noSpace } = props;
  const { token } = theme.useToken();
  const _children = noSpace ? children : <Space direction={direction}>{children}</Space>;
  return (
    <div
      style={{
        boxShadow: token.boxShadow,
        borderRadius: token.borderRadius,
        background: token.colorBgContainer,
        display: 'flex',
        flexDirection: 'column',
        position: 'absolute',
        top: '12px',
        left: '24px',
        zIndex: 999,
        padding: '4px',
        ...style,
      }}
    >
      {_children}
    </div>
  );
};

export default Toolbar;
