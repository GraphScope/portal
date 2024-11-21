import * as React from 'react';
import { Timeline, Collapse, Divider } from 'antd';

import { CaretRightOutlined } from '@ant-design/icons';
import ClusterByField from './ClusterByField';
import ClusterByAlgorithm from './ClusterByAlgo';
import ClusterByEndpoint from './ClusterByEndpoint';
import { useDynamicStyle } from '@graphscope/studio-components';
interface IClusterAnalysisProps {}

const ClusterAnalysis: React.FunctionComponent<IClusterAnalysisProps> = props => {
  useDynamicStyle(
    `.explore-cluster-analysis .ant-collapse-header {padding:0px !important;}
    .explore-cluster-analysis .ant-collapse-content-box {padding:12px 0px !important;}
    `,
    'explore-cluster-analysis',
  );
  return (
    <Timeline style={{ padding: '12px 12px 0px 0px' }} className="explore-cluster-analysis">
      <Timeline.Item>
        <Collapse
          style={{ marginTop: '0px' }}
          ghost
          expandIconPosition="end"
          bordered={false}
          expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
          defaultActiveKey={['cluster-by-datafield']}
          items={[{ key: 'cluster-by-datafield', label: 'Cluster By DataField', children: <ClusterByField /> }]}
        />
      </Timeline.Item>

      <Timeline.Item>
        <Collapse
          ghost
          expandIconPosition="end"
          bordered={false}
          expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
          defaultActiveKey={['cluster-by-algorithm']}
          items={[{ key: 'cluster-by-algorithm', label: 'Cluster By Algorithm', children: <ClusterByAlgorithm /> }]}
        />
      </Timeline.Item>

      <Timeline.Item>
        <Collapse
          ghost
          expandIconPosition="end"
          bordered={false}
          expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
          defaultActiveKey={['cluster-by-endpoint']}
          items={[{ key: 'cluster-by-endpoint', label: 'Cluster By Endpoint', children: <ClusterByEndpoint /> }]}
        />
      </Timeline.Item>
    </Timeline>
  );
};

export default ClusterAnalysis;
