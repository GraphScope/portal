import * as React from 'react';

import Legend from '../legend';
interface IOverviewProps {
  schema: any;
  onChange: () => void;
}

const Overview: React.FunctionComponent<IOverviewProps> = props => {
  const { schema, onChange } = props;
  const { nodes, edges } = schema;
  return (
    <div>
      <h4 style={{ marginBottom: 5 }}> Node Labels</h4>
      {nodes.map(item => {
        return <Legend {...item} type="NODE" onChange={onChange} />;
      })}
      <h4 style={{ marginBottom: 5 }}>Relationship types</h4>
      {edges.map(item => {
        return <Legend {...item} onChange={onChange} />;
      })}
    </div>
  );
};

export default React.memo(Overview);
