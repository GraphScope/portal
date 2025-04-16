import * as React from 'react';
import { Space, theme } from 'antd';

/**
 * Toolbar 组件的属性接口
 */
export interface IToolbarProps {
  /** 工具栏内容 */
  children: React.ReactNode;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 排列方向 */
  direction?: 'horizontal' | 'vertical';
  /** 是否禁用间距 */
  noSpace?: boolean;
  /** 工具栏位置 */
  position?: {
    top?: string | number;
    left?: string | number;
    right?: string | number;
    bottom?: string | number;
  };
  /** 是否显示阴影 */
  shadow?: boolean;
  /** 是否显示背景色 */
  background?: boolean;
  /** 是否显示圆角 */
  rounded?: boolean;
  /** 内边距 */
  padding?: string | number;
}

/**
 * 工具栏组件
 * @description 一个可自定义的工具栏组件，支持水平和垂直排列，可配置位置、样式等
 */
const Toolbar: React.FC<IToolbarProps> = ({
  children,
  style,
  direction = 'vertical',
  noSpace = false,
  position = { top: '12px', left: '24px' },
  shadow = true,
  background = true,
  rounded = true,
  padding = '4px',
}) => {
  const { token } = theme.useToken();

  const containerStyle: React.CSSProperties = {
    boxShadow: shadow ? token.boxShadow : 'none',
    borderRadius: rounded ? token.borderRadius : 0,
    background: background ? token.colorBgContainer : 'transparent',
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    top: position.top,
    left: position.left,
    right: position.right,
    bottom: position.bottom,
    zIndex: 999,
    padding,
    ...style,
  };

  return <div style={containerStyle}>{noSpace ? children : <Space direction={direction}>{children}</Space>}</div>;
};

export default Toolbar;
