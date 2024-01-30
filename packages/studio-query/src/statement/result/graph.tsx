import React, { useEffect } from 'react';
import Graph from '../../graph';
interface IGraphViewProps {
  data: any;
}

const GraphView: React.FunctionComponent<IGraphViewProps> = props => {
  const { data } = props;
  useEffect(() => {
    return () => {
      console.log('unmount....graph');
    };
  }, []);

  const schema = {
    nodes: [
      {
        label: 'person',
        properties: {
          age: 'number',
          name: 'string',
        },
      },
      {
        label: 'software',
        properties: {
          lang: 'string',
          name: 'string',
        },
      },
    ],
    edges: [
      {
        label: 'created',
        properties: {
          weight: 'number',
        },
      },
    ],
  };

  return (
    <div style={{ width: '100%' }}>
      <Graph data={data} schema={schema} />
    </div>
  );
};

export default GraphView;
