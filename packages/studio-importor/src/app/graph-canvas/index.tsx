import React, { useState } from 'react';
import { ReactFlow, Controls, Background, MiniMap } from 'reactflow';
import { EmptyCanvas, useStudioProvier } from '@graphscope/studio-components';
import { nodeTypes } from '../elements/node-types';
import { edgeTypes } from '../elements/edge-types';
import ConnectionLine from '../elements/connection-line';
import ArrowMarker from '../elements/arrow-marker';
import { PlayCircleOutlined } from '@ant-design/icons';

import useInteractive from './useInteractive';
import { FormattedMessage } from 'react-intl';

import CustomControls from './CustomControls';
interface IGraphEditorProps {}

const fakeSnapshot = obj => {
  return JSON.parse(JSON.stringify(obj));
};

const GraphEditor: React.FunctionComponent<IGraphEditorProps> = props => {
  const { store, onDoubleClick, onEdgesChange, onNodesChange, onConnectStart, onConnectEnd } = useInteractive();
  const { nodes, edges, theme, collapsed, appMode } = store;
  const [state, updateState] = useState({
    isLocked: false,
  });
  const { isLocked } = state;
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

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <div style={{ height: '100%', width: '100%', position: 'absolute' }}>
        <ReactFlow
          nodes={fakeSnapshot(nodes)}
          //@ts-ignore
          edges={fakeSnapshot(edges)}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          connectionLineComponent={ConnectionLine}
          onConnectStart={onConnectStart}
          onConnectEnd={onConnectEnd}
          zoomOnDoubleClick={false}
          nodesDraggable={isLocked} // 禁用节点拖拽
          proOptions={{ hideAttribution: true }} // 隐藏 reactflow 标识
          // onDoubleClick={onDoubleClick}
        >
          <ArrowMarker selectedColor={theme.primaryColor} color={!isLight ? '#d7d7d7' : '#000'} />
          {!IS_PURE && (
            <CustomControls
              isLocked={isLocked}
              handleLocked={val => {
                updateState(preset => {
                  return { ...preset, isLocked: val };
                });
              }}
            />
          )}
          <Background
            style={{
              // background: '#f4f5f5',
              background: rfBG,
            }}
          />
          {isEmpty && <EmptyCanvas description={description} />}
          {!IS_PURE && <MiniMap style={{ backgroundColor: !isLight ? '#161616' : '' }} />}
        </ReactFlow>
      </div>
    </div>
  );
};

export default GraphEditor;
