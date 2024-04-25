import * as React from 'react';
import { Typography, Flex, Space } from 'antd';
const { Title } = Typography;
import { FormattedMessage } from 'react-intl';

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
      <Title level={5} style={{ marginTop: '6px' }}>
        <FormattedMessage id="Vertex Labels" />
      </Title>
      <Space wrap size={[0, 6]}>
        {nodes.map(item => {
          return <Legend key={item.label} {...item} type="node" onChange={onChange} />;
        })}
      </Space>
      <Title level={5}>
        <FormattedMessage id="Edge Labels" />
      </Title>
      <Space wrap size={[0, 6]}>
        {edges.map(item => {
          return <Legend key={item.label} {...item} type="edge" onChange={onChange} />;
        })}
      </Space>
    </div>
  );
};

export default React.memo(Overview);
