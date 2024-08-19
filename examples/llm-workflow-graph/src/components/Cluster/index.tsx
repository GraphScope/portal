import * as React from 'react';
import { Select, Button } from 'antd';
import { useCluster, useContext } from '@graphscope/studio-graph';
interface IClusterProps {}

const Cluster: React.FunctionComponent<IClusterProps> = props => {
  const { store } = useContext();
  const { data } = store;
  const { enableCluster, disableCluster } = useCluster();
  const [state, setState] = React.useState({
    clusterKey: 'properties.cluster_id',
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
    enableCluster(state.clusterKey);
  };
  const handleClose = () => {
    disableCluster();
  };
  const firstNode = data.nodes[0] || {};

  const options = [
    {
      value: 'id',
      label: 'id',
    },
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
    <div>
      <Select
        defaultValue="properties.cluster_id"
        style={{ width: '100%' }}
        onChange={handleChange}
        options={options}
      />
      <Button type="primary" onClick={handleCluster} block style={{ marginTop: '24px' }}>
        Cluster
      </Button>
    </div>
  );
};

export default Cluster;
