import * as React from 'react';
import { Space, Typography, Divider } from 'antd';

interface IFooterProps {}

const Footer: React.FunctionComponent<IFooterProps> = props => {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: '-40px',
        padding: '12px',
        fontSize: '12px',
        right: '0px',
        left: '0px',
        display: 'flex',
        justifyContent: 'space-between',
        justifyItems: 'center',
        color: '#ddd',
      }}
    >
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
