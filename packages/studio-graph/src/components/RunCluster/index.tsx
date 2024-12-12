import * as React from 'react';
import { Button, Tooltip } from 'antd';
import { Icons } from '@graphscope/studio-components';
import { useApis } from '../../index';
import { FormattedMessage } from 'react-intl';
export interface IRunClusterProps {
  clusterKey?: string;
}

const RunCluster: React.FunctionComponent<IRunClusterProps> = props => {
  const [state, setState] = React.useState({
    cluster: false,
  });
  const { runCombos, clearCombos } = useApis();

  const { cluster } = state;

  const handleClick = () => {
    setState(preState => {
      return {
        ...preState,
        cluster: !preState.cluster,
      };
    });
    if (cluster) {
      clearCombos();
    } else {
      runCombos('label');
    }
  };

  return (
    <Tooltip title={<FormattedMessage id="Clustering layout" />} placement="left">
      <Button onClick={handleClick} icon={<Icons.Cluster />} type="text"></Button>
    </Tooltip>
  );
};

export default RunCluster;
