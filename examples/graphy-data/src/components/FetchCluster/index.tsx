import * as React from 'react';
import { Select, Button, Typography, Space, notification } from 'antd';
import { useCluster, useContext } from '@graphscope/studio-graph';
import { runCluster } from '../../pages/dataset/service';
import { Utils } from '@graphscope/studio-components';
interface IClusterProps {}

const FetchCluster: React.FunctionComponent<IClusterProps> = props => {
  const { store, updateStore } = useContext();
  const { data } = store;
  const { enableCluster, disableCluster } = useCluster();
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
    const data = await runCluster(datasetId, entityId);
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
      draft.data = data;
      draft.source = data;
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
      enableCluster(state.clusterKey);
    } else {
      disableCluster();
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
