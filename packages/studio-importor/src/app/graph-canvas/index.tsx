import React, { useEffect } from 'react';
import { ReactFlow, Controls, Background, MiniMap } from 'reactflow';
import EmptyCanvas from '../../components/EmptyCanvas';
import { useContext } from '../useContext';
import { nodeTypes } from '../elements/node-types';
import { edgeTypes } from '../elements/edge-types';
import ConnectionLine from '../elements/connection-line';
import ArrowMarker from '../elements/arrow-marker';
import AddNode from './add-node';
import useInteractive from './useInteractive';

interface IGraphEditorProps {}

const GraphEditor: React.FunctionComponent<IGraphEditorProps> = props => {
  const { store, updateStore } = useContext();
  const { onDoubleClick, onEdgesChange, onNodesChange, onConnectStart, onConnectEnd } = useInteractive();

  const { nodes, edges, theme } = store;

  useEffect(() => {
    updateStore(draft => {
      draft.edges = []; //initalData.edges; // [];
      draft.nodes = []; //initalData.nodes; // [];
    });
  }, []);

  const isEmpty = nodes.length === 0;

  console.log('render.........>>>>>>', nodes);

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <div style={{ height: '100%', width: '100%' }}>
        <ReactFlow
          //@ts-ignore
          nodes={nodes}
          //@ts-ignore
          edges={edges}
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
          <Background />
          {isEmpty && <EmptyCanvas />}
          <MiniMap />
        </ReactFlow>
      </div>
    </div>
  );
};

export default GraphEditor;
