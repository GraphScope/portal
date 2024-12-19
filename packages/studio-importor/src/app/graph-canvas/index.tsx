import React, { useState } from 'react';
import { ReactFlow, Controls, Background, MiniMap, applyNodeChanges } from 'reactflow';
import { EmptyCanvas, useStudioProvier } from '@graphscope/studio-components';
import { nodeTypes } from '../elements/node-types';
import { edgeTypes } from '../elements/edge-types';
import ConnectionLine from '../elements/connection-line';
import ArrowMarker from '../elements/arrow-marker';
import { PlayCircleOutlined } from '@ant-design/icons';

import useInteractive from './useInteractive';
import { FormattedMessage } from 'react-intl';
// import CustomControls from './CustomControls';

interface IGraphEditorProps {}

const fakeSnapshot = obj => {
  return JSON.parse(JSON.stringify(obj));
};

const GraphEditor: React.FunctionComponent<IGraphEditorProps> = props => {
  const { store, onDoubleClick, onEdgesChange, onNodesChange, onConnectStart, onConnectEnd, onReactFlowInit } =
    useInteractive();
  const { nodes, edges, theme, collapsed, appMode, nodePositionChange } = store;

  const [state, updateState] = useState({
    isLocked: false,
  });

  const { isLight } = useStudioProvier();
  const isEmpty = nodes.length === 0;
  const rfBG = !isLight ? '#161616' : collapsed.left && collapsed.right ? '#fff' : '#f4f5f5';
  const description = (
    <FormattedMessage
      id="Start sketching a model, a vertex label is a named grouping or categorization of nodes within the graph dataset"
      values={{
        icon: <PlayCircleOutlined />,
      }}
    />
  );
  const IS_PURE = appMode === 'PURE';
  const _nodes = nodePositionChange.length === 0 ? nodes : applyNodeChanges(nodePositionChange, nodes);

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <div style={{ height: '100%', width: '100%', position: 'absolute' }}>
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
          zoomOnDoubleClick={false}
          nodesDraggable={true} // 禁用节点拖拽
          proOptions={{ hideAttribution: true }} // 隐藏 reactflow 标识
          onDoubleClick={onDoubleClick}
          minZoom={0.01}
          onInit={onReactFlowInit}
        >
          <ArrowMarker selectedColor={theme.primaryColor} color={!isLight ? '#d7d7d7' : '#000'} />

          {!IS_PURE && (
            <Background
              style={{
                // background: '#f4f5f5',
                background: rfBG,
              }}
            />
          )}
          {isEmpty && <EmptyCanvas description={description} isLight={!isLight} />}
          {!IS_PURE && <MiniMap style={{ backgroundColor: !isLight ? '#161616' : '' }} />}
        </ReactFlow>
      </div>
    </div>
  );
};

export default GraphEditor;
