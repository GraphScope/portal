import * as React from 'react';
import { ReactFlow, Controls, Background, useNodesState, useEdgesState, Position, useReactFlow } from 'reactflow';
import { useContext } from '../useContext';
import { transformDataToReactFlow, transformEdges, transformNodes } from '../utils';
import { nodeTypes } from '../utils/nodeTypes';
import { edgeTypes } from '../utils/edgesTypes';
import dagre from 'dagre';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

interface IGraphEditorProps {}

const GraphEditor: React.FunctionComponent<IGraphEditorProps> = props => {
  const { store, updateStore } = useContext();

  const { displayMode, nodes: _nodes, edges: _edges } = store;

  const [nodes, setNodes, onNodesChange] = useNodesState(transformNodes(_nodes, displayMode));
  const [edges, setEdges, onEdgesChange] = useEdgesState(transformEdges(_edges, displayMode));

  React.useEffect(() => {
    console.log('efffect...');
    const { nodes, edges } = transformDataToReactFlow(_nodes, _edges, displayMode);
    setNodes(nodes);
    setEdges(edges);
  }, [displayMode, _edges, _nodes]);

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
