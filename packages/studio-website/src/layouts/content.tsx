import * as React from 'react';
import Footer from './footer';
import { useContext } from './useContext';
import { SideWidth } from './sidebar';
interface IContentProps {
  children: React.ReactNode;
}

// const CONTENT_WIDTH = 1024;
// const SIDE_WIDTH = 200;
const Content: React.FunctionComponent<IContentProps> = props => {
  const { children } = props;
  const { store } = useContext();
  const { collapse } = store;
  const padding = '24px';
  // const left = `calc(50% - ${(CONTENT_WIDTH - SIDE_WIDTH) / 2}px)`;

  return (
    <div
      style={{
        // position: 'absolute',
        // top: padding,
        // left: collapse ? `${80 + 24}px` : `${SideWidth + 24}px`,
        // right: padding,
        // bottom: '40px',
        background: '#fff',
        borderRadius: '8px',
        margin: '30px',
        // width: '1024px',
      }}
    >
      {children}
    </div>
  );
};

export default Content;
