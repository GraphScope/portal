import React, { useRef } from 'react';

import { Canvas, Prepare } from '../components';

interface QueryGraphProps {
  data: any;
  schema: any;
  graphId: string;
}

const SchemaGraph: React.FunctionComponent<QueryGraphProps> = props => {
  const { data, schema, graphId } = props;
  const containerRef = useRef<HTMLDivElement | null>(null);
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: '8px',
        height: '400px',
      }}
      ref={containerRef}
    >
      <Prepare data={data} schema={schema} graphId={graphId} />
      <Canvas />
    </div>
  );
};

export default SchemaGraph;
