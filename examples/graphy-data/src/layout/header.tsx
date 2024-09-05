import * as React from 'react';
import { theme } from 'antd';
const { useToken } = theme;

interface IHeaderProps {
  children: React.ReactNode;
  style: React.CSSProperties;
}

const Header: React.FunctionComponent<IHeaderProps> = props => {
  const { children, style } = props;
  const { token } = useToken();

  return (
    <div style={{ height: '50px', lineHeight: '50px', borderBottom: `1px solid ${token.colorBorder}`, ...style }}>
      {children}
    </div>
  );
};

export default Header;
