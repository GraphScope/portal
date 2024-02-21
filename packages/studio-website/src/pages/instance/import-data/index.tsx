import React, { useEffect } from 'react';
import { Row, Col, Card, Typography, Skeleton, Space, Flex, Divider } from 'antd';
import { useContext } from './useContext';
import GraphView from './graph-view';
import DataSource from './data-source/index';
import { SOURCEDATA } from './source-data';
import GraphTitle from './graph-title';
import SourceTitle from './source-title';
import Section from '@/components/section';

import { getUrlParams } from './utils';
import { getSchema } from './service';

interface IImportDataProps {}

const { Title, Text } = Typography;
const ImportData: React.FunctionComponent<IImportDataProps> = props => {
  const { store, updateStore } = useContext();
  const { currentType, nodes, edges, isReady } = store;
  useEffect(() => {
    const { graph_name } = getUrlParams();
    getSchema(graph_name).then(res => {
      updateStore(draft => {
        draft.isReady = true;
        draft.nodes = res.nodes;
        draft.edges = res.edges;
      });
    });
  }, []);

  const bindNodeCount = nodes.filter(item => item.isBind).length;
  const bindEdgeCount = edges.filter(item => item.isBind).length;

  /** 更新入口state数据 */
  const handleChange = (val: any) => {
    const { label, isBind, datatype, filelocation, properties } = val;
    updateStore(draft => {
      const KEY = `${currentType}s` as 'nodes' | 'edges';
      draft[KEY].forEach(item => {
        if (item.label === label) {
          item.label = label;
          item.isBind = isBind;
          item.datatype = datatype;
          item.filelocation = filelocation;
          item.properties = properties;
        }
      });
    });
  };
  console.log('nodes,', nodes, edges);

  return (
    <Section
      title="Movie Graph"
      breadcrumb={[
        {
          title: 'Graphs',
        },
        {
          title: 'import data',
        },
      ]}
    >
      <Divider style={{ margin: '0px 0px 16px' }} />

      <Row gutter={24}>
        <Col span={16}>
          <SourceTitle />
          {!isReady && <Skeleton />}
          {/* 遍历需要绑定的数据源 */}
          <div style={{ border: '1px solid #ddd', borderRadius: '8px' }}>
            <header style={{ background: '#FCFCFC', borderRadius: '8px' }}>
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
                return (
                  <DataSource
                    key={item.key}
                    //@ts-ignore
                    data={item}
                    handleChange={handleChange}
                  />
                );
              })}
            {currentType === 'edge' &&
              edges.map(item => {
                return (
                  <DataSource
                    key={item.key}
                    //@ts-ignore
                    data={item}
                    handleChange={handleChange}
                  />
                );
              })}
          </div>
        </Col>
        <Col span={8}>
          <GraphTitle />
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
