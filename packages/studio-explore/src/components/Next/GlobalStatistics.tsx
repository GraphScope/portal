import * as React from 'react';
import Overview from '../Overview';
import { useContext } from '@graphscope/studio-graph';
import { Illustration } from '@graphscope/studio-components';
import { Flex, Typography } from 'antd';
interface IGlobalStatisticsProps {}

const GlobalStatistics: React.FunctionComponent<IGlobalStatisticsProps> = props => {
  const { store } = useContext();
  const { data } = store;
  const match = data.nodes.length === 0 && data.edges.length === 0;
  if (!match) {
    return null;
  }
  return (
    <Flex vertical gap={12}>
      <Flex align="center" gap={12}>
        <Illustration.Welcome style={{ height: '100px', width: '100px' }} />
        <Typography.Text type="secondary" italic>
          What is the next exploration? Let's take a look at the global view of graph data to find some inspiration.
        </Typography.Text>
      </Flex>
      <Overview />
    </Flex>
  );
};

export default GlobalStatistics;
