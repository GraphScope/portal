import React, { useEffect, useState, memo } from 'react';
import { Row, Col, Card, Skeleton, Result, Button } from 'antd';
import { useHistory } from '../../../hooks';
import InstaceCard, { InstaceCardType } from './instance-card';
import { useContext } from '../../../layouts/useContext';
import { useCustomToken } from '@graphscope/studio-components';
import { FormattedMessage } from 'react-intl';
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
  const isEmpty = instanceList.length === 0 && Object.keys(draftGraph || {}).length === 0;
  if (isEmpty && isReady) {
    return (
      <Result
        status="404"
        title={<FormattedMessage id="No graph available" />}
        subTitle={<FormattedMessage id="Please click the button above to 「Create instance」" />}
      />
    );
  }

  return (
    <Row gutter={[12, 12]}>
      {[draftGraph, ...instanceList]
        .filter(c => {
          return Object.keys(c).length > 0;
        })
        .map((item, i) => (
          <Col key={i} span={24}>
            {/** @ts-ignore */}
            <InstaceCard {...item} handleChange={() => fetchLists()} />
          </Col>
        ))}
      {!isReady && (
        <Col span={24}>
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
    </Row>
  );
};

export default memo(InstanceCard);
