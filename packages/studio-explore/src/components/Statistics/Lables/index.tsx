import React, { useEffect, useState } from 'react';

import { useContext, IQueryStatement, SchemaView } from '@graphscope/studio-graph';

import { Flex, Typography } from 'antd';
interface ILabelsProps {}

const Labels: React.FunctionComponent<ILabelsProps> = props => {
  const { store } = useContext();
  const { schema, getService } = store;
  const [state, setState] = useState({
    nodes: [],
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
  console.log(state.nodes);

  const setNodeStyle = defaultNodeStyle => {
    console.log(defaultNodeStyle);
    const _style = {};
    Object.keys(defaultNodeStyle).forEach(key => {
      _style[key] = {
        ...defaultNodeStyle[key],
        caption: ['label', 'counts'],
        size: 3,
        options: {
          textSize: 3,
          zoomLevel: [0.1, 20],
        },
      };
    });
    return _style;
  };

  const setEdgeStyle = defaultEdgeStyle => {
    console.log(defaultEdgeStyle);
    const _style = {};
    Object.keys(defaultEdgeStyle).forEach(key => {
      _style[key] = {
        ...defaultEdgeStyle[key],
        size: 1,
        color: '#000',
        caption: ['label', 'counts'],
        options: {
          textSize: 1.8,
          textColor: '#fff',
          textBackgroundColor: '#000',
          zoomLevel: [0.1, 20],
        },
      };
    });
    return _style;
  };
  return (
    <Flex gap={12} style={{ width: '100%', height: '200px' }} vertical>
      <Typography.Title level={5} style={{ margin: '0px' }}>
        Labels Statistics
      </Typography.Title>
      <SchemaView id="explore-schema-view" />
    </Flex>
  );
};

export default Labels;
