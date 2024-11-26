import React from 'react';
import { Flex } from 'antd';

const Section: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ padding: '100px 200px', ...style }}>
    <Flex vertical justify="center" align="center" gap={12}>
      {children}
    </Flex>
  </div>
);

export default Section;
