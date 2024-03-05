import * as React from 'react';
import { Typography, Flex } from 'antd';
const { Title } = Typography;

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
      <Title level={5} style={{ marginTop: '0px' }}>
        Vertex Labels
      </Title>
      <Flex vertical gap={12}>
        {nodes.map(item => {
          return <Legend key={item.label} {...item} type="node" onChange={onChange} />;
        })}
      </Flex>
      <Title level={5} style={{ marginTop: '8px' }}>
        Relationship Labels
      </Title>
      <Flex vertical gap={12}>
        {edges.map(item => {
          return <Legend key={item.label} {...item} type="edge" onChange={onChange} />;
        })}
      </Flex>
    </div>
  );
};

export default React.memo(Overview);
