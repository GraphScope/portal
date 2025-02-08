import React from 'react';
import QueryGraph from '../../components/query-graph';
import { Utils } from '@graphscope/studio-components';
interface IGraphViewProps {
  data: any;
  schemaData: any;
  graphId: string;
}
export function transGraphSchema(schema) {
  return {
    nodes: schema.nodes,
    edges: schema.edges.map(item => {
      const { properties, constraints, ...others } = item;
      const [source, target] = constraints[0];
      return {
        ...others,
        source,
        target,
        properties,
      };
    }),
  };
}

const GraphView: React.FunctionComponent<IGraphViewProps> = props => {
  const { data, schemaData, graphId } = props;
  const graphSchema = transGraphSchema(schemaData);

  return (
    <div style={{ width: '100%' }}>
      {/** @ts-ignore */}
      <QueryGraph data={Utils.fakeSnapshot(data)} schema={graphSchema} graphId={graphId} />
    </div>
  );
};

export default GraphView;
