import React, { useState } from 'react';
import { ReactFlow, Controls, Background, MiniMap, applyNodeChanges } from 'reactflow';
import { EmptyCanvas, useThemeProvider } from '@graphscope/studio-components';
import { nodeTypes } from '../elements/node-types';
import { edgeTypes } from '../elements/edge-types';
import ConnectionLine from '../elements/connection-line';
import ArrowMarker from '../elements/arrow-marker';
import { PlayCircleOutlined } from '@ant-design/icons';
import { theme } from 'antd';

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
  const { nodes, edges, collapsed, appMode, nodePositionChange } = store;

  const [state, updateState] = useState({
    isLocked: false,
  });

  const { token } = theme.useToken();

  const isEmpty = nodes.length === 0;

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
          zoomOnDoubleClick={false}
          nodesDraggable={true} // 禁用节点拖拽
          proOptions={{ hideAttribution: true }} // 隐藏 reactflow 标识
          onDoubleClick={onDoubleClick}
          minZoom={0.01}
          onInit={onReactFlowInit}
        >
          <ArrowMarker />
          {!IS_PURE && <Background style={{ background: token.colorBgBase }} />}
          {isEmpty && <EmptyCanvas description={description} />}
          {!IS_PURE && <MiniMap style={{ backgroundColor: token.colorBgBase }} />}
        </ReactFlow>
      </div>
    </div>
  );
};

export default GraphEditor;
