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
    console.log('fetching graph schema....');
    updateStore(draft => {
      draft.edges = []; //initalData.edges; // [];
      draft.nodes = []; //initalData.nodes; // [];
    });
  }, []);

  const isEmpty = nodes.length === 0;

  console.log('render.........>>>>>>');

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <div style={{ height: '100%', width: '100%' }}>
        <ReactFlow
          nodes={nodes}
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
          <AddNode style={{ position: 'absolute', top: '70px', left: '0px', zIndex: 999 }} />
          <Controls />
          <Background />
          {isEmpty && <EmptyCanvas />}
          <MiniMap />
        </ReactFlow>
      </div>
    </div>
  );
};

export default GraphEditor;
