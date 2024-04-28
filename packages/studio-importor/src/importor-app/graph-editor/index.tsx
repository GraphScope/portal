import * as React from 'react';
import { ReactFlow, Controls, Background, useNodesState, useEdgesState } from 'reactflow';
import { useContext } from '../useContext';
import { transformDataToReactFlow } from '../utils';
import { nodeTypes } from '../utils/nodeTypes';
import { edgeTypes } from '../utils/edgesTypes';

interface IGraphEditorProps {}
const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
  { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

const GraphEditor: React.FunctionComponent<IGraphEditorProps> = props => {
  const { store, updateStore } = useContext();
  const { nodes_flow, edges_flow } = transformDataToReactFlow(store.nodes, store.edges);
  const [nodes, setNodes, onNodesChange] = useNodesState(nodes_flow);
  const [edges, setEdges, onEdgesChange] = useEdgesState(edges_flow);

  return (
    <div>
      Graph Editor
      <div style={{ height: '500px', width: '100%' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
        >
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
};

export default GraphEditor;
