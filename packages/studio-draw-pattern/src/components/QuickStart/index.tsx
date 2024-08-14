import React from 'react';
import { Preview } from './Preview';
import { QuickStartItem } from './QuickStartItem';

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
      <div id="items-wrapper" style={{ display: 'flex', flexDirection: 'column', height: '70%' }}>
        <span style={{ fontSize: '1.2rem', marginLeft: '1rem' }}>快速开始</span>
        <div
          style={{
            overflow: 'scroll',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.6rem',
            padding: '1rem',
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
