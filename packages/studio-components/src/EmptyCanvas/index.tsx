import React from 'react';
import { Typography, theme, Flex } from 'antd';
import Image from './image';

/**
 * EmptyCanvas 组件的属性接口
 */
export interface IEmptyCanvasProps {
  /** 空状态描述文本 */
  description?: string | React.ReactNode;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 自定义类名 */
  className?: string;
  /** 图片大小，可以是数字或百分比 */
  imageSize?: number | string;
}

/**
 * 空画布组件
 * @description 用于展示空状态的组件，支持自定义描述文本和样式
 */
const EmptyCanvas: React.FC<IEmptyCanvasProps> = ({
  description = '暂无数据',
  style = {},
  className = '',
  imageSize = '60%',
}) => {
  const { token } = theme.useToken();

  return (
    <Flex
      vertical
      align="center"
      justify="center"
      style={{
        fontSize: token.fontSize,
        height: '100%',
        width: '100%',
        position: 'relative',
        ...style,
      }}
      className={className}
    >
      <Image
        style={{
          position: 'relative',
          width: imageSize,
          height: 'auto',
          maxWidth: '100%',
          marginBottom: token.marginMD,
        }}
      />
      <Typography.Text
        type="secondary"
        style={{
          textAlign: 'center',
          width: '100%',
        }}
      >
        {description}
      </Typography.Text>
    </Flex>
  );
};

export default EmptyCanvas;
