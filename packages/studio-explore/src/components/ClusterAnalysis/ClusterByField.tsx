import * as React from 'react';
import { Select, Button, Flex } from 'antd';
import { useApis, useContext } from '@graphscope/studio-graph';
import { ClearOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { Utils } from '@graphscope/studio-components';
import ChartView from '../ChartView';
interface IClusterByFieldProps {}

const ClusterByField: React.FunctionComponent<IClusterByFieldProps> = props => {
  const { store } = useContext();
  const { data } = store;
  const { runCombos, clearCombos } = useApis();

  const [state, setState] = React.useState({
    clusterKey: 'label',
    clustered: false,
    chart: {},
  });
  const { clustered } = state;
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
    const groupedData = Utils.groupBy(data.nodes, node => {
      return Utils.getObjByPath(node, state.clusterKey);
    });

    setState(preState => {
      return {
        ...preState,
        clustered: true,
        chart: {
          data: Object.keys(groupedData).map(item => {
            return {
              name: item,
              count: groupedData[item].length,
            };
          }),
          xField: 'name',
          yField: 'count',
          type: 'interval',
          title: 'Cluster Statistics',
        },
      };
    });
  };
  const handleClearCluster = () => {
    clearCombos();
    setState(preState => {
      return {
        ...preState,
        clustered: false,
      };
    });
  };
  const firstNode = data.nodes[0] || {};

  const options = [
    {
      value: 'label',
      label: 'lable',
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
      <Select defaultValue="label" style={{ width: '100%' }} onChange={handleChange} options={options} />
      <Flex gap={8}>
        <Button icon={<PlayCircleOutlined />} onClick={handleCluster} block>
          Run Cluster
        </Button>
        <Button icon={<ClearOutlined />} onClick={handleClearCluster}>
          Clear
        </Button>
      </Flex>
      {/** @ts-ignore **/}
      {clustered && <ChartView {...state.chart} />}
    </Flex>
  );
};

export default ClusterByField;
