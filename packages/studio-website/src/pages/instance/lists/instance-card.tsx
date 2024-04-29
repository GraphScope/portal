import React, { useState } from 'react';
import { Flex, Card, Tag, Typography, Space, Button, Divider, Dropdown, Popover, Tooltip, notification } from 'antd';
import type { MenuProps } from 'antd';
import { history } from 'umi';
import dayjs from 'dayjs';
import { PauseCircleOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { useContext } from '@/layouts/useContext';

import { deleteGraph, startService, stopService, getDataloadingConfig } from './service';

const { Text, Paragraph } = Typography;
import { MoreOutlined } from '@ant-design/icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faFileImport, faNetworkWired } from '@fortawesome/free-solid-svg-icons';
import { faPlayCircle, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { FormattedMessage, useIntl } from 'react-intl';
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
    edges: number;
    vertices: number;
  };
  /** server 实例链接 */
  server?: string;
  hqps?: string;
  handleChange: () => void;
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
    createtime,
    server,
    status,
    name,
    hqps,
    handleChange,
    schema = { edges: 0, vertices: 0 },
  } = props;
  const { store } = useContext();
  const { mode, locale } = store;
  const intl = useIntl();
  const [isLoading, updateIsLoading] = useState(false);
  const items: MenuProps['items'] = [
    {
      label: <FormattedMessage id="delete" />,
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
  /** 删除graph */
  const handleDelete = async (name: string) => {
    await deleteGraph(name);
    handleChange();
  };
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
  const uptimeString = (
    <>
      {days > 0 && (
        <span style={{ marginRight: '5px' }}>
          {days}
          <FormattedMessage id="day" />
        </span>
      )}
      {hours > 0 && (
        <span style={{ marginRight: '5px' }}>
          {hours}
          <FormattedMessage id="hrs" />
        </span>
      )}
      {minutes}
      <FormattedMessage id="min" />
    </>
  );

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
      <FormattedMessage
        id="{vertices} types of vertices {br} {edges} types of edges"
        values={{
          vertices: schema.vertices,
          edges: schema.edges,
          br: <br />,
        }}
      />
    </>
  );

  const handleClick = async (name: string, status: string) => {
    const config = await getDataloadingConfig(name);
    if (Object.keys(config).length === 0 && config.constructor === Object) {
      notification.error({
        message: intl.formatMessage({ id: 'You can restart the service after importing the data' }),
      });
    } else {
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
      handleChange();
    }
  };
  /** Start|Pause 提示 */
  let tooltipContext;
  if (status === 'stopped') tooltipContext = <FormattedMessage id="Start graph service" />;
  if (status === 'running') tooltipContext = <FormattedMessage id="Pause graph service" />;
  /** Start|Pause icon */
  let btnIcon;
  if (status === 'stopped') btnIcon = <PlayCircleOutlined />;
  if (status === 'running') btnIcon = <PauseCircleOutlined />;
  /** 按钮中英文宽度 */
  let btnWidth = locale === 'zh-CN' ? '115px' : '150px';
  return (
    <Card
      styles={{ header: { fontSize: '30px' } }}
      title={name}
      style={{ background: mode === 'defaultAlgorithm' ? '#FCFCFC' : '' }}
      extra={
        <Space>
          <Tooltip title={tooltipContext}>
            <Button
              type="text"
              icon={btnIcon}
              loading={isLoading}
              onClick={() => {
                handleClick(name, status);
              }}
            />
          </Tooltip>
          {window.GS_ENGINE_TYPE === 'interactive' && (
            <Dropdown menu={{ items, onClick }}>
              <Button type="text" icon={<MoreOutlined />} />
            </Dropdown>
          )}
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
              <Popover title={<FormattedMessage id="Graph schema" />} content={Statistics}>
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
            style={{ width: btnWidth, textAlign: 'left' }}
            icon={<FontAwesomeIcon icon={faNetworkWired} style={{ marginRight: '8px' }} />}
            onClick={() => history.push(`/instance/view-schema#?graph_name=${name}`)}
          >
            <FormattedMessage id="Define schema" />
          </Button>
          <Button
            style={{ width: btnWidth, textAlign: 'left' }}
            icon={<FontAwesomeIcon icon={faFileImport} style={{ marginRight: '10px' }} />}
            onClick={() => history.push(`/instance/import-data#?engineType=interactive&graph_name=${name}`)}
          >
            <FormattedMessage id="Importing data" />
          </Button>
          <Button
            type="primary"
            style={{ width: btnWidth, textAlign: 'left' }}
            icon={<FontAwesomeIcon icon={faMagnifyingGlass} style={{ marginRight: '8px' }} />}
            disabled={status === 'stopped' ? true : false}
            onClick={() => history.push(`/query-app#?graph_name=${name}`)}
          >
            <FormattedMessage id="Query graph" />
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
