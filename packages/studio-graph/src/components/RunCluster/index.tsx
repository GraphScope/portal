import * as React from 'react';
import { Button, Tooltip } from 'antd';
import { Icons, Utils } from '@graphscope/studio-components';
import useCluster from '../../hooks/useCluster';
import { FormattedMessage } from 'react-intl';
export interface IRunClusterProps {
  clusterKey?: string;
}

const RunCluster: React.FunctionComponent<IRunClusterProps> = props => {
  const { enableCluster, disableCluster } = useCluster();
  const [state, setState] = React.useState({
    cluster: false,
  });

  const { cluster } = state;
  const handleClick = () => {
    setState(preState => {
      return {
        ...preState,
        cluster: !preState.cluster,
      };
    });
    if (cluster) {
      disableCluster();
    } else {
      enableCluster('label');
    }
  };

  return (
    <Tooltip title={<FormattedMessage id="Clustering layout" />} placement="left">
      <Button onClick={handleClick} icon={<Icons.Cluster />} type="text"></Button>
    </Tooltip>
  );
};

export default RunCluster;
