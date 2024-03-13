import React, { useEffect, useState, memo } from 'react';
import { Row, Col, Form, Card, Skeleton, Typography, message } from 'antd';
import { history } from 'umi';
import InstaceCard, { InstaceCardType } from './instance-card';
import Section from '@/components/section';
import { PlusOutlined } from '@ant-design/icons';
import { useContext } from '@/layouts/useContext';
import { GraphApiFactory, ServiceApiFactory, ServiceApi } from '@graphscope/studio-server';
import { listGraphs, deleteGraph, startService, stopService } from './service';

const InstanceCard: React.FC = () => {
  const [form] = Form.useForm();
  const { store } = useContext();
  const { mode } = store;
  const [state, updateState] = useState<{ isReady: boolean; graphName: string; instanceList: InstaceCardType[] }>({
    instanceList: [],
    isReady: false,
    graphName: '',
  });
  const { instanceList, isReady, graphName } = state;

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    const res = await listGraphs();
    //@ts-ignore
    updateState(preState => {
      return {
        ...preState,
        isReady: true,
        instanceList: res || [],
      };
    });
  };

  const handleCreate = () => {
    history.push('/instance/create');
  };
  const handleDelete = async (name: string) => {
    const isSuccess = await deleteGraph(name);
    if (isSuccess) {
      fetchLists();
    }
  };
  const handleStart = async (name: string, status: string) => {
    await updateState(preState => {
      return {
        ...preState,
        graphName: name,
      };
    });
    let res;
    /** running->stopService,stoped->startService */
    if (status === 'running') {
      try {
        res = await stopService(name);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        res = await startService(name);
      } catch (error) {
        console.log(error);
      }
    }
    await fetchLists();
    await updateState(preState => {
      return {
        ...preState,
        graphName: '',
      };
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
        {instanceList.map((item, i) => (
          <Col key={i} span={12}>
            <InstaceCard
              {...item}
              isLoading={item.name === graphName}
              handleDelete={handleDelete}
              handleStart={handleStart}
            />
          </Col>
        ))}
        {!isReady && (
          <Col span={12}>
            <Card
              headStyle={{ fontSize: '30px' }}
              title={<Skeleton.Button style={{ marginTop: '-10px', width: '120px' }} active />}
              style={{ background: '#FCFCFC' }}
            >
              <div style={{ display: 'flex', height: '164px', justifyContent: 'center', alignContent: 'center' }}>
                <Skeleton active />
              </div>
            </Card>
          </Col>
        )}
        <Col span={12}>
          <Card
            title={'New Graph'}
            headStyle={{ fontSize: '30px', color: '#ccc' }}
            style={{ background: mode === 'defaultAlgorithm' ? '#FCFCFC' : '' }}
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
