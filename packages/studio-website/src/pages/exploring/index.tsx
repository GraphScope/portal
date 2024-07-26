import * as React from 'react';
import { ExploreGraph } from '@graphscope/studio-graph';

interface ExploringProps {}

const Exploring: React.FunctionComponent<ExploringProps> = props => {
  return (
    <div>
      <ExploreGraph />
    </div>
  );
};

export default Exploring;
