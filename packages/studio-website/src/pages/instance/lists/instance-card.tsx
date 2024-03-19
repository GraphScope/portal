import React, { useState } from 'react';
import { Flex, Card, Tag, Typography, Space, Button, Divider, Dropdown, Popover, Tooltip } from 'antd';
import type { MenuProps } from 'antd';
import { history } from 'umi';
import dayjs from 'dayjs';
import { useContext } from '@/layouts/useContext';

import { deleteGraph, startService, stopService } from './service';

const { Text, Paragraph } = Typography;
import { MoreOutlined, StarOutlined } from '@ant-design/icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiagramProject, faFileArrowUp, faMagnifyingGlass, faPause } from '@fortawesome/free-solid-svg-icons';
import { faPlayCircle, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { FormattedMessage } from 'react-intl';
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

  /** 运行状态 */
  status: string;
  /** 路由 */
  routes: React.ReactNode;
  /** 操作 */
  actions: React.ReactNode;
  schema: {
    edge_types: any[];
    vertex_types: any[];
  };
  /** server 实例链接 */
  server?: string;
  hqps?: string;
  handleChange: () => void;
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
    hqps,
    handleChange,
    schema = { edge_types: [], vertex_types: [] },
  } = props;
  const { store } = useContext();
  const { mode } = store;
  const [isLoading, updateIsLoading] = useState(false);
  const items: MenuProps['items'] = [
    {
      label: 'delete',
      key: 'delete',
      icon: <FontAwesomeIcon icon={faTrashCan} />,
    },
    // {
    //   label: 'restart',
    //   key: 'restart',
    //   icon: <StarOutlined />,
    // },
  ];

  const handleRestart = () => {};
  const onClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'delete') {
      handleDelete(name);
    }
    if (key === 'restart') {
      handleRestart();
    }
  };

  const currentTime = dayjs();
  // 计算运行时间（以毫秒为单位）
  const uptime = currentTime.diff(updatetime);
  // 将毫秒转换为天、小时和分钟
  const days = Math.floor(uptime / (1000 * 60 * 60 * 24));
  const hours = Math.floor((uptime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));
  // 构建输出字符串
  let uptimeString = '';
  if (days > 0) {
    uptimeString += `${days}day `;
  }
  if (hours > 0) {
    uptimeString += `${hours}hrs `;
  }
  uptimeString += `${minutes}min`;

  let Endpoints: React.ReactNode = (
    <>
      No available services. <br /> Please click the <FontAwesomeIcon icon={faPlayCircle} /> button to start the service
    </>
  );
  if (server) {
    Endpoints = (
      <>
        <Text>Cypher:</Text>
        <Paragraph copyable style={{ display: 'inline-block', marginBottom: '6px' }}>
          {props.server}
        </Paragraph>
      </>
    );
  }
  if (hqps) {
    Endpoints = (
      <>
        {Endpoints} <br /> <Text>HQPS:</Text>
        <Paragraph copyable style={{ display: 'inline-block' }}>
          {hqps}
        </Paragraph>
      </>
    );
  }
  const Statistics = (
    <>
      {schema.edge_types.length} <FormattedMessage id="types of Edges" /> <br /> {schema.vertex_types.length}{' '}
      <FormattedMessage id="types of Vertices" />
    </>
  );

  /** 删除graph */
  const handleDelete = async (name: string) => {
    await deleteGraph(name);
    handleChange && handleChange();
  };

  const handleClick = async (name: string, status: string) => {
    updateIsLoading(true);
    /** running->stopService */
    if (status === 'running') {
      await stopService(name);
    }
    /** stoped->startService */
    if (status === 'stopped') {
      await startService(name);
    }
    updateIsLoading(false);
    handleChange && handleChange();
  };
  /** Start|Pause 提示 */
  let tooltipContext;
  if (status == 'stopped') tooltipContext = <FormattedMessage id="Start Service" />;
  if (status == 'running') tooltipContext = <FormattedMessage id="Pause Service" />;
  /** Start|Pause icon */
  let btnIcon;
  if (status == 'stopped') btnIcon = faPlayCircle;
  if (status == 'running') btnIcon = faPause;
  return (
    <Card
      headStyle={{ fontSize: '30px' }}
      title={name}
      style={{ background: mode === 'defaultAlgorithm' ? '#FCFCFC' : '' }}
      extra={
        <Space>
          <Tooltip title={tooltipContext}>
            <Button
              type="text"
              icon={<FontAwesomeIcon icon={btnIcon} />}
              loading={isLoading}
              onClick={() => {
                handleClick(name, status);
              }}
            />
          </Tooltip>
          <Dropdown menu={{ items, onClick }}>
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      }
    >
      <Flex justify="space-between">
        <Flex align="flex-start" vertical gap="middle">
          <Tag style={{ fontSize: '16px', lineHeight: '140%' }} color={STATUS_COLOR_MAP[status]}>
            <FormattedMessage id={status} />
          </Tag>
          <Space direction="vertical" size={0}>
            <Text type="secondary">
              <FormattedMessage id="Uptime" />: {uptimeString}
            </Text>
            <Text type="secondary">
              <FormattedMessage id="Last data import" />: {importtime}
            </Text>
            <Text type="secondary">
              <FormattedMessage id="Served from" />: {createtime}
            </Text>
            <Text type="secondary">
              <FormattedMessage id="Created on" />: {createtime}
            </Text>
          </Space>
          <Space split={<Divider type="vertical" />} size={0}>
            <Typography.Text type="secondary" style={{ cursor: 'pointer' }} disabled={!Endpoints}>
              <Popover title={<FormattedMessage id="Endpoints" />} content={Endpoints}>
                <FormattedMessage id="Endpoints" /> <QuestionCircleOutlined style={{ marginLeft: '4px' }} />
              </Popover>
            </Typography.Text>

            <Typography.Text type="secondary" style={{ cursor: 'pointer' }}>
              <Popover title={<FormattedMessage id="Graph Schema" />} content={Statistics}>
                <span>
                  <FormattedMessage id="Statistics" />
                </span>
              </Popover>
            </Typography.Text>
            {/* <Typography.Text type="secondary">Logs</Typography.Text> */}
          </Space>
        </Flex>
        {/* <Flex justify="space-between" vertical align="end"> */}
        <Flex gap="middle" align="flex-end" vertical justify="end">
          <Button
            style={{ width: '150px', textAlign: 'left' }}
            icon={<FontAwesomeIcon icon={faDiagramProject} style={{ marginRight: '4px' }} />}
            onClick={() => history.push(`/instance/view-schema#?graph_name=${name}`)}
          >
            <FormattedMessage id="Define Schema" />
          </Button>
          <Button
            style={{ width: '150px', textAlign: 'left' }}
            icon={<FontAwesomeIcon icon={faFileArrowUp} style={{ marginLeft: '2px', marginRight: '4px' }} />}
            onClick={() => history.push(`/instance/import-data#?engineType=interactive&graph_name=${name}`)}
          >
            <FormattedMessage id="Import Data" />
          </Button>
          <Button
            type="primary"
            style={{ width: '150px', textAlign: 'left' }}
            icon={<FontAwesomeIcon icon={faMagnifyingGlass} style={{ marginRight: '4px' }} />}
            disabled={status === 'stopped' ? true : false}
            onClick={() => history.push(`/query-app#?graph_name=${name}`)}
          >
            <FormattedMessage id="Query Graph" />
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
