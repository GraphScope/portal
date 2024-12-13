import * as React from 'react';
import { Select, Button, Flex, Typography, Tooltip, Space, Input, InputRef } from 'antd';
import { useApis, useContext } from '@graphscope/studio-graph';
import { ClearOutlined, PlayCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Utils } from '@graphscope/studio-components';
const { storage } = Utils;
interface IClusterByAlgorithmProps {}

const ClusterByEndpoint: React.FunctionComponent<IClusterByAlgorithmProps> = props => {
  const { store } = useContext();
  const { data } = store;
  const inputRef = React.useRef<InputRef>(null);

  const [state, setState] = React.useState({
    clusterKey: 'label',
  });

  const handleCluster = async () => {
    if (inputRef.current) {
      const { value = '' } = inputRef.current.input || {};
      storage.set('portal_cluster_analysis_endpoint', value);
      try {
        const res = await fetch(value, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            data: data,
            dataset_id: '0',
            groupby: 'Challenge',
          }),
        }).then(res => res.json());
        console.log(res, 'res.....');
      } catch (error) {}

      console.log(value);
    }

    // enableCluster(state.clusterKey);
  };
  const handleClearCluster = async () => {
    // disableCluster();
  };

  return (
    <Flex vertical gap={12}>
      <Typography.Text>
        Input your endpoint:
        <Tooltip title="your cluster server address">
          <QuestionCircleOutlined style={{ margin: '0px 6px' }} />
        </Tooltip>
      </Typography.Text>

      <Input
        placeholder="such as: http://your_cluster_server"
        ref={inputRef}
        defaultValue={storage.get('portal_cluster_analysis_endpoint')}
      />
      <Flex gap={12}>
        <Button icon={<PlayCircleOutlined />} onClick={handleCluster} block>
          Run Cluster
        </Button>
        <Button icon={<ClearOutlined />} onClick={handleClearCluster}>
          Clear
        </Button>
      </Flex>
    </Flex>
  );
};

export default ClusterByEndpoint;
