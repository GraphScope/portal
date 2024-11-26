import React from 'react';
import { Button } from 'antd';

interface IStyledButtonProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const StyledButton: React.FC<IStyledButtonProps> = ({ children, style, ...props }) => (
  <Button size="large" style={{ backgroundColor: '#000', color: '#fff', fontSize: '16px', ...style }} {...props}>
    {children}
  </Button>
);
export default StyledButton;
