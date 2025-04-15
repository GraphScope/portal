import React from 'react';
import { ReactFlow, ReactFlowProvider, applyNodeChanges } from 'reactflow';
import useInteractive from './hooks/useInteractive';
import { nodeTypes } from './elements/node-types';
import { edgeTypes } from './elements/edge-types';
import ArrowMarker from './elements/arrow-marker';
import ConnectionLine from './elements/connection-line';
import { theme } from 'antd';
import type { ImportorProps } from './types';

const GraphCanvas: React.FC<ImportorProps & { children?: React.ReactNode }> = ({ children, ...props }) => {
  const {
    nodes,
    edges,
    nodePositionChange,
    onDoubleClick,
    onEdgesChange,
    onNodesChange,
    onConnectStart,
    onConnectEnd,
    onReactFlowInit,
  } = useInteractive();
  const { token } = theme.useToken();

  const _nodes = nodePositionChange.length === 0 ? nodes : applyNodeChanges(nodePositionChange, nodes);
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <div style={{ height: '100%', width: '100%', position: 'absolute', background: token.colorBgContainer }}>
          <ReactFlow
            nodes={_nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            connectionLineComponent={ConnectionLine}
            onConnectStart={onConnectStart}
            onConnectEnd={onConnectEnd}
            onInit={onReactFlowInit}
            proOptions={{ hideAttribution: true }}
            zoomOnDoubleClick={false}
            nodesDraggable={true}
            onDoubleClick={onDoubleClick}
            minZoom={0.01}
          >
            <ArrowMarker />
            {children}
          </ReactFlow>
      </div>
    </div>
  );
};
export default (props: ImportorProps & { children?: React.ReactNode }) => {
  return (
    <ReactFlowProvider>
      <GraphCanvas {...props}/>
    </ReactFlowProvider>
  );
};
