import React, { useEffect, useState } from 'react';
import { Flex, Row, Col, Button, Modal, Form, Input, Breadcrumb, Divider, Card, Space, Skeleton } from 'antd';
import { history } from 'umi';
import InstaceCard, { InstaceCardType } from './instance-card';

import {
  createFromIconfontCN,
  DeploymentUnitOutlined,
  SearchOutlined,
  MoreOutlined,
  PlusOutlined,
  PlayCircleOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { FormattedMessage } from 'react-intl';

const graphs = [
  {
    name: 'Movie',
    version: '0.24.0',
    createtime: '2024-01-8',
    updatetime: '2024-01-10',
    importtime: '2024-01-11',
    server: 'xx.xxx.xxx.xxx:8787',
    statistics: 'xxxx',
    logs: 'xxxx',
    status: 'running',
  },
];

const InstanceCard: React.FC = () => {
  const [form] = Form.useForm();
  const [state, updateState] = useState<{ isReady?: boolean; instanceList?: InstaceCardType[] }>({
    instanceList: [],
    isReady: false,
  });
  const { instanceList, isReady } = state;

  useEffect(() => {
    getInstanceList().then(res => {
      updateState(preState => {
        return {
          ...preState,
          isReady: true,
          instanceList: res || [],
        };
      });
    });
  }, []);
  const getInstanceList = async () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(graphs);
      }, 600);
    });
  };

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', padding: '0px 20px' }}>
        <Breadcrumb
          items={[
            {
              title: 'Home',
            },
            {
              title: 'Graphs',
            },
          ]}
        />
        <h1>
          <FormattedMessage id="navbar.graphs" />
        </h1>
        <p style={{ marginTop: '0px' }}>
          <FormattedMessage id="Listing all graphs on the cluster" />
        </p>
        <Divider />
        {/*         
        <Flex wrap="wrap" gap="small">
          <Button
            type="primary"
            onClick={() => {
              history.push('/instance/create');
            }}
          >
            创建图实例
          </Button>
          <Button onClick={() => updateState({ isModalOpen: true })}>绑定</Button>
        </Flex> */}
        <Row gutter={[12, 12]}>
          {instanceList &&
            instanceList.map((item, i) => (
              <Col key={i}>
                <InstaceCard
                  key={i}
                  {...item}
                  routes={
                    <>
                      <Button style={{ width: '150px' }} icon={<DeploymentUnitOutlined />}>
                        Define Schema
                      </Button>
                      <Button
                        style={{ width: '150px' }}
                        icon={<DeploymentUnitOutlined />}
                        // onClick={() => history.push('/instance/import-data')}
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
                    </>
                  }
                  actions={
                    <>
                      <Space>
                        <Button type="text" icon={<PlayCircleOutlined />} />
                        <Button type="text" icon={<DeleteOutlined />} />
                      </Space>
                    </>
                  }
                />
              </Col>
            ))}

          {!isReady && (
            <Col>
              <Card title={'Loading graph'} style={{ background: '#FCFCFC' }} bodyStyle={{ width: '484px' }}>
                <div style={{ display: 'flex', height: '185px', justifyContent: 'center', alignContent: 'center' }}>
                  <Skeleton />
                </div>
              </Card>
            </Col>
          )}
          <Col>
            <Card title={'New Graph'} style={{ background: '#FCFCFC' }} bodyStyle={{ width: '484px' }}>
              <div style={{ display: 'flex', height: '185px', justifyContent: 'center', alignContent: 'center' }}>
                <PlusOutlined style={{ fontSize: '80px', color: 'gray' }} />
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default InstanceCard;
