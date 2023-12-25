import * as React from 'react';

import Legend from '../legend';
interface IOverviewProps {
  schema: any;
}

const Overview: React.FunctionComponent<IOverviewProps> = props => {
  const { schema } = props;
  const { nodes, edges } = schema;
  return (
    <div>
      <div> Node Labels</div>
      {nodes.map(item => {
        return <Legend {...item} />;
      })}
      <div> Edge Labels</div>
      {edges.map(item => {
        return <Legend {...item} />;
      })}
    </div>
  );
};

export default Overview;
