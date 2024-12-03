import React, { useState } from 'react';
import { CaretRightOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Collapse, theme, Flex, Typography, Select, Space, Tooltip } from 'antd';
import { useDynamicStyle } from '../hooks/useDynamicStyle';
interface IAdvancedSettingProps {
  bordered?: boolean;
  ghost?: boolean;
  title: React.ReactNode;
  children: React.ReactNode;
  defaultCollapse?: boolean;
  tooltip?: React.ReactNode;
  style?: React.CSSProperties;
}

const CollapseCard: React.FunctionComponent<IAdvancedSettingProps> = props => {
  const { bordered, children, title, defaultCollapse, tooltip, style = {} } = props;
  const id = 'Studio-Collapse-Card';
  const defaultActiveKey = defaultCollapse ? [] : [id];
  useDynamicStyle(
    `.${id} .ant-collapse-header {padding:0px !important;}
    .${id} .ant-collapse-content-box {padding:12px 0px !important;}
    `,
    id,
  );
  return (
    <Collapse
      style={style}
      className={id}
      bordered={bordered}
      ghost
      expandIconPosition="end"
      defaultActiveKey={defaultActiveKey}
      expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
      items={[
        {
          key: id,
          label: (
            <Space>
              <Typography.Title level={5} style={{ margin: '0px' }}>
                {title}
              </Typography.Title>
              {tooltip && (
                <Tooltip title={tooltip}>
                  <QuestionCircleOutlined />
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
