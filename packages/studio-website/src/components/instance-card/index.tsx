import React from 'react';
import { Flex, Card, Tag, message } from 'antd';
import copy from 'copy-to-clipboard';
import { CopyOutlined } from '@ant-design/icons';

export type InstaceCardType = {
  /** user 用户名 */
  user: string;
  /** version 版本号 */
  version: string;
  /** createtime 创建时间 */
  createtime: string;
  /** connecturl 实例链接 */
  connecturl: string;
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
  const { user, version, createtime, connecturl, routes, actions, status } = props;
  return (
    <Card>
      <Flex gap="middle" justify="space-between">
        <Flex gap="middle" align="flex-start" vertical>
          <div>
            <p style={{ margin: '0px 0px 12px' }}>My Graph Instance</p>
            <Tag color={status === 'running' ? 'green' : 'red'}>{status}</Tag>
          </div>
          <div>
            <p style={styles}>Sharing User：{user}</p>
            <p style={styles}>Version：{version}</p>
            <p style={styles}>CreateTime：{createtime}</p>
            <p style={styles}>
              Connect URL：{connecturl}
              <CopyOutlined
                onClick={e => {
                  e.stopPropagation();
                  copy(connecturl);
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
            {actions}
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
};

export default InstaceCard;
