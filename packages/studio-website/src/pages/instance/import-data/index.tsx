import React, { useEffect } from 'react';
import { Row, Col, Card, Typography, Skeleton } from 'antd';
import { useContext } from './useContext';
import GraphView from './graph-view';
import DataSource from './data-source/index';
import { SOURCEDATA } from './source-data';
import SourceTitle from './source-title';
import GraphTitle from './graph-title';
interface IImportDataProps {}

const { Text } = Typography;

const ImportData: React.FunctionComponent<IImportDataProps> = props => {
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
    updateStore(draft => {
      if (currentType === 'nodesource') {
        draft.sourceList.nodes.forEach(item => {
          if (item.label === val.label) {
            item.label = val.label;
            item.isBind = val.isBind;
            item.datatype = val.datatype;
            item.filelocation = val.location;
            item.properties = val.properties;
          }
        });
      }
      if (currentType === 'edgesource') {
        draft.sourceList.edges.forEach(item => {
          if (item.label === val.label) {
            item.label = val.label;
            item.isBind = val.isBind;
            item.datatype = val.datatype;
            item.filelocation = val.location;
            item.properties = val.properties;
          }
        });
      }
    });
  };

  return (
    <Row style={{ padding: '24px' }} gutter={32}>
      <Col span={16}>
        <SourceTitle />
        {!isReady && <Skeleton />}
        {/* 遍历需要绑定的数据源 */}
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
      </Col>
      <Col span={8}>
        <GraphTitle />
        <Card style={{ marginTop: '24px', border: '1px dashed #000', borderRadius: '0px' }}>
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
  );
};

export default ImportData;
