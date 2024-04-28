import * as React from 'react';
import { ReactFlow, Controls, Background, useNodesState, useEdgesState, Position } from 'reactflow';
import { useContext } from '../useContext';
import { transformDataToReactFlow } from '../utils';
import { nodeTypes } from '../utils/nodeTypes';
import { edgeTypes } from '../utils/edgesTypes';
import dagre from 'dagre';
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

interface IGraphEditorProps {}

const GraphEditor: React.FunctionComponent<IGraphEditorProps> = props => {
  const { store, updateStore } = useContext();

  const { nodes_flow, edges_flow } = transformDataToReactFlow(store.nodes, store.edges);
  const [nodes, setNodes, onNodesChange] = useNodesState(nodes_flow);
  const [edges, setEdges, onEdgesChange] = useEdgesState(edges_flow);

  const onLayout = (direction: string) => {
    const isHorizontal = direction === 'LR';
    dagreGraph.setGraph({ rankdir: direction });

    nodes.forEach(node => {
      console.log('node', node);
      const { _fromEdge } = node;
      dagreGraph.setNode(node.id, { width: _fromEdge ? 200 : 150, height: _fromEdge ? 200 : 50 });
    });

    edges.forEach(edge => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const layoutedNodes = nodes.map(node => {
      const nodeWithPosition = dagreGraph.node(node.id);

      return {
        ...node,
        targetPosition: isHorizontal ? Position.Left : Position.Top,
        sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
        position: {
          x: nodeWithPosition.x,
          y: nodeWithPosition.y,
        },
      };
    });

    setNodes(layoutedNodes);
  };

  return (
    <div>
      Graph Editor
      <div style={{ height: '500px', width: '100%' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onInit={() => onLayout('LR')}
          // nodeTypes={nodeTypes}
          // edgeTypes={edgeTypes}
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
