import React from 'react';
import { Button, theme } from 'antd';

interface IStyledButtonProps {
  url?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const StyledButton: React.FC<IStyledButtonProps> = ({ url, children, style, ...props }) => {
  const { token } = theme.useToken();
  return (
    <Button
      size="large"
      style={{ backgroundColor: token.colorTextBase, color: token.colorBgBase, fontSize: '16px', ...style }}
      {...props}
      onClick={() => {
        window.open(url, '_blank');
      }}
    >
      {children}
    </Button>
  );
};
export default StyledButton;
