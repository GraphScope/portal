import React from 'react';
import { Flex, Card, Button, Row, Col ,Tag} from 'antd';
import { history } from 'umi';
import { createFromIconfontCN, DeploymentUnitOutlined, SearchOutlined, MoreOutlined } from '@ant-design/icons';
import { useContext } from '@/pages/instance/create-instance/useContext';

const Lists: React.FC = () => {
  const { store, updateStore } = useContext();
  const IconFont = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/a/font_4377140_8fiw2wn073a.js',
  });
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h3>GraphScope Instance</h3>
        <Flex wrap="wrap" gap="small">
        <Button
          type='primary'
          onClick={() => {
            history.push('/instance/create');
            updateStore(draft => {
              draft.detail = false;
              /**
               * 首次清空列表数据
               */
              draft.nodeItems = {};
              draft.nodeList = [];
              draft.edgeItems = {};
              draft.edgeList = [];
              draft.graphData = { nodes: [], edges: [] };
            });
          }}
        >
          创建图实例
        </Button>
        <Button>绑定</Button>
        </Flex>
      </div>
      {
        <Row>
          <Col span={12}>
            <Card>
              <Row>
                <Col span={12}>
                  <p>My Graph Instance</p>
                  <Tag color="green">Running</Tag>
                  <p>Sharing User：山果 / 东泽</p>
                  <p>Version： 0.24.0</p>
                  <p>CreateTime： 2024-01-10</p>
                  <p>Connect URL：xx.xxx.xxx.xxx:8787</p>
                </Col>
                <Col span={12}>
                  <Flex gap="small" align="flex-start" vertical>
                    <Button icon={<DeploymentUnitOutlined />}>Modal</Button>
                    <Button icon={<DeploymentUnitOutlined />}>Import</Button>
                    <Button icon={<SearchOutlined />}>Query</Button>
                    <Flex wrap="wrap" gap="small">
                      <Button icon={<SearchOutlined />} />
                      <Button icon={<IconFont type="icon-delete1" />} />
                      <Button icon={<MoreOutlined />} />
                    </Flex>
                  </Flex>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col span={12}>
            <Card>
              <Row>
                <Col span={12}>
                  <p>My Graph Instance</p>
                  <Tag color="green">Running</Tag>
                  <p>Sharing User：山果 / 东泽</p>
                  <p>Version： 0.24.0</p>
                  <p>CreateTime： 2024-01-10</p>
                  <p>Connect URL：xx.xxx.xxx.xxx:8787</p>
                </Col>
                <Col span={12}>
                  <Flex gap="small" align="flex-start" vertical>
                    <Button icon={<DeploymentUnitOutlined />}>Modal</Button>
                    <Button icon={<DeploymentUnitOutlined />}>Import</Button>
                    <Button icon={<SearchOutlined />}>Query</Button>
                    <Flex wrap="wrap" gap="small">
                      <Button icon={<SearchOutlined />} />
                      <Button icon={<IconFont type="icon-delete1" />} />
                      <Button icon={<MoreOutlined />} />
                    </Flex>
                  </Flex>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      }
    </>
  );
};

export default Lists;
