import React, { useEffect, useState, memo } from 'react';
import { Row, Col, Card, Skeleton } from 'antd';
import { useHistory } from '../../../hooks';
import InstaceCard, { InstaceCardType } from './instance-card';
import Section from '../../../components/section';
import { useContext } from '../../../layouts/useContext';
import { useCustomToken } from '@graphscope/studio-components';
import InteractiveCase from './interactive-case';
import CreateGraph from './create-graph';
import { listGraphs } from './service';
const InstanceCard: React.FC = () => {
  const { store } = useContext();
  const history = useHistory();
  const { draftGraph } = store;
  const { instanceBackground } = useCustomToken();
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
    history.push('/graphs/create');
  };

  return (
    <Section
      breadcrumb={[
        {
          title: 'Graphs',
        },
      ]}
      desc="Listing all graphs on the cluster"
    >
      <Row gutter={[12, 12]}>
        {[draftGraph, ...instanceList]
          .filter(c => {
            return Object.keys(c).length > 0;
          })
          .map((item, i) => (
            <Col key={i} span={12}>
              {/** @ts-ignore */}
              <InstaceCard {...item} handleChange={() => fetchLists()} />
            </Col>
          ))}
        {!isReady && (
          <Col span={12}>
            <Card
              styles={{ header: { fontSize: '30px' } }}
              title={<Skeleton.Button style={{ marginTop: '-10px', width: '120px' }} active />}
              style={{ background: instanceBackground }}
            >
              <div style={{ display: 'flex', height: '164px', justifyContent: 'center', alignContent: 'center' }}>
                <Skeleton active />
              </div>
            </Card>
          </Col>
        )}
        <Col span={12}>
          <InteractiveCase>
            <CreateGraph onCreate={handleCreate} />
          </InteractiveCase>
        </Col>
      </Row>
    </Section>
  );
};

export default memo(InstanceCard);
