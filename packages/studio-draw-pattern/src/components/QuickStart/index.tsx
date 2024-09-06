import React from 'react';
import { Preview } from './Preview';
import { QuickStartItem } from './QuickStartItem';
import { RocketOutlined } from '@ant-design/icons';

const quickStartItems = [
  {
    svgSrc: (
      <svg width="71" height="93" viewBox="0 0 71 93" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="35.6904" cy="62.3413" r="29" stroke="black" stroke-width="2" />
        <path
          d="M60.6916 44.8395L70.8028 39.2631L60.9179 33.2947L60.6916 44.8395ZM66.2853 37.4731C67.7414 33.4636 67.4987 29.8569 65.9372 26.7474C64.3913 23.6689 61.6037 21.1766 58.1396 19.249C51.2221 15.3998 41.3293 13.6435 32.0076 14.068C22.7197 14.4908 13.7017 17.0945 8.71468 22.2775C6.18883 24.9026 4.704 28.1872 4.77323 32.1151C4.84194 36.0139 6.43922 40.4447 9.86754 45.4097L11.5133 44.2733C8.22325 39.5085 6.83244 35.4572 6.77292 32.0798C6.7139 28.7314 7.96069 25.9456 10.1559 23.6642C14.6109 19.0342 22.9927 16.4805 32.0986 16.0659C41.1708 15.6528 50.6659 17.3791 57.1671 20.9967C60.4123 22.8025 62.8416 25.0397 64.1499 27.6449C65.4425 30.219 65.6912 33.25 64.4055 36.7905L66.2853 37.4731Z"
          fill="black"
        />
      </svg>
    ),
    title: '自环 Self-Loop',
    id: 'self-loop',
  },
  {
    svgSrc: (
      <svg width="152" height="118" viewBox="0 0 152 118" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="98" r="19" stroke="black" stroke-width="2" />
        <circle cx="76" cy="20" r="19" stroke="black" stroke-width="2" />
        <circle cx="132" cy="98" r="19" stroke="black" stroke-width="2" />
        <path
          d="M56 34L46 39.7735L56 45.547L56 34ZM31.866 77.8013L52.366 42.2942L50.634 41.2942L30.134 76.8013L31.866 77.8013Z"
          fill="black"
        />
        <path
          d="M120.91 79.1451L120.91 67.5981L110.91 73.3716L120.91 79.1451ZM95.134 36.5L115.544 71.8509L117.276 70.8509L96.866 35.5L95.134 36.5Z"
          fill="black"
        />
        <path d="M42.9853 98L52.9853 103.774V92.2265L42.9853 98ZM109.016 97H51.9853V99H109.016V97Z" fill="black" />
      </svg>
    ),
    title: '三角环 Triangle-Loop',
    id: 'triangle-loop',
  },
];

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
      <Preview />
      <div id="items-wrapper" style={{ display: 'flex', flexDirection: 'column', height: '70%', gap: '0.3rem' }}>
        <span style={{ fontSize: '1rem' }}>
          <RocketOutlined />
          快速开始
        </span>
        <div
          style={{
            overflowY: 'scroll',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.6rem',
            scrollbarWidth: 'none', // Firefox 隐藏滚动条
            msOverflowStyle: 'none', // Internet Explorer 和 Edge 隐藏滚动条
          }}
        >
          {quickStartItems.map(item => {
            return <QuickStartItem key={item.id} {...item}></QuickStartItem>;
          })}
        </div>
      </div>
    </div>
  );
};
