import React from 'react';
import { QueryGraph } from '@graphscope/studio-graph';
import type { IEditorProps } from '../typing';
interface IGraphViewProps {
  data: any;
  schemaData: any;
  graphId: string;
  onQuery: IEditorProps['onQuery'];
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
      const [source, target] = constraints[0];
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
  const { data, schemaData, graphId, onQuery } = props;
  const graphSchema = transGraphSchema(schemaData);

  return (
    <div style={{ width: '100%' }}>
      {/** @ts-ignore */}
      <QueryGraph data={data} schema={graphSchema} graphId={graphId} onQuery={onQuery} />
    </div>
  );
};

export default GraphView;
