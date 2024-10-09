import * as React from 'react';
import { Space } from 'antd';
interface IToolbarProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  direction?: 'horizontal' | 'vertical';
  noSpace?: boolean;
}

const Toolbar: React.FunctionComponent<IToolbarProps> = props => {
  const { children, style, direction = 'vertical', noSpace } = props;
  const _children = noSpace ? children : <Space direction={direction}>{children}</Space>;
  return (
    <div
      style={{
        boxShadow:
          '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        position: 'absolute',
        top: '12px',
        left: '24px',
        zIndex: 999,
        padding: '4px',
        borderRadius: '4px',
        // background: '#fff',
        ...style,
      }}
    >
      {_children}
    </div>
  );
};

export default Toolbar;
