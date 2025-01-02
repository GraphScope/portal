import * as React from 'react';
import { Flex, Typography, Statistic, Divider, Tooltip, Space, Button } from 'antd';
import { useContext, type IQueryStatement } from '@graphscope/studio-graph';
import { PlayCircleOutlined } from '@ant-design/icons';
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
  const { store, updateStore } = useContext();
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

  const queryNodes = async () => {
    updateStore(draft => {
      draft.isLoading = true;
    });
    const res = await getService<IQueryStatement>('queryStatement')(` Match (n) return n`);
    updateStore(draft => {
      draft.data = res;
      draft.source = res;
      draft.isLoading = false;
    });
  };
  const queryEdges = async () => {
    updateStore(draft => {
      draft.isLoading = true;
    });
    const res = await getService<IQueryStatement>('queryStatement')(`match (a)-[e]->(b) return a,b,e`);
    updateStore(draft => {
      draft.data = res;
      draft.source = res;
      draft.isLoading = false;
    });
  };

  const { total_vertex_count, total_edge_count } = data;
  return (
    <Flex vertical gap={12}>
      <Typography.Title level={5} style={{ margin: '0px' }}>
        Global Statistics
      </Typography.Title>
      <Flex align="center" justify="start" gap={64}>
        <Statistic
          title="Total Vertices"
          value={total_vertex_count}
          suffix={
            <Tooltip title="Query all vertices">
              <Button type="text" onClick={queryNodes} icon={<PlayCircleOutlined />}></Button>
            </Tooltip>
          }
        />
        <Statistic
          title="Total Edges"
          value={`${total_edge_count}`}
          suffix={
            <Tooltip title="Query all edges">
              <Button type="text" onClick={queryEdges} icon={<PlayCircleOutlined />}></Button>
            </Tooltip>
          }
        />
      </Flex>
    </Flex>
  );
};

export default TotalCounts;
