import * as React from 'react';
import { Divider, Flex, Typography } from 'antd';

import ClusterByField from './ClusterByField';
import ClusterByAlgorithm from './ClusterByAlgo';
import ClusterByEndpoint from './ClusterByEndpoint';
import { useDynamicStyle, CollapseCard } from '@graphscope/studio-components';
interface IClusterAnalysisProps {}

const ClusterAnalysis: React.FunctionComponent<IClusterAnalysisProps> = props => {
  return (
    <Flex vertical gap={16}>
      <Typography.Text type="secondary">You can cluster your canvas data using three approaches</Typography.Text>
      <CollapseCard title="Cluster By DataField">
        <ClusterByField />
      </CollapseCard>
      <Divider style={{ margin: 0 }} />
      <CollapseCard title="Cluster By Algorithm" defaultCollapse>
        <ClusterByAlgorithm />
      </CollapseCard>
      <Divider style={{ margin: 0 }} />
      <CollapseCard title="Cluster By Endpoint" defaultCollapse>
        <ClusterByEndpoint />
      </CollapseCard>
    </Flex>
  );
};

export default ClusterAnalysis;
