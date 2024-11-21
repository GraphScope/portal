import * as React from 'react';
import { Flex, Typography, Statistic, Divider } from 'antd';
import { useContext } from '@graphscope/studio-graph';
import Charts from './Chart';
interface IUploadProps {
  children?: React.ReactNode;
}
export interface IQueryStatistics {
  id: 'queryStatistics';
  query: () => Promise<{
    total_vertex_count: number;
    total_edge_count: number;
  }>;
}
const Statistics: React.FunctionComponent<IUploadProps> = props => {
  const { children } = props;
  const { updateStore, store } = useContext();
  const { getService } = store;
  const { nodes, edges } = store.data;
  const [data, setData] = React.useState({
    total_vertex_count: 0,
    total_edge_count: 0,
  });

  const initQuery = async () => {
    try {
      const statistics = await getService<IQueryStatistics>('queryStatistics')();

      setData(statistics);
    } catch (error) {
      console.log('error', error);
    }
  };
  React.useEffect(() => {
    initQuery();
  }, []);

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
      <Typography.Title level={3} style={{ margin: '0px' }}>
        Properties Statistics
      </Typography.Title>
      <Typography.Text type="secondary">
        Select the properties you're interested in for statistical display, and click on the bar chart for quick
        queries.
      </Typography.Text>
      {/* <Charts /> */}
    </Flex>
  );
};

export default Statistics;
