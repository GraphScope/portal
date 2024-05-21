import * as React from 'react';
import { Typography } from 'antd';
interface IPropertiesSchemaProps {
  data: any;
  type: 'nodes' | 'edges';
}

const PropertiesSchema: React.FunctionComponent<IPropertiesSchemaProps> = props => {
  const { data } = props;
  const { label } = data;
  return (
    <div>
      <Typography.Text>Vertex label: {label}</Typography.Text>
      <Typography.Text> Properties : </Typography.Text>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      xxxx
    </div>
  );
};

export default PropertiesSchema;
