import React, { useEffect, useState, memo } from 'react';
import { Row, Col, Card, Skeleton } from 'antd';
import { history } from 'umi';
import InstaceCard, { InstaceCardType } from './instance-card';
import Section from '@/components/section';
import { PlusOutlined } from '@ant-design/icons';
import { FormattedMessage } from 'react-intl';
import { useContext } from '@/layouts/useContext';
import { listGraphs } from './service';
const { GS_ENGINE_TYPE } = window;
const InstanceCard: React.FC = () => {
  const { store } = useContext();
  const { mode } = store;
  const [state, updateState] = useState<{ isReady: boolean; instanceList: InstaceCardType[] }>({
    instanceList: [],
    isReady: false,
  });
  const { instanceList, isReady } = state;
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
  useEffect(() => {
    fetchLists();
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
            <InstaceCard {...item} handleChange={() => fetchLists()} />
          </Col>
        ))}
        {!isReady && (
          <Col span={12}>
            <Card
              headStyle={{ fontSize: '30px' }}
              title={<Skeleton.Button style={{ marginTop: '-10px', width: '120px' }} active />}
              style={{ background: mode === 'defaultAlgorithm' ? '#FCFCFC' : '' }}
            >
              <div style={{ display: 'flex', height: '164px', justifyContent: 'center', alignContent: 'center' }}>
                <Skeleton active />
              </div>
            </Card>
          </Col>
        )}
        {GS_ENGINE_TYPE === 'interactive' && (
          <Col span={12}>
            <Card
              title={<FormattedMessage id="New graph" />}
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
        )}
      </Row>
    </Section>
  );
};

export default memo(InstanceCard);
