import React, { useEffect } from 'react';
import Graphin from '@antv/graphin';
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
      <Graphin data={data} layout={{ type: 'force' }} style={{ minHeight: '100px' }} />
    </div>
  );
};

export default GraphView;
