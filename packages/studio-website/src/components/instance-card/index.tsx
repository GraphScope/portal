import React from 'react';
import { Flex, Card, Button, Tag, message } from 'antd';
import { history } from 'umi';
import copy from 'copy-to-clipboard';
import {
  createFromIconfontCN,
  DeploymentUnitOutlined,
  SearchOutlined,
  MoreOutlined,
  CopyOutlined,
} from '@ant-design/icons';
import { InstaceList } from '../../pages/instance/InstanceCard';
const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/a/font_4377140_8fiw2wn073a.js',
});

type InstaceType = {
  instanceLeftInfo: InstaceList;
    index: number;
};
const styles: React.CSSProperties = {
  margin: '6px 0px',
};
const InstaceItem: React.FC<InstaceType> = props => {
  const { instanceLeftInfo: {user, version, createtime, connecturl}, index } = props;
  return (
    <Card style={{ marginRight: index % 2 == 0 ? '6px' : '0px' }}>
      <Flex gap="middle" justify="space-between">
        <Flex gap="middle" align="flex-start" vertical>
          <div>
            <p style={{ margin: '0px 0px 12px' }}>My Graph Instance</p>
            <Tag color="green">Running</Tag>
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
            <Button icon={<DeploymentUnitOutlined />}>Modal</Button>
            <Button icon={<DeploymentUnitOutlined />} onClick={() => history.push('/instance/import-data')}>
              Import
            </Button>
            <Button icon={<SearchOutlined />}>Query</Button>
          </Flex>
          <Flex wrap="wrap" gap="small">
            <Button icon={<SearchOutlined />} />
            <Button icon={<IconFont type="icon-delete1" />} />
            <Button icon={<MoreOutlined />} />
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
};

export default InstaceItem;
