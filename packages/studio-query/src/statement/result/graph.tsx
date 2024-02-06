import React, { useEffect } from 'react';
import Graph from '../../graph';
interface IGraphViewProps {
  data: any;
  schemaData: any;
  graphName: string;
}

const GraphView: React.FunctionComponent<IGraphViewProps> = props => {
  const { data, schemaData, graphName } = props;
  useEffect(() => {
    return () => {
      console.log('unmount....graph');
    };
  }, []);

  return (
    <div style={{ width: '100%' }}>
      <Graph data={data} schemaData={schemaData} schemaId={graphName} />
    </div>
  );
};

export default GraphView;
