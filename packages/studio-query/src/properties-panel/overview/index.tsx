import * as React from 'react';
import { Typography } from 'antd';
const { Title } = Typography;

import Legend from '../legend';
interface IOverviewProps {
  schema: any;
  onChange: () => void;
}

const Overview: React.FunctionComponent<IOverviewProps> = props => {
  const { schema, onChange } = props;
  const { nodes, edges } = schema;
  console.log('schema', schema);
  return (
    <div>
      <Title level={5} style={{ marginTop: '12px' }}>
        Node Labels
      </Title>
      {nodes.map(item => {
        return <Legend key={item.label} {...item} type="node" onChange={onChange} />;
      })}
      <Title level={5}>Relationship Labels</Title>
      {edges.map(item => {
        return <Legend key={item.label} {...item} type="node" onChange={onChange} />;
      })}
    </div>
  );
};

export default React.memo(Overview);
