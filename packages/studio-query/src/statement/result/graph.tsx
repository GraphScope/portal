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

  return (
    <div style={{ width: '100%' }}>
      <Graph data={data} />
    </div>
  );
};

export default GraphView;
