import * as React from 'react';
import { Select, Button, Typography, Space, notification } from 'antd';
import { useCombos, useContext } from '@graphscope/studio-graph';
import { runCluster } from '../../../service';
import { Utils } from '@graphscope/studio-components';
interface IClusterProps {}

const FetchCluster: React.FunctionComponent<IClusterProps> = props => {
  const { store, updateStore } = useContext();
  const { data } = store;
  const { runCombos, clearCombos } = useCombos();
  const [state, setState] = React.useState({
    clusterKey: 'properties.cluster_id',
    layout: false,
  });
  const { layout } = state;

  const handleCluster = async () => {
    updateStore(draft => {
      draft.isLoading = true;
    });
    const entityId = Utils.getSearchParams('entityId');
    const datasetId = Utils.getSearchParams('datasetId');
    const clusterData = await runCluster(datasetId, entityId);
    const _data = {
      nodes: data.nodes.map(item => {
        if (item.label === 'Paper') {
          return {
            ...item,
            properties: {
              ...item.properties,
              cluster_id: 'Paper',
            },
          };
        }
        return item;
      }),
      edges: data.edges,
    };
    const newData = Utils.handleExpand(clusterData, _data);
    console.log('newData', newData);
    if (data.nodes.length === 0) {
      notification.info({
        message: 'No cluster data',
        description: 'The dataset does not contain any cluster data.',
      });
      updateStore(draft => {
        draft.isLoading = false;
      });
      return;
    }
    updateStore(draft => {
      draft.isLoading = false;
      draft.data = newData;
      draft.source = newData;
    });
    setState(preState => {
      return {
        ...preState,
        layout: true,
      };
    });
  };
  React.useEffect(() => {
    if (layout) {
      console.log(state.clusterKey);
      runCombos(state.clusterKey);
    } else {
      clearCombos();
    }
  }, [layout]);

  const firstNode = data.nodes[0] || {};

  return (
    <div>
      <Typography.Text type="secondary">Cluster the entities based on similarity weights.</Typography.Text>

      <Button type="primary" onClick={handleCluster} block style={{ marginTop: '24px' }}>
        Run Clustering
      </Button>
    </div>
  );
};

export default FetchCluster;
