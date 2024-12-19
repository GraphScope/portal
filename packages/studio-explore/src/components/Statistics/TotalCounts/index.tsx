import * as React from 'react';
import { Flex, Typography, Statistic, Divider, Tooltip, Space, Button } from 'antd';
import { useContext } from '@graphscope/studio-graph';

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
const TotalCounts: React.FunctionComponent<IUploadProps> = props => {
  const { store } = useContext();
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
    <Flex vertical gap={12}>
      <Typography.Title level={5} style={{ margin: '0px' }}>
        Graph Statistics
      </Typography.Title>
      <Flex align="center" justify="start" gap={64}>
        <Statistic title="Vertex Count" value={`${nodes.length} / ${total_vertex_count}`} />
        <Statistic title="Edge Count" value={`${edges.length} / ${total_edge_count}`} />
      </Flex>
    </Flex>
  );
};

export default TotalCounts;
