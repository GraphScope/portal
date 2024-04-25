import React from 'react';
import ReactFlow from 'reactflow';
//@ts-ignore
window.R2 = React;
import 'reactflow/dist/style.css';

const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
  { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

interface ImportAppProps {}

const ImportApp: React.FunctionComponent<ImportAppProps> = props => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow nodes={initialNodes} edges={initialEdges} />
    </div>
  );
};

export default ImportApp;
