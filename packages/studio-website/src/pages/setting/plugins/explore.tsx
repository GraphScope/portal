import * as React from 'react';
import { Typography, Tooltip, Switch, Input, Flex, Space, Card } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { togglePlugin } from '../../explore/slot';
export const PLUGIN_ID = 'EXPLORE';
export const PLUGIN_LOCAL_STORAGE_KEY = `PORTAL_PLUGIN_${PLUGIN_ID}`;

const ExplorePlugin = () => {
  const defaultChecked = togglePlugin();
  const onChange = (checked: boolean) => {
    togglePlugin(checked);
    window.location.reload();
  };

  return (
    <Flex gap={32} vertical>
      <Flex vertical gap={12} flex={1}>
        <Space>
          <Typography.Title level={5}>Explore</Typography.Title>
          <Tooltip title={`Explor is a tool that allows you to explore the graph data in a more visual way.`}>
            <QuestionCircleOutlined />
          </Tooltip>
        </Space>

        <Typography.Text type="secondary">
          Explor is a tool that allows you to explore the graph data in a more visual way.
        </Typography.Text>
        <Space>
          Enable:
          <Switch defaultChecked={defaultChecked} onChange={onChange} />
        </Space>
      </Flex>
    </Flex>
  );
};

export default ExplorePlugin;
