import React, { useEffect } from 'react';
import { ReactFlow, ReactFlowProvider, applyNodeChanges, Background, MiniMap } from 'reactflow';
import useInteractive from './hooks/useInteractive';
import { nodeTypes } from './elements/node-types';
import { edgeTypes } from './elements/edge-types';
import ArrowMarker from './elements/arrow-marker';
import ConnectionLine from './elements/connection-line';
import { theme } from 'antd';
import ButtonController from './button-controller';
import type { ImportorProps } from './types';
import cssStyles from './style';
import locales from './locales';
import { StudioProvier, useDynamicStyle } from '@graphscope/studio-components';

const GraphCanvas: React.FC<ImportorProps> = ({
  children,
  showBackground = true,
  showMinimap = true,
  showDefaultBtn = true,
}) => {
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
  useDynamicStyle(cssStyles, 'graphscope-graph-canvas');
 
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
          {showDefaultBtn && <ButtonController />}
          {showBackground && <Background style={{ background: token.colorBgBase }} />}
          {showMinimap && <MiniMap style={{ backgroundColor: token.colorBgBase }} />}
          <ArrowMarker />
          {children}
        </ReactFlow>
      </div>
    </div>
  );
};
export default (props: ImportorProps) => {
  return (
    <StudioProvier locales={locales}>
      <ReactFlowProvider>
        <GraphCanvas {...props} />
      </ReactFlowProvider>
    </StudioProvier>
  );
};
