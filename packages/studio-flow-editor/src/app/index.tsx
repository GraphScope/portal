import React,{useEffect} from 'react';
import { ReactFlow, ReactFlowProvider, applyNodeChanges, Background, MiniMap, Controls } from 'reactflow';
import useInteractive from './hooks/useInteractive';
import { nodeTypes } from './elements/node-types';
import { edgeTypes } from './elements/edge-types';
import ArrowMarker from './elements/arrow-marker';
import ConnectionLine from './elements/connection-line';
import { theme } from 'antd';
import type { ImportorProps } from './types';
import cssStyles from './style';
import locales from './locales';
import { StudioProvier, useDynamicStyle } from '@graphscope/studio-components';
import { useGraphStore } from './store';

const GraphCanvas: React.FC<ImportorProps> = ({
  children,
  nodesDraggable = true,
  isPreview = false,
  onNodesChange: handleNodesChange,
  onEdgesChange: handleEdgesChange,
  onSelectionChange,
  noDefaultLabel,
  defaultNodes,
  defaultEdges
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
  } = useInteractive({ isPreview, handleNodesChange, handleEdgesChange, onSelectionChange, noDefaultLabel });
  const { token } = theme.useToken();
  const { updateStore } = useGraphStore();
  useDynamicStyle(cssStyles, 'graphscope-flow-editor');
  const _nodes = nodePositionChange.length === 0 ? nodes : applyNodeChanges(nodePositionChange, nodes);
  useEffect(() => {
    if(defaultNodes){
      updateStore(draft => {
        draft.nodes = defaultNodes||[];
      });
    }
    if(defaultEdges){
      updateStore(draft => {
        draft.edges = defaultEdges||[];
      });
    }
  }, []);
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
          nodesDraggable={nodesDraggable}
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
export default (props: ImportorProps) => {
  return (
    <StudioProvier locales={locales}>
      <ReactFlowProvider>
        <GraphCanvas {...props} />
      </ReactFlowProvider>
    </StudioProvier>
  );
};
