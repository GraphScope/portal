import React, { useRef } from 'react';
import { Button } from 'antd';
import { MultipleInstance, useSection, Icons } from '@graphscope/studio-components';
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
      <MultipleInstance>
        <Prepare data={data} schema={schema} graphId={graphId} />
        <Canvas />
      </MultipleInstance>
    </div>
  );
};

export default SchemaGraph;
