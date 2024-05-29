import React, { useState, useEffect } from 'react';
import { ContainerProvider } from './useContainer';

import { debounce } from '../Utils';
interface ContainerProps {
  /** 侧边栏 */
  side: React.ReactNode;
  sideWidth?: number;
  sideCollapsedWidth?: number;
  sideStyle?: React.CSSProperties;
  /** 主要区域 */
  children: React.ReactNode;
  childrenStyle?: React.CSSProperties;
  childrenWidth?: number;

  autoResize?: boolean;
  footer?: React.ReactNode;
  footerStyle?: React.CSSProperties;

  /** antd theme mode */
  themeMode?: string;
  /** 容器根样式 */
  style?: React.CSSProperties;
}

export function calculateContainerWidth() {
  const screenWidth = window.innerWidth;

  // 根据屏幕宽度设定不同的容器宽度
  if (screenWidth < 860) {
    return 860;
  } else if (screenWidth < 1060) {
    return 1060;
  } else if (screenWidth < 1260) {
    return 1260;
  } else if (screenWidth < 1460) {
    return 1460;
  } else if (screenWidth < 1660) {
    return 1660;
  } else {
    return 1860;
  }
}

const Container: React.FunctionComponent<ContainerProps> = props => {
  const {
    side,
    sideWidth = 150,
    sideCollapsedWidth = 60,
    children,
    footer,
    themeMode = 'defaultAlgorithm',
    sideStyle,
    footerStyle,
    style,
    childrenStyle,
    autoResize,
  } = props;
  const [state, setState] = useState({
    width: calculateContainerWidth(),
    collapsed: false,
  });
  const { width, collapsed } = state;
  /** add event listener for width change */
  useEffect(() => {
    if (!autoResize) {
      return;
    }
    const handleResize = debounce(() => {
      setState(preState => {
        return {
          ...preState,
          width: calculateContainerWidth(),
        };
      });
    }, 200);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [autoResize]);
  const toggleSidebar = () => {
    setState(preState => {
      return {
        ...preState,
        collapsed: !preState.collapsed,
      };
    });
  };

  return (
    <ContainerProvider value={{ ...state, toggleSidebar }}>
      <div
        style={{
          background: themeMode === 'defaultAlgorithm' ? '#f5f7f9' : '#020202',
          display: 'flex',
          alignItems: 'center',
          height: '100%',
          boxSizing: 'border-box',
          overflowY: 'scroll',
          ...style,
        }}
      >
        <div
          style={{
            boxSizing: 'border-box',
            width: `${width}px`,
            transition: 'all 0.3s ease',
            height: '100%',
            margin: 'auto',
            display: 'flex',
            padding: '24px',
            flexShrink: 0,
            flexWrap: 'nowrap',
          }}
        >
          <div
            style={{
              width: collapsed ? `${sideCollapsedWidth}px` : `${sideWidth}px`,
              transition: 'all 0.3s ease',
              boxSizing: 'border-box',
              overflow: 'hidden',
              flexWrap: 'nowrap',
              // position: 'fixed',
              top: '24px',
              bottom: '0px',
              ...sideStyle,
            }}
          >
            {side}
          </div>
          <div
            style={{
              flex: 1,
              boxSizing: 'border-box',
              marginLeft: collapsed ? '80px' : `${sideWidth + 24}px`,
              display: 'flex',
              flexDirection: 'column',
              // overflow: 'scroll',
              flexWrap: 'nowrap',
              transition: 'all 0.3s ease',
            }}
          >
            <div
              style={{
                boxSizing: 'border-box',
                flex: 1,
                background: themeMode === 'defaultAlgorithm' ? '#fff' : '#161616',
                borderRadius: '12px',
                position: 'relative',
                ...childrenStyle,
              }}
            >
              {children}
            </div>
            {footer && (
              <div
                style={{
                  padding: '6px 6px',
                  fontSize: '12px',
                  color: '#ddd',
                  ...footerStyle,
                }}
              >
                {footer}
              </div>
            )}
          </div>
        </div>
      </div>
    </ContainerProvider>
  );
};

export default Container;
