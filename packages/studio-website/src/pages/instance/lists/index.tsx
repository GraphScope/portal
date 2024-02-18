import React, { useEffect, useState, memo } from 'react';
import { Row, Col, Form, Card, Skeleton, Typography } from 'antd';
import { history } from 'umi';
import InstaceCard, { InstaceCardType } from './instance-card';
import Section from '@/components/section';
import { PlusOutlined } from '@ant-design/icons';
import { GraphApiFactory, ServiceApiFactory, ServiceApi } from '@graphscope/studio-server';
import { listGraphs } from './service';

const InstanceCard: React.FC = () => {
  const [form] = Form.useForm();
  const [state, updateState] = useState<{ isReady: boolean; instanceList: InstaceCardType[] }>({
    instanceList: [],
    isReady: false,
  });
  const { instanceList, isReady } = state;

  useEffect(() => {
    listGraphs().then(res => {
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

  const handleCreate = () => {
    history.push('/instance/create');
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
        {instanceList.map((item, i) => (
          <Col key={i} span={12}>
            <InstaceCard {...item} />
          </Col>
        ))}
        {!isReady && (
          <Col span={12}>
            <Card headStyle={{ fontSize: '30px' }} title={'Loading graph'} style={{ background: '#FCFCFC' }}>
              <div style={{ display: 'flex', height: '164px', justifyContent: 'center', alignContent: 'center' }}>
                <Skeleton />
              </div>
            </Card>
          </Col>
        )}
        <Col span={12}>
          <Card
            title={'New Graph'}
            headStyle={{ fontSize: '30px', color: '#ccc' }}
            style={{ background: '#FCFCFC' }}
            bodyStyle={{ width: '100%' }}
          >
            <div
              style={{
                display: 'flex',
                height: '164px',
                justifyContent: 'center',
                alignContent: 'center',
                cursor: 'pointer',
              }}
              onClick={handleCreate}
            >
              <PlusOutlined style={{ fontSize: '80px', color: '#ccc' }} />
            </div>
          </Card>
        </Col>
      </Row>
    </Section>
  );
};

export default memo(InstanceCard);
