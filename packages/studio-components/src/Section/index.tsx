import React, { useState, forwardRef, LegacyRef } from 'react';
import { SectionContext, SectionProvider } from './useSection';
import { theme } from 'antd';
const { useToken } = theme;
interface ISectionProps {
  /** 侧边栏 */
  style?: React.CSSProperties;
  rightSide?: React.ReactNode;
  leftSide?: React.ReactNode;
  // defaultStyle?: Partial<{
  //   leftSideWidth: number;
  //   rightSideWidth: number;
  //   leftSideCollapsed: boolean;
  //   rightSideCollapsed: boolean;
  // }>;
  rightSideStyle?: React.CSSProperties;
  leftSideStyle?: React.CSSProperties;

  defaultCollapsed?: Partial<{
    leftSide: boolean;
    rightSide: boolean;
  }>;
  splitBorder?: boolean;

  /** 主要区域 */
  children: React.ReactNode;

  autoResize?: boolean;
  /** antd theme mode */
  themeMode?: string;
  revert?: boolean;
}

const getStyles = (props, collapsed: { leftSide: boolean; rightSide: boolean }, token) => {
  const dafaultWidth = '300px';
  const dafaultPadding = '0px 12px';
  const { splitBorder, leftSideStyle = {}, rightSideStyle = {} } = props;
  const borderStyle = splitBorder ? `1px solid ${token.colorBorder}` : 'unset';

  return {
    leftSideStyle: {
      ...leftSideStyle,
      borderRight: collapsed.leftSide ? 'unset' : borderStyle,
      width: collapsed.leftSide ? '0px' : leftSideStyle.width || dafaultWidth,
      padding: collapsed.leftSide ? '0px' : leftSideStyle.padding || dafaultPadding,
      overflow: 'hidden',
      transition: 'all 0.2s ease',
      boxSizing: 'border-box',
      opacity: collapsed.leftSide ? 0 : 1,
      flexShrink: 0,
    },
    rightSideStyle: {
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.2s ease',
      opacity: collapsed.rightSide ? 0 : 1,
      flexShrink: 0,
      ...rightSideStyle,
      borderLeft: borderStyle,
      width: collapsed.rightSide ? '0px' : rightSideStyle.width || dafaultWidth,
      padding: collapsed.rightSide ? '0px' : rightSideStyle.padding || dafaultPadding,
    },
  };
};
const Section = forwardRef((props: ISectionProps, ref: LegacyRef<HTMLDivElement>) => {
  console.log('ref', ref);
  const { rightSide, leftSide, children, splitBorder, defaultCollapsed, style, revert } = props;
  const { token } = useToken();
  const [state, setState] = useState({
    collapsed: {
      leftSide: !!defaultCollapsed?.leftSide,
      rightSide: !!defaultCollapsed?.rightSide,
    },
  });
  const toggleLeftSide = value => {
    setState(preState => {
      return {
        ...preState,
        collapsed: {
          ...preState.collapsed,
          leftSide: value === undefined ? !preState.collapsed.leftSide : value,
        },
      };
    });
  };
  const toggleRightSide = value => {
    setState(preState => {
      return {
        ...preState,
        collapsed: {
          ...preState.collapsed,
          rightSide: value === undefined ? !preState.collapsed.rightSide : value,
        },
      };
    });
  };

  const { collapsed } = state;
  const { rightSideStyle, leftSideStyle } = getStyles(props, collapsed, token);
  const _rightSide = revert ? leftSide : rightSide;
  const _leftSide = revert ? rightSide : leftSide;

  return (
    <SectionProvider value={{ collapsed, toggleRightSide, toggleLeftSide }}>
      <div style={{ width: '100%', height: '100%', display: 'flex', ...style }} ref={ref}>
        <div style={{ height: '100%', display: 'flex', width: '100%', overflow: 'hidden' }}>
          {leftSide && <div style={leftSideStyle}>{_leftSide}</div>}
          {children && <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>{children}</div>}
          {rightSide && <div style={rightSideStyle}>{_rightSide}</div>}
        </div>
      </div>
    </SectionProvider>
  );
});

export default Section;
