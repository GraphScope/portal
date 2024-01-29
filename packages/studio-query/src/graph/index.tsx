import React, { useEffect, useState } from 'react';
import Graphin, { GraphinData } from '@antv/graphin';
import Panel from './panel';

interface GraphViewProps {
  data: GraphinData;
}

const schema = {
  nodes: [
    {
      label: 'customer',
      count: 1,
      color: '#F7A128',
      properties: {
        id: 'string',
        address: 'string',
        phone: 'number',
      },
    },
    {
      label: 'account',
      count: 2,
      color: '#40C054',
      properties: {
        id: 'string',
        address: 'string',
        phone: 'number',
      },
    },
  ],
  edges: [
    {
      label: 'ownership',
      count: 6,
      color: '#8DCADD',
      properties: {
        id: 'string',
        address: 'string',
        phone: 'number',
      },
    },
    {
      label: 'transfer',
      count: 5,
      color: '#A413A4',
      properties: {
        id: 'string',
        address: 'string',
        phone: 'number',
      },
    },
  ],
};

const GraphView: React.FunctionComponent<GraphViewProps> = props => {
  const [state, updateState] = useState({
    detail: {},
  });
  const { detail } = state;
  const { data } = props;

  const count = {
    nodes: data.nodes.length,
    edges: data.edges.length,
  };
  const overview = {
    count,
    schema,
  };
  console.log('overview', count);
  const handleChange = () => {};

  return (
    <Graphin
      data={data}
      layout={{ type: 'force' }}
      style={{ height: '480px', minHeight: '480px', background: '#f8fcfe' }}
    >
      <Panel overview={overview}></Panel>
    </Graphin>
  );
};

export default GraphView;
