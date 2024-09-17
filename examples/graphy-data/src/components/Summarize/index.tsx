import * as React from 'react';
import { Button, Flex, List, Typography } from 'antd';
// import { query } from '../FetchGraph/service';
import { useContext, useCluster } from '@graphscope/studio-graph';
import { updateClusterSummarize, runSummarize } from '../../pages/dataset/service';
import { Utils } from '@graphscope/studio-components';
interface ISummarizeProps {
  onClick?: () => void;
}

const Summarize: React.FunctionComponent<ISummarizeProps> = props => {
  const { enableCluster } = useCluster();
  const handleClick = async () => {
    const datasetId = Utils.getSearchParams('datasetId');
    const entityId = Utils.getSearchParams('entityId') || '';

    // runSummarize(datasetId, {
    //   entityId: entityId,
    //   cluster_ids:
    // });
  };

  return (
    <div>
      <Button onClick={handleClick} style={{ width: '100%' }}>
        Summarize and Save
      </Button>
    </div>
  );
};

export default Summarize;
