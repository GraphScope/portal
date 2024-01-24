import React, { useEffect, useState } from 'react';
import { Flex, Row, Col, Button, Modal, Form, Input, Breadcrumb, Divider, Card, Space, Skeleton } from 'antd';
import { history } from 'umi';
import InstaceCard, { InstaceCardType } from './instance-card';
import Section from '@/components/section';
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
      //@ts-ignore
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
    <Section
      breadcrumb={[
        {
          title: 'Home',
        },
        {
          title: 'Graphs',
        },
      ]}
      title="navbar.graphs"
      desc="Listing all graphs on the cluster"
    >
      <Row gutter={[12, 12]}>
        {instanceList &&
          instanceList.map((item, i) => (
            <Col key={i} span={12}>
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
          <Col span={12}>
            <Card title={'Loading graph'} style={{ background: '#FCFCFC' }}>
              <div style={{ display: 'flex', height: '185px', justifyContent: 'center', alignContent: 'center' }}>
                <Skeleton />
              </div>
            </Card>
          </Col>
        )}
        <Col span={12}>
          <Card title={'New Graph'} style={{ background: '#FCFCFC' }} bodyStyle={{ width: '100%' }}>
            <div style={{ display: 'flex', height: '185px', justifyContent: 'center', alignContent: 'center' }}>
              <PlusOutlined style={{ fontSize: '80px', color: 'gray' }} />
            </div>
          </Card>
        </Col>
      </Row>
    </Section>
  );
};

export default InstanceCard;
