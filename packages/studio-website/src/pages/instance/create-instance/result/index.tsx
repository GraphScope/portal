import * as React from 'react';
import { cloneDeep } from 'lodash';
import { useContext } from '../useContext';
import { Card, Row, Col } from 'antd';
import TableList from './table';
import GraphInsight from '../create-schema/graph-view';

interface IImportDataProps {}
const Result: React.FunctionComponent<IImportDataProps> = props => {
  const { store } = useContext();
  const { nodeList, edgeList } = store;

  return (
    <Row style={{ marginTop: '16px' }} gutter={[16, 16]}>
      <Col span={16}>
        {/**@ts-ignore */}
        <TableList data={{ nodes: nodeList, edges: edgeList }} />
      </Col>
      <Col span={8}>
        <Card
          bodyStyle={{
            padding: '1px',
            overflow: 'hidden',
          }}
        >
          <GraphInsight />
        </Card>
      </Col>
    </Row>
  );
};

export default Result;
