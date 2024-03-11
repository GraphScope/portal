import React, { useEffect } from 'react';
import { Row, Col, Card, Typography, Skeleton, Space, Flex, Divider } from 'antd';
import { useContext, updateDataMap, initialStore, initialDataMap, clearDataMap, clearStore } from './useContext';
import GraphView from './graph-view';
import DataSource from './data-source/index';
import GraphTitle from './graph-title';
import SourceTitle from './source-title';
import Section from '@/components/section';
import { cloneDeep } from 'lodash';

import { getUrlParams } from './utils';
import { getDataloadingConfig, getSchema } from './service';
import { useContext as useMode } from '@/layouts/useContext';

interface IImportDataProps {}

const { Title, Text } = Typography;
const ImportData: React.FunctionComponent<IImportDataProps> = props => {
  const { store, updateStore } = useContext();

  const { currentType, nodes, edges, isReady, graphName } = store;
  const {
    store: { mode },
  } = useMode();

  const initMapping = async () => {
    const { graph_name } = getUrlParams();
    const schema = await getSchema(graph_name);
    const options = await getDataloadingConfig(graph_name, schema);
    updateStore(draft => {
      draft.isReady = true;
      draft.nodes = options.nodes;
      draft.edges = options.edges;
      draft.graphName = graph_name;
      draft.schema = schema;
    });
    updateDataMap(draft => {
      options.nodes.map(item => {
        draft[item.key as string] = cloneDeep(item);
      });
      options.edges.map(item => {
        draft[item.key as string] = cloneDeep(item);
      });
    });
  };

  useEffect(() => {
    initMapping();
    return () => {
      clearDataMap();
      clearStore();
    };
  }, []);

  const bindNodeCount = nodes.filter(item => item.isBind).length;
  const bindEdgeCount = edges.filter(item => item.isBind).length;

  return (
    <Section
      title={graphName}
      breadcrumb={[
        {
          title: 'Graphs',
        },
        {
          title: 'import data',
        },
      ]}
    >
      <Row gutter={24}>
        <Col span={16}>
          <SourceTitle />
        </Col>
        <Col span={8}>
          <GraphTitle />
        </Col>
      </Row>

      <Divider style={{ margin: '0px 0px 16px' }} />

      <Row gutter={24}>
        <Col span={16}>
          {!isReady && <Skeleton />}
          {/* 遍历需要绑定的数据源 */}
          <div style={{ border: '1px solid #ddd', borderRadius: '8px' }}>
            <header style={{ background: mode === 'defaultAlgorithm' ? '#FCFCFC' : 'none', borderRadius: '8px' }}>
              <Space size={29}>
                <Title level={5} type="secondary" style={{ margin: '16px 32px 16px 48px' }}>
                  Labels
                </Title>
                <Title level={5} type="secondary" style={{ margin: '16px 0px' }}>
                  Datasource
                </Title>
              </Space>
            </header>
            {currentType === 'node' &&
              nodes.map(item => {
                return <DataSource id={item.key as string} />;
              })}
            {currentType === 'edge' &&
              edges.map(item => {
                return <DataSource id={item.key as string} />;
              })}
          </div>
        </Col>
        <Col span={8}>
          <Card>
            <Text type="secondary" style={{ display: 'block', textAlign: 'center', margin: '0px' }}>
              目前绑定了{bindEdgeCount} 条边，{bindNodeCount}个点
            </Text>
            {!isReady && <Skeleton />}
            <GraphView
              //@ts-ignore
              viewdata={{ nodeLists: nodes, edgeLists: edges }}
            ></GraphView>
          </Card>
        </Col>
      </Row>
    </Section>
  );
};

export default ImportData;
