import React, { useEffect, useState } from 'react';
import { useContext, IQueryStatement, Canvas, GraphProvider, Prepare, GraphData } from '../../index';
import { setEdgeStyle, setNodeStyle } from './setStyle';
interface ISchemaViewProps {
  id: string;
  style?: React.CSSProperties;
}

const SchemaView: React.FunctionComponent<ISchemaViewProps> = props => {
  const { style = {}, id } = props;
  const { store } = useContext();
  const { schema, getService } = store;
  const [state, setState] = useState<{ schemaData: GraphData }>({
    schemaData: {
      nodes: [],
      edges: [],
    },
  });
  const query = async () => {
    const { nodes, edges } = schema;
    if (nodes.length === 0) {
      return;
    }
    try {
      const node_script = `MATCH (n) 
      WITH n, labels(n) as label
      return label, COUNT(*) as counts
      ORDER BY counts DESC`;
      const edge_script = `MATCH (a)-[r]-(b)
    WITH r, type(r) as label
    return label, COUNT(*) as counts
    ORDER BY counts DESC`;
      const n = await getService<IQueryStatement>('queryStatement')(node_script);
      const r = await getService<IQueryStatement>('queryStatement')(edge_script);

      const _nodes = nodes.map(item => {
        const { label } = item;
        const match = n.table.find(i => i.label === label);
        return {
          ...item,
          id: label,
          properties: {
            counts: match.counts,
            label,
          },
        };
      });
      const _edges = edges.map(item => {
        const { label } = item;
        const match = r.table.find(i => i.label === label);
        return {
          ...item,
          id: label,
          properties: {
            counts: match.counts,
            label,
          },
        };
      });
      console.log({
        nodes: _nodes,
        edges: _edges,
      });
      setState(preState => {
        return {
          ...preState,
          schemaData: {
            nodes: _nodes,
            edges: _edges,
          },
        };
      });
    } catch (error) {}
  };

  useEffect(() => {
    query();
  }, [schema]);

  return (
    <div style={{ width: '100%', height: '200px', ...style }}>
      <GraphProvider id={id}>
        <Prepare
          data={state.schemaData}
          schema={schema}
          graphId={id}
          setNodeStyle={setNodeStyle}
          setEdgeStyle={setEdgeStyle}
        />
        <Canvas />
      </GraphProvider>
    </div>
  );
};

export default SchemaView;
