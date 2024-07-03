import React, { useState } from 'react';
import { SectionContext, SectionProvider } from './useSection';
import { theme } from 'antd';
const { useToken } = theme;
interface ISectionProps {
  /** 侧边栏 */
  rightSide?: React.ReactNode;
  leftSide?: React.ReactNode;
  defaultStyle?: Partial<{
    leftSideWidth: number;
    rightSideWidth: number;
    leftSideCollapsed: boolean;
    rightSideCollapsed: boolean;
  }>;
  splitBorder?: boolean;

  /** 主要区域 */
  children: React.ReactNode;

  autoResize?: boolean;
  /** antd theme mode */
  themeMode?: string;
  /** 容器根样式 */
  style?: React.CSSProperties;
}

const Section: React.FunctionComponent<ISectionProps> = props => {
  const { rightSide, leftSide, children, defaultStyle, splitBorder, style } = props;
  const { token } = useToken();
  const [state, setState] = useState({
    widthStyle: {
      leftSide: defaultStyle?.leftSideWidth || 320,
      rightSide: defaultStyle?.rightSideWidth || 320,
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
  const borderStyle = splitBorder ? `1px solid ${token.colorBorder}` : 'unset';

  return (
    <SectionProvider value={{ ...state, toggleRightSide, toggleLeftSide }}>
      <div style={{ width: '100%', height: '100%', display: 'flex', ...style }}>
        <div style={{ height: '100%', display: 'flex', width: '100%', overflow: 'hidden' }}>
          {leftSide && (
            <div
              style={{
                borderRight: collapsed.leftSide ? 'unset' : borderStyle,
                width: collapsed.leftSide ? '0px' : widthStyle.leftSide,
                overflow: 'hidden',
                transition: 'width 0.2s ease',
                flexShrink: 0,
              }}
            >
              {leftSide}
            </div>
          )}
          {children && <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>{children}</div>}
          {rightSide && (
            <div
              style={{
                borderLeft: borderStyle,
                width: collapsed.rightSide ? '0px' : widthStyle.rightSide,
                position: 'relative',
                overflow: 'hidden',
                transition: 'width 0.2s ease',
                flexShrink: 0,
              }}
            >
              {rightSide}
            </div>
          )}
        </div>
      </div>
    </SectionProvider>
  );
};

export default Section;
