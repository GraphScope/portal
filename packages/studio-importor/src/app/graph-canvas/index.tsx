import React, { useEffect } from 'react';
import { ReactFlow, Controls, Background, MiniMap } from 'reactflow';
import { EmptyCanvas } from '@graphscope/studio-components';
import { nodeTypes } from '../elements/node-types';
import { edgeTypes } from '../elements/edge-types';
import ConnectionLine from '../elements/connection-line';
import ArrowMarker from '../elements/arrow-marker';

import useInteractive from './useInteractive';

interface IGraphEditorProps {}

const fakeSnapshot = obj => {
  return JSON.parse(JSON.stringify(obj));
};

const GraphEditor: React.FunctionComponent<IGraphEditorProps> = props => {
  const { store, updateStore, onDoubleClick, onEdgesChange, onNodesChange, onConnectStart, onConnectEnd } =
    useInteractive();
  const { nodes, edges, theme, collapsed } = store;

  const isEmpty = nodes.length === 0;

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
          onDoubleClick={onDoubleClick}
        >
          <ArrowMarker selectedColor={theme.primaryColor} />
          <Controls
            style={{
              gap: '4px',
              boxShadow:
                '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
            }}
          />
          <Background
            style={{
              // background: '#f4f5f5',
              background: collapsed.left && collapsed.right ? '#fff' : '#f4f5f5',
            }}
          />
          {isEmpty && <EmptyCanvas />}
          <MiniMap />
        </ReactFlow>
      </div>
    </div>
  );
};

export default GraphEditor;
