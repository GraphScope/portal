import React, { useState } from 'react';
import { SectionContext, SectionProvider } from './useSection';

interface ISectionProps {
  /** 侧边栏 */
  rightSide?: React.ReactNode;
  leftSide?: React.ReactNode;
  defaultStyle?: {
    leftSideWidth: number;
    rightSideWidth: number;
    leftSideCollapsed: boolean;
    rightSideCollapsed: boolean;
  };

  /** 主要区域 */
  children: React.ReactNode;

  autoResize?: boolean;
  /** antd theme mode */
  themeMode?: string;
  /** 容器根样式 */
  style?: React.CSSProperties;
}

const Section: React.FunctionComponent<ISectionProps> = props => {
  const { rightSide, leftSide, children, defaultStyle } = props;
  const [state, setState] = useState({
    widthStyle: {
      leftSide: defaultStyle?.leftSideWidth || 350,
      rightSide: defaultStyle?.rightSideWidth || 350,
    },
    collapsed: {
      leftSide: !!defaultStyle?.leftSideCollapsed,
      rightSide: !!defaultStyle?.rightSideCollapsed,
    },
  });
  const toggleLeftSide = () => {
    setState(preState => {
      return {
        ...preState,
        collapsed: {
          ...preState.collapsed,
          leftSide: !preState.collapsed.leftSide,
        },
      };
    });
  };
  const toggleRightSide = () => {
    setState(preState => {
      return {
        ...preState,
        collapsed: {
          ...preState.collapsed,
          rightSide: !preState.collapsed.rightSide,
        },
      };
    });
  };
  const { widthStyle, collapsed } = state;

  return (
    <SectionProvider value={{ ...state, toggleRightSide, toggleLeftSide }}>
      <div style={{ width: '100%', height: '100%' }}>
        <div style={{ height: '100%', display: 'flex' }}>
          <div
            style={{
              width: collapsed.leftSide ? '0px' : widthStyle.leftSide,
              padding: collapsed.leftSide ? '0px' : '0px 12px',
              overflow: 'hidden',
              transition: 'width 0.2s ease',
            }}
          >
            {leftSide}
          </div>
          <div style={{ flex: 1, position: 'relative' }}>{children}</div>
          <div
            style={{
              width: collapsed.rightSide ? '0px' : widthStyle.rightSide,
              padding: collapsed.rightSide ? '0px' : '0px 12px',
              position: 'relative',
              overflow: 'hidden',
              transition: 'width 0.2s ease',
            }}
          >
            {rightSide}
          </div>
        </div>
      </div>
    </SectionProvider>
  );
};

export default Section;
