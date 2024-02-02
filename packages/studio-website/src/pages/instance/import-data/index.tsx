import React, { useEffect } from 'react';
import { Row, Col, Card, Typography, Skeleton, theme, Space } from 'antd';
import { useContext } from './useContext';
import GraphView from './graph-view';
import DataSource from './data-source/index';
import { SOURCEDATA } from './source-data';
import SourceTitle from './source-title';
import GraphTitle from './graph-title';
import Section from '@/components/section';
interface IImportDataProps {}

const { Title, Text } = Typography;
const { useToken } = theme;
const ImportData: React.FunctionComponent<IImportDataProps> = props => {
  const { token } = useToken();
  const { store, updateStore } = useContext();
  const {
    currentType,
    sourceList: { nodes, edges },
    isReady,
  } = store;

  useEffect(() => {
    getInportList().then(res => {
      updateStore(draft => {
        draft.isReady = true;
        //@ts-ignore
        draft.sourceList = res;
      });
    });
  }, []);
  const getInportList = async () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(SOURCEDATA);
      }, 600);
    });
  };
  const sourceData = currentType === 'nodesource' ? nodes : edges;

  const bindNodeCount = nodes.filter(item => item.isBind).length;
  const bindEdgeCount = edges.filter(item => item.isBind).length;

  /** 更新入口state数据 */
  const handleChange = (val: any) => {
    const { label, isBind, datatype, location, properties } = val;
    updateStore(draft => {
      if (currentType === 'nodesource') {
        draft.sourceList.nodes.forEach(item => {
          if (item.label === label) {
            item.label = label;
            item.isBind = isBind;
            item.datatype = datatype;
            item.filelocation = location;
            item.properties = properties;
          }
        });
      }
      if (currentType === 'edgesource') {
        draft.sourceList.edges.forEach(item => {
          if (item.label === label) {
            item.label = label;
            item.isBind = isBind;
            item.datatype = datatype;
            item.filelocation = location;
            item.properties = properties;
          }
        });
      }
    });
  };

  return (
    <Section
      breadcrumb={[
        {
          title: 'Graphs',
        },
        {
          title: 'import data',
        },
      ]}
    >
      <Row style={{}} gutter={24}>
        <Col span={15}>
          <Card title={<SourceTitle />}>
            {!isReady && <Skeleton />}
            {/* 遍历需要绑定的数据源 */}
            <div style={{ background: '#FCFCFC', border: '1px solid #ddd', borderRadius: '8px' }}>
              <header>
                <Space size={29}>
                  <Title level={5} style={{ margin: '16px 0px 16px 48px' }}>
                    Labels
                  </Title>{' '}
                  <Title level={5} style={{ margin: '16px 0px' }}>
                    Datasource
                  </Title>
                </Space>
              </header>
              {sourceData.map(item => {
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
          </Card>
        </Col>
        <Col span={9}>
          <Card title={<GraphTitle />}>
            <Text type="secondary" style={{ display: 'block', textAlign: 'center', margin: '0px' }}>
              目前绑定了{bindEdgeCount} 条边，{bindNodeCount}个点
            </Text>
            {!isReady && <Skeleton />}
            <GraphView
              //@ts-ignore
              pdata={{ nodeLists: nodes, edgeLists: edges }}
            ></GraphView>
          </Card>
        </Col>
      </Row>
    </Section>
  );
};

export default ImportData;
