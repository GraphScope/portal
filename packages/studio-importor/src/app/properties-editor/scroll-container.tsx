import React, { useRef, useEffect } from 'react';

export interface IScrollContainer {
  currentId: string;
  items: {
    [key: string]: {
      index: number;
    };
  };
  children: React.ReactNode;
}

let IS_SCROLL = true;

export const disableScroll = () => {
  IS_SCROLL = false;
};
export const enableScroll = () => {
  IS_SCROLL = true;
};

const ScrollContainer = (props: IScrollContainer) => {
  const { children, currentId, items } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (IS_SCROLL) {
      const containerDOM = containerRef.current;
      const currentItem = items[currentId];
      if (containerDOM && currentItem) {
        const panelHeight = 47;
        const scrollHeight = currentItem.index * panelHeight;
        containerDOM.scrollTo({ top: scrollHeight, behavior: 'smooth' });
      }
    }
    enableScroll();
  }, [currentId]);
  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: '65px',
        bottom: '0px',
        left: 0,
        right: 0,
        overflow: 'scroll',
        padding: '0px 10px 0px 10px',
      }}
    >
      {children}
    </div>
  );
};

export default ScrollContainer;
