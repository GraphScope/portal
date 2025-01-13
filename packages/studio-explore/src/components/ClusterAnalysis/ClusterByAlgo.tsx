import * as React from 'react';
import { Select, Button, Flex, Typography, Tooltip, InputNumber } from 'antd';
import { useApis, useContext } from '@graphscope/studio-graph';
import { ClearOutlined, PlayCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
interface IClusterByAlgorithmProps {}

const ClusterByAlgorithm: React.FunctionComponent<IClusterByAlgorithmProps> = props => {
  const { store } = useContext();
  const { data } = store;
  const { runCombos, clearCombos } = useApis();

  const [state, setState] = React.useState({
    clusterKey: 'label',
  });
  const handleChange = value => {
    setState(preState => {
      return {
        ...preState,
        clusterKey: value,
      };
    });
  };
  const handleCluster = () => {
    runCombos(state.clusterKey);
  };
  const handleClearCluster = () => {
    clearCombos();
  };
  const firstNode = data.nodes[0] || {};

  const options = [
    {
      value: 'label',
      label: 'label',
    },
    ...Object.keys(firstNode.properties || {}).map(key => {
      return {
        value: `properties.${key}`,
        label: `properties.${key}`,
      };
    }),
  ];

  return (
    <Flex vertical gap={12}>
      <Typography.Text>
        K-Means Algorithm
        <Tooltip title="Please set the K value: Clustering will be performed into K clusters based on the distance between nodes.">
          <QuestionCircleOutlined style={{ margin: '0px 6px' }} />
        </Tooltip>
      </Typography.Text>
      <Typography.Text>Set K Value: </Typography.Text>

      <InputNumber style={{ width: '100%' }} />

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

export default ClusterByAlgorithm;
