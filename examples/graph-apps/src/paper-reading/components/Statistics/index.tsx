import * as React from 'react';
import { Flex, Typography, Statistic, Divider } from 'antd';
import { useContext, getStyleConfig } from '@graphscope/studio-graph';
import { IQueryServices } from '../../service';
import Charts from './Chart';
interface IUploadProps {
  children?: React.ReactNode;
  queryCypher: IQueryServices['queryCypher'];
}

const Statistics: React.FunctionComponent<IUploadProps> = props => {
  const { children, queryCypher } = props;
  const { updateStore, store } = useContext();
  const { graphId } = store;
  const { nodes, edges } = store.data;
  const [data, setData] = React.useState({
    total_vertex_count: 0,
    total_edge_count: 0,
  });

  const initQuery = async () => {
    try {
      const data = await queryCypher({
        script: 'call gs.procedure.meta.statistics()',
      });
      const statistics = JSON.parse(data.raw.records[0]._fields[0]);
      setData(statistics);
    } catch (error) {
      console.log('error', error);
    }
  };
  React.useEffect(() => {
    initQuery();
  }, []);
  console.log('data', data);
  const { total_vertex_count, total_edge_count } = data;
  return (
    <Flex vertical style={{ padding: '24px 12px' }} gap={12}>
      <Typography.Title level={3} style={{ margin: '0px' }}>
        Graph Statistics
      </Typography.Title>
      <Flex align="center" justify="start" gap={64}>
        <Statistic title="Vertex Count" value={`${nodes.length} / ${total_vertex_count}`} />
        <Statistic title="Edge Count" value={`${edges.length} / ${total_edge_count}`} />
      </Flex>

      <Divider />
      {children}
      <Divider />
      <Typography.Title level={3} style={{ margin: '0px' }}>
        Properties Statistics
      </Typography.Title>
      <Typography.Text type="secondary">
        Select the properties you're interested in for statistical display, and click on the bar chart for quick
        queries.
      </Typography.Text>
      <Charts queryCypher={queryCypher} />
    </Flex>
  );
};

export default Statistics;
