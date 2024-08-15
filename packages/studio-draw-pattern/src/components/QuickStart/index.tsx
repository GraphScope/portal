import React from 'react';
import { Preview } from './Preview';
import { QuickStartItem } from './QuickStartItem';
import { RocketOutlined } from '@ant-design/icons';

export const QuickStart = () => {
  return (
    <div
      id="quick-start-wrapper"
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.8rem',
      }}
    >
      <Preview></Preview>
      <div id="items-wrapper" style={{ display: 'flex', flexDirection: 'column', height: '70%', gap: '0.3rem' }}>
        <span style={{ fontSize: '1rem' }}>
          <RocketOutlined />
          快速开始
        </span>
        <div
          style={{
            overflow: 'scroll',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.6rem',
          }}
        >
          <QuickStartItem></QuickStartItem>
          <QuickStartItem></QuickStartItem>
          <QuickStartItem></QuickStartItem>
          <QuickStartItem></QuickStartItem>
          <QuickStartItem></QuickStartItem>
        </div>
      </div>
    </div>
  );
};
