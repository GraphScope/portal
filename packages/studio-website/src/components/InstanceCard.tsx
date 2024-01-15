import React from 'react';
import { Flex, Card, Button, Row, Col, Tag, message } from 'antd';
import { history } from 'umi';
import copy from 'copy-to-clipboard';
import {
  createFromIconfontCN,
  DeploymentUnitOutlined,
  SearchOutlined,
  MoreOutlined,
  CopyOutlined,
} from '@ant-design/icons';
const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/a/font_4377140_8fiw2wn073a.js',
});

type instanceType ={
  instanceData:{}
}
const Lists: React.FC<instanceType> = props => {
  const { instanceData } = props;
  return (
    <>
      <Row>
        <Col span={12}>
          <Card>
            <Flex gap="middle" justify="space-between">
              <Flex gap="middle" align="flex-start" vertical>
                <div>
                  <p style={{ margin: '0px 0px 12px' }}>My Graph Instance</p>
                  <Tag color="green">Running</Tag>
                </div>
                <div>
                  <p style={{ margin: '6px 0px' }}>Sharing User：山果 / 东泽</p>
                  <p style={{ margin: '6px 0px' }}>Version： 0.24.0</p>
                  <p style={{ margin: '6px 0px' }}>CreateTime： 2024-01-10</p>
                  <p style={{ margin: '6px 0px' }}>
                    Connect URL：xx.xxx.xxx.xxx:8787
                    <CopyOutlined
                      onClick={e => {
                        e.stopPropagation();
                        copy('xx.xxx.xxx.xxx:8787 ');
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
                  <Button icon={<DeploymentUnitOutlined />} onClick={() => history.push('/instance/import')}>
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
        </Col>
      </Row>
    </>
  );
};

export default Lists;
