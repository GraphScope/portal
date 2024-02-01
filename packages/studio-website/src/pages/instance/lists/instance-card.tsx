import React from 'react';
import { Flex, Card, Tag, Typography, Space, Button, Divider, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { history } from 'umi';
const { Text, Link } = Typography;
import {
  DeploymentUnitOutlined,
  SearchOutlined,
  MoreOutlined,
  PlusOutlined,
  PlayCircleOutlined,
  DeleteOutlined,
  StarOutlined,
} from '@ant-design/icons';

export type InstaceCardType = {
  /** graph name */
  name: string;
  /** version 版本号 */
  version: string;
  /** createtime 创建时间 */
  createtime: string;
  /** createtime 创建时间 */
  updatetime: string;
  /** createtime 创建时间 */
  importtime: string;
  /** server 实例链接 */
  server: string;
  /** 运行状态 */
  status: string;
  /** 路由 */
  routes: React.ReactNode;
  /** 操作 */
  actions: React.ReactNode;
};

const styles: React.CSSProperties = {
  margin: '0px',
  color: '#404A54',
};
const InstaceCard: React.FC<InstaceCardType> = props => {
  const { updatetime, importtime, version, createtime, server, routes, actions, status, name } = props;
  const items: MenuProps['items'] = [
    {
      label: 'delete',
      key: 'delete',
      icon: <DeleteOutlined />,
    },
    {
      label: 'restart',
      key: 'delete',
      icon: <StarOutlined />,
    },
  ];
  return (
    <Card
      headStyle={{ fontSize: '30px' }}
      title={name}
      style={{ background: '#FCFCFC' }}
      extra={
        <Space>
          <Button type="text" icon={<PlayCircleOutlined />} />
          {/* <Button type="text" icon={<DeleteOutlined />} /> */}
          <Dropdown menu={{ items }}>
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      }
    >
      <Flex justify="space-between">
        <Flex align="flex-start" vertical gap="middle">
          <Tag color="green">{status}</Tag>
          <Space direction="vertical" size={0}>
            <Text type="secondary">Uptime: {updatetime}</Text>
            <Text type="secondary">Last data import: {importtime}</Text>
            <Text type="secondary">Server from: {server}</Text>
            <Text type="secondary">Created on：{createtime} </Text>
          </Space>
          <Space split={<Divider type="vertical" />} size={0}>
            <Typography.Text type="secondary">Endpoints</Typography.Text>
            <Typography.Text type="secondary">Statistics</Typography.Text>
            <Typography.Text type="secondary">Logs</Typography.Text>
          </Space>
        </Flex>
        {/* <Flex justify="space-between" vertical align="end"> */}
        <Flex gap="middle" align="flex-end" vertical justify="end">
          <Button style={{ width: '150px' }} icon={<DeploymentUnitOutlined />}>
            Define Schema
          </Button>
          <Button
            style={{ width: '150px' }}
            icon={<DeploymentUnitOutlined />}
            onClick={() => history.push('/instance/import-data?engineType=groot&graph=movie')}
          >
            Import Data
          </Button>
          <Button
            style={{ width: '150px' }}
            icon={<SearchOutlined />}
            onClick={() => history.push(`/query?graph=movie`)}
          >
            Query Graph
          </Button>
        </Flex>
        {/* <Flex wrap="wrap" align="end">
            <Button type="text" icon={<PlayCircleOutlined />} />
            <Button type="text" icon={<DeleteOutlined />} />
            <Button type="text" icon={<MoreOutlined />} />
          </Flex> */}
      </Flex>
      {/* </Flex> */}
    </Card>
  );
};

export default InstaceCard;
