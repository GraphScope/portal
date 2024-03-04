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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDiagramProject,
  faFileArrowUp,
  faMagnifyingGlass,
  faPlayCircle,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';

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
  /** events */
  handleDelete: (name: string) => void;
  handleStart: (name: string) => void;
};

const styles: React.CSSProperties = {
  margin: '0px',
  color: '#404A54',
};
const STATUS_COLOR_MAP: Record<string, string> = {
  stopped: 'red',
  running: 'green',
  undefined: 'green',
};

const InstaceCard: React.FC<InstaceCardType> = props => {
  const {
    updatetime,
    importtime,
    version,
    createtime,
    server,
    routes,
    actions,
    status,
    name,
    handleDelete,
    handleStart,
  } = props;
  const items: MenuProps['items'] = [
    {
      label: 'delete',
      key: 'delete',
      icon: <FontAwesomeIcon icon={faTrash} />,
    },
    {
      label: 'restart',
      key: 'restart',
      icon: <StarOutlined />,
    },
  ];

  const handleRestart = () => {};
  const onClick: MenuProps['onClick'] = ({ key }) => {
    console.log('key', key, name);
    if (key === 'delete') {
      handleDelete(name);
    }
    if (key === 'restart') {
      handleRestart();
    }
  };

  return (
    <Card
      headStyle={{ fontSize: '30px' }}
      title={name}
      style={{ background: '#FCFCFC' }}
      extra={
        <Space>
          <Button
            type="text"
            icon={<FontAwesomeIcon icon={faPlayCircle} />}
            onClick={() => {
              handleStart(name);
            }}
          />
          {/* <Button type="text" icon={<DeleteOutlined />} /> */}
          <Dropdown menu={{ items, onClick }}>
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      }
    >
      <Flex justify="space-between">
        <Flex align="flex-start" vertical gap="middle">
          <Tag color={STATUS_COLOR_MAP[status]}>{status}</Tag>
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
          <Button
            style={{ width: '150px', textAlign: 'left' }}
            icon={<FontAwesomeIcon icon={faDiagramProject} />}
            onClick={() => history.push(`/instance/view-schema#?graph_name=${name}`)}
          >
            Define Schema
          </Button>
          <Button
            style={{ width: '150px', textAlign: 'left' }}
            icon={<FontAwesomeIcon icon={faFileArrowUp} style={{ marginLeft: '2px', marginRight: '4px' }} />}
            onClick={() => history.push(`/instance/import-data#?engineType=interactive&graph_name=${name}`)}
          >
            Import Data
          </Button>
          <Button
            type="primary"
            style={{ width: '150px', textAlign: 'left' }}
            icon={<FontAwesomeIcon icon={faMagnifyingGlass} />}
            disabled={status === 'stopped' ? true : false}
            onClick={() => history.push(`/query-app#?graph_name=${name}`)}
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
