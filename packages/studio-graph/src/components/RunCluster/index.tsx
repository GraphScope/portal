import * as React from 'react';
import { Button, Tooltip } from 'antd';
import { Icons, useStudioProvier } from '@graphscope/studio-components';
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
  const { isLight } = useStudioProvier();
  const color = !isLight ? '#ddd' : '#000';
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
      <Button onClick={handleClick} icon={<Icons.Cluster style={{ color: color }} />} type="text"></Button>
    </Tooltip>
  );
};

export default RunCluster;
