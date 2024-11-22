import * as React from 'react';
import { Timeline, Collapse, Divider, Flex, theme } from 'antd';

import { CaretRightOutlined } from '@ant-design/icons';
import ClusterByField from './ClusterByField';
import ClusterByAlgorithm from './ClusterByAlgo';
import ClusterByEndpoint from './ClusterByEndpoint';
import { useDynamicStyle } from '@graphscope/studio-components';
interface IClusterAnalysisProps {}

const ClusterAnalysis: React.FunctionComponent<IClusterAnalysisProps> = props => {
  const { token } = theme.useToken();
  useDynamicStyle(
    `
    .explore-cluster-analysis .ant-collapse{
      // background:${token.colorBgBase}
    }
    .explore-cluster-analysis .ant-collapse-header {
        // padding: 10px 12px !important;
        // border-left: 4px solid ${token.colorPrimary};
        // border-radius: 4px 4px 4px 4px !important;
        // background:${token.colorBgBase}
    }`,
    'explore-cluster-analysis',
  );
  return (
    <Flex vertical gap={12} className="explore-cluster-analysis">
      <Collapse
        expandIconPosition="end"
        // ghost
        // bordered={false}
        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
        defaultActiveKey={['cluster-by-datafield']}
        items={[{ key: 'cluster-by-datafield', label: 'Cluster By DataField', children: <ClusterByField /> }]}
      />

      <Collapse
        // ghost
        // bordered={false}
        expandIconPosition="end"
        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
        defaultActiveKey={['cluster-by-algorithm']}
        items={[{ key: 'cluster-by-algorithm', label: 'Cluster By Algorithm', children: <ClusterByAlgorithm /> }]}
      />

      <Collapse
        expandIconPosition="end"
        // ghost
        // bordered={false}
        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
        defaultActiveKey={['cluster-by-endpoint']}
        items={[{ key: 'cluster-by-endpoint', label: 'Cluster By Endpoint', children: <ClusterByEndpoint /> }]}
      />
    </Flex>
  );
};

export default ClusterAnalysis;
