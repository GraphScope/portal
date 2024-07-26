import React from 'react';
import { QueryGraph } from '@graphscope/studio-graph';
interface IGraphViewProps {
  data: any;
  schemaData: any;
  graphId: string;
}
export function transGraphSchema(schema) {
  return {
    nodes: schema.nodes.map(item => {
      const { properties, ...others } = item;
      return {
        ...others,
        properties: properties.reduce((acc, curr) => {
          return {
            ...acc,
            [curr.name]: curr.type,
          };
        }, {}),
      };
    }),
    edges: schema.edges.map(item => {
      const { properties, constraints, ...others } = item;
      const [source, target] = constraints;
      return {
        ...others,
        source,
        target,
        properties: properties.reduce((acc, curr) => {
          return {
            ...acc,
            [curr.name]: curr.type,
          };
        }, {}),
      };
    }),
  };
}

const GraphView: React.FunctionComponent<IGraphViewProps> = props => {
  const { data, schemaData, graphId } = props;
  const graphSchema = transGraphSchema(schemaData);

  return (
    <div style={{ width: '100%' }}>
      <QueryGraph data={data} schema={graphSchema} graphId={graphId} />
    </div>
  );
};

export default GraphView;
