import * as React from 'react';
import { Space, Typography, Divider } from 'antd';

interface IFooterProps {}

const Footer: React.FunctionComponent<IFooterProps> = props => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', justifyItems: 'center' }}>
      <Space split={<Divider type="vertical" />}>
        <span>docs</span>
        <span>website</span>
        <span>github</span>
      </Space>
      <div> Copyright 2024@ Alibaba</div>
    </div>
  );
};

export default Footer;
