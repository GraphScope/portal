import * as React from 'react';
import ReactFlow from 'reactflow';
interface IGraphEditorProps {}
const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
  { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

const GraphEditor: React.FunctionComponent<IGraphEditorProps> = props => {
  return (
    <div>
      Graph Editor
      <div style={{ height: '500px', width: '100%' }}>
        <ReactFlow nodes={initialNodes} edges={initialEdges} />
      </div>
    </div>
  );
};

export default GraphEditor;
