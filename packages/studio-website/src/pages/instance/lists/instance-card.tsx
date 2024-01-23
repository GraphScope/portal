import React from 'react';
import { Flex, Card, Tag, message } from 'antd';
import copy from 'copy-to-clipboard';
import { createFromIconfontCN, CopyOutlined } from '@ant-design/icons';

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
  margin: '6px 0px',
};
const InstaceCard: React.FC<InstaceCardType> = props => {
  const { updatetime, importtime, version, createtime, server, routes, actions, status, name } = props;
  return (
    <Card title={name} style={{ background: '#FCFCFC' }} bodyStyle={{ width: '484px' }} extra={actions}>
      <Flex gap="middle" justify="space-between">
        <Flex gap="middle" align="flex-start" vertical>
          <div>
            <Tag color="green">{status}</Tag>
          </div>
          <div>
            <p style={styles}>Uptime: {updatetime}</p>
            <p style={styles}>Last data import: {importtime}</p>
            <br />
            <p style={styles}>Created on：{createtime}</p>
            <p style={styles}>
              Server from: {server}
              <CopyOutlined
                onClick={e => {
                  e.stopPropagation();
                  copy(server);
                  message.success('复制成功');
                }}
                type="icon-fuzhi1"
                style={{ marginLeft: '8px', fontSize: '16px', color: '#1577FE' }}
              />
            </p>
          </div>
        </Flex>
        <Flex gap={25} align="flex-start" vertical>
          <Flex gap="middle" align="flex-start" vertical>
            {routes}
          </Flex>
          <Flex wrap="wrap" gap="small">
            more...
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
};

export default InstaceCard;
