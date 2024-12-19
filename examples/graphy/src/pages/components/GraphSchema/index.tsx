import * as React from 'react';

interface ISchemaGraphProps {
  data: any | null;
}

const SchemaGraph: React.FunctionComponent<ISchemaGraphProps> = props => {
  const { data } = props;
  if (data) {
    return <div>graph </div>;
  }
  return <div style={{ height: '100%' }}>no data</div>;
};

export default SchemaGraph;
