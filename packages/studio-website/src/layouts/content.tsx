import * as React from 'react';
import Footer from './footer';

interface IContentProps {
  children: React.ReactNode;
}

const CONTENT_WIDTH = 1024;
const SIDE_WIDTH = 200;
const Content: React.FunctionComponent<IContentProps> = props => {
  const { children } = props;
  const padding = '20px';
  const left = `calc(50% - ${(CONTENT_WIDTH - SIDE_WIDTH) / 2}px)`;

  return (
    <div
      style={{
        position: 'absolute',
        padding: '12px',
        top: padding,
        left: left,
        right: padding,
        bottom: '40px',
        background: '#fff',
        borderRadius: '8px',
        width: '1024px',
      }}
    >
      {children}
    </div>
  );
};

export default Content;
