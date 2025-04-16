import React, { useMemo, useCallback } from 'react';
import { CaretRightOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Collapse, theme, Flex, Typography, Space, Tooltip } from 'antd';
import type { CollapseProps } from 'antd';
import { useDynamicStyle } from '../hooks/useDynamicStyle';

/**
 * CollapseCard 组件的属性接口
 */
export interface ICollapseCardProps {
  /** 是否显示边框 */
  bordered?: boolean;
  /** 是否透明背景 */
  ghost?: boolean;
  /** 卡片标题 */
  title: React.ReactNode;
  /** 卡片内容 */
  children: React.ReactNode;
  /** 默认是否折叠 */
  defaultCollapse?: boolean;
  /** 提示信息 */
  tooltip?: React.ReactNode;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 自定义类名 */
  className?: string;
  /** 展开/收起时的回调 */
  onChange?: (isActive: boolean) => void;
}

/**
 * 可折叠卡片组件
 * @description 一个可折叠的卡片组件，支持自定义标题、内容和样式
 */
const CollapseCard: React.FC<ICollapseCardProps> = ({
  bordered = false,
  ghost = true,
  children,
  title,
  defaultCollapse = false,
  tooltip,
  style = {},
  className = '',
  onChange,
}) => {
  const { token } = theme.useToken();
  const id = 'Studio-Collapse-Card';
  const defaultActiveKey = defaultCollapse ? [] : [id];

  // 使用 useMemo 优化样式计算
  const cardStyle = useMemo(
    () => ({
      ...style,
      backgroundColor: token.colorBgContainer,
      borderRadius: token.borderRadiusLG,
      boxShadow: bordered ? token.boxShadowTertiary : 'none',
    }),
    [style, token, bordered],
  );

  // 使用 useMemo 优化标题样式
  const titleStyle = useMemo(
    () => ({
      margin: 0,
      color: token.colorTextHeading,
      fontSize: token.fontSizeLG,
      fontWeight: token.fontWeightStrong,
    }),
    [token],
  );

  // 使用 useMemo 优化图标样式
  const iconStyle = useMemo(
    () => ({
      transition: `transform ${token.motionDurationMid} ease`,
      fontSize: token.fontSizeLG,
    }),
    [token],
  );

  // 动态样式注入
  useDynamicStyle(
    `.${id} .ant-collapse-header {
      padding: ${token.padding}px !important;
      transition: all ${token.motionDurationMid} ease;
    }
    .${id} .ant-collapse-content-box {
      padding: ${token.padding}px ${token.paddingLG}px !important;
    }
    `,
    id,
  );

  // 使用 useCallback 优化事件处理函数
  const handleChange = useCallback(
    (activeKeys: string | string[]) => {
      const isActive = Array.isArray(activeKeys) ? activeKeys.includes(id) : activeKeys === id;
      onChange?.(isActive);
    },
    [id, onChange],
  );

  // 使用 useCallback 优化展开图标渲染函数
  const renderExpandIcon = useCallback(
    (props: { isActive?: boolean }) => <CaretRightOutlined rotate={props.isActive ? 90 : 0} style={iconStyle} />,
    [iconStyle],
  );

  return (
    <Collapse
      style={cardStyle}
      className={`${id} ${className}`}
      bordered={bordered}
      ghost={ghost}
      expandIconPosition="end"
      defaultActiveKey={defaultActiveKey}
      onChange={handleChange}
      expandIcon={renderExpandIcon}
      items={[
        {
          key: id,
          label: (
            <Space>
              <Typography.Title level={5} style={titleStyle}>
                {title}
              </Typography.Title>
              {tooltip && (
                <Tooltip title={tooltip}>
                  <QuestionCircleOutlined style={{ color: token.colorTextSecondary }} />
                </Tooltip>
              )}
            </Space>
          ),
          children: children,
        },
      ]}
    />
  );
};

export default CollapseCard;
