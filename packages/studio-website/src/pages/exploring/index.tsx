import * as React from 'react';
import StudioGraph from '@graphscope/studio-graph';

interface ExploringProps {}

const Exploring: React.FunctionComponent<ExploringProps> = props => {
  return (
    <div>
      <StudioGraph />
    </div>
  );
};

export default Exploring;
