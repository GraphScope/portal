import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { Row, Col, Card, Typography, Skeleton, Space } from 'antd';
import { useContext, updateDataMap, clearDataMap, clearStore, useDataMap } from './useContext';
import GraphView from './graph-view';
import DataSource from './data-source/index';
import GraphTitle from './graph-title';
import SourceTitle from './source-title';
import Section from '@/components/section';
import { cloneDeep } from 'lodash';

import { getUrlParams } from './utils';
import { getDataloadingConfig, getSchema } from './service';
import { useContext as useMode } from '@/layouts/useContext';
import { count } from './source-title';

const { Title, Text } = Typography;
const ImportData: React.FunctionComponent = () => {
  const { store, updateStore } = useContext();
  const { currentType, nodes, edges, isReady, graphName } = store;
  const dataMap = useDataMap();
  const {
    store: { mode },
  } = useMode();

  const initMapping = async () => {
    const { graph_name, graph_id } = getUrlParams();
    const schema = await getSchema(graph_id);
    const options = await getDataloadingConfig(graph_id, schema);
    updateStore(draft => {
      draft.isReady = true;
      draft.nodes = options.nodes;
      draft.edges = options.edges;
      draft.graphName = graph_name;
      draft.schema = schema;
    });
    updateDataMap(draft => {
      options.nodes.forEach(item => {
        draft[item.key as string] = cloneDeep(item);
      });
      options.edges.forEach(item => {
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
  /** 绑定节点和边数量 */
  //@ts-ignore
  const { nodeBind, edgeBind } = count(dataMap);
  return (
    <Section
      breadcrumb={[
        {
          title: 'Graphs',
        },
        {
          title: 'import data',
        },
        {
          title: graphName,
        },
      ]}
    >
      <Row gutter={24}>
        <Col span={16}>
          <SourceTitle />
          <Card
            styles={{ body: { padding: '1px' } }}
            title={<SourceTitle type="title" />}
            extra={<SourceTitle type="import" />}
          >
            {!isReady && <Skeleton />}
            {/* 遍历需要绑定的数据源 */}
            <div>
              <header style={{ background: mode === 'defaultAlgorithm' ? '#FCFCFC' : 'none' }}>
                <Space size={29}>
                  <Title level={5} type="secondary" style={{ margin: '16px 32px 16px 48px' }}>
                    <FormattedMessage id="Labels" />
                  </Title>
                  <Title level={5} type="secondary" style={{ margin: '16px 0px' }}>
                    <FormattedMessage id="Data sources" />
                  </Title>
                </Space>
              </header>
              {currentType === 'node' &&
                nodes.map(item => {
                  return <DataSource key={item.key} id={item.key as string} />;
                })}
              {currentType === 'edge' &&
                edges.map(item => {
                  return <DataSource key={item.key} id={item.key as string} />;
                })}
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card title={<FormattedMessage id="Preview" />} extra={<GraphTitle />}>
            <Text type="secondary" style={{ display: 'block', textAlign: 'center', margin: '0px' }}>
              <FormattedMessage id="Existing data bindings" />
              <span> {edgeBind}</span> <FormattedMessage id="Edges" />，{nodeBind}
              <FormattedMessage id="Vertices" />
            </Text>
            {!isReady && <Skeleton />}
            <div
              style={{
                padding: '1px',
                minHeight: 'calc(100vh - 300px)',
                overflow: 'hidden',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <GraphView
                //@ts-ignore
                viewdata={{ nodeLists: nodes, edgeLists: edges }}
              ></GraphView>
            </div>
          </Card>
        </Col>
      </Row>
    </Section>
  );
};

export default ImportData;
