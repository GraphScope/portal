import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
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
        <Col span={16}></Col>
        <Col span={8}></Col>
      </Row>

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
                    <FormattedMessage id="Datasource" />
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
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Preview" extra={<GraphTitle />}>
            <Text type="secondary" style={{ display: 'block', textAlign: 'center', margin: '0px' }}>
              <FormattedMessage id="Currently bound" />
              {bindEdgeCount} <FormattedMessage id="Edges" />，{bindNodeCount}
              <FormattedMessage id="Vertices" />
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
