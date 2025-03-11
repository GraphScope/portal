import React, { useEffect, useState, memo } from 'react';
import { Row, Col, Card, Skeleton, Result, Button, Flex, ConfigProvider, Typography } from 'antd';
import { useHistory } from '../../../hooks';
import InstaceCard, { InstaceCardType } from './instance-card';
import { useContext } from '../../../layouts/useContext';
import { useCustomToken } from '@graphscope/studio-components';
import { FormattedMessage } from 'react-intl';
import ServerNotAvailable from './server-not-available'
import Empty from './empty'
import { listGraphs } from './service';

const { Paragraph, Text, Title } = Typography;

type IProps = {
  changeCreateAction: (state: boolean) => void;
};
const InstanceCard: React.FC<IProps> = ({ changeCreateAction }) => {
  const { store } = useContext();
  const history = useHistory();
  const { draftGraph } = store;
  const { instanceBackground } = useCustomToken();
  const [state, updateState] = useState<{
    isReady: boolean;
    instanceList: InstaceCardType[];
    isServerAvailable: boolean;
  }>({
    instanceList: [],
    isReady: false,
    isServerAvailable: true,
  });

  const { instanceList, isReady, isServerAvailable } = state;

  const isEmpty = instanceList.length === 0 && Object.keys(draftGraph || {}).length === 0;

  const fetchLists = async () => {
    try {
      const res = await listGraphs();
      //@ts-ignore
      updateState(preState => {
        return {
          ...preState,
          isServerAvailable: true,
          isReady: true,
          instanceList: res || [],
        };
      });
      changeCreateAction(!(res?.length=== 0&&Object.keys(draftGraph || {}).length ===0));
    } catch (error) {
      updateState(preState => {
        return {
          ...preState,
          isReady: true,
          instanceList: [],
          isServerAvailable: false,
        };
      });
      changeCreateAction(false);
    }
  };
  useEffect(() => {
    fetchLists();
  }, []);


  if (isReady && isServerAvailable) {
    return (
      <ServerNotAvailable />
    );
  }

  if (isEmpty && isReady) {
    return (
      <Empty/>
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
