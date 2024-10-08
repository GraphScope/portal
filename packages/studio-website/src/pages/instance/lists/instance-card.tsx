import React, { useState } from 'react';
import { Flex, Card, Tag, Typography, Space, Button, Divider, Dropdown, Popover, Tooltip } from 'antd';
import type { MenuProps } from 'antd';
import { history } from 'umi';
import dayjs from 'dayjs';
import { PauseCircleOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { useContext } from '@/layouts/useContext';

import { deleteGraph, startService, stopService } from './service';

const { Text, Paragraph } = Typography;
import { MoreOutlined } from '@ant-design/icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlayCircle, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { FormattedMessage } from 'react-intl';
import { TOOLS_MENU } from '@/layouts/const';
import { Utils, useCustomTheme } from '@graphscope/studio-components';
export type InstaceCardType = {
  /** graph id */
  id: string;
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
  Stopped: 'red',
  Running: 'green',
  undefined: 'green',
};

const InstaceCard: React.FC<InstaceCardType> = props => {
  const {
    updatetime,
    importtime,
    createtime,
    server,
    status,
    id,
    name,
    hqps,
    handleChange,
    schema = { edges: 0, vertices: 0 },
  } = props;
  const { store, updateStore } = useContext();
  const { locale, draftGraph, draftId } = store;
  const { instanceBackground } = useCustomTheme();
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
  const handleDelete = async (id: string) => {
    await deleteGraph(id);
    handleChange();
  };
  const onClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'delete') {
      if (id === draftId) {
        updateStore(draft => {
          draft.draftGraph = {};
        });
        Utils.storage.set('DRAFT_GRAPH', {});
      } else {
        handleDelete(id);
      }
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
        <>
          {days}
          <FormattedMessage id="day" />
        </>
      )}
      {hours > 0 && (
        <>
          {hours}
          <FormattedMessage id="hrs" />
        </>
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
  const handleHistory = (path: string) => {
    //@ts-ignore
    const url = new URL(window.location);
    const { searchParams } = url;
    searchParams.set('engineType', 'interactive');
    searchParams.set('graph_id', id);
    url.pathname = path;
    window.history.pushState({}, '', url);
    history.push(`${path}?${searchParams.toString()}`);
    updateStore(draft => {
      draft.graphId = id;
      draft.currentnNav = path;
    });
  };
  const handleClick = async (id: string, status: string) => {
    updateIsLoading(true);
    /** running->stopService */
    if (status === 'Running') {
      await stopService(id);
    }
    /** stoped->startService */
    if (status === 'Stopped') {
      await startService(id);
    }
    updateIsLoading(false);
    handleChange();
  };
  /** Start|Pause 提示 */
  let tooltipContext;
  if (status === 'Stopped') tooltipContext = <FormattedMessage id="Start graph service" />;
  if (status === 'Running') tooltipContext = <FormattedMessage id="Pause graph service" />;
  /** Start|Pause icon */
  let btnIcon;
  if (status === 'Stopped') btnIcon = <PlayCircleOutlined />;
  if (status === 'Running') btnIcon = <PauseCircleOutlined />;
  /** 按钮中英文宽度 */
  let btnWidth = locale === 'zh-CN' ? '115px' : '130px';
  return (
    <Card
      styles={{ header: { fontSize: '30px' } }}
      title={name}
      style={{ background: instanceBackground }}
      extra={
        <Space>
          {btnIcon && (
            <Tooltip title={tooltipContext}>
              <Button
                type="text"
                icon={btnIcon}
                loading={isLoading}
                onClick={() => {
                  handleClick(id, status);
                }}
              />
            </Tooltip>
          )}
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
          </Space>
        </Flex>

        <Flex gap="middle" align="flex-end" vertical justify="end">
          {TOOLS_MENU.map(item => {
            return (
              <Button
                key={item.key}
                style={{ width: btnWidth, textAlign: 'left' }}
                icon={item.icon}
                onClick={() => handleHistory(item.value)}
              >
                <span style={{ marginLeft: '8px' }}>{item.label}</span>
              </Button>
            );
          })}
        </Flex>
      </Flex>
    </Card>
  );
};

export default InstaceCard;
