import React, { useCallback, useEffect, useRef } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useReactFlow,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  MiniMap,
} from 'reactflow';
import { uuid } from 'uuidv4';
import EmptyCanvas from '../../components/EmptyCanvas';
import type { NodeChange, EdgeChange } from 'reactflow';
import { useContext, proxyStore } from '../useContext';
import { transformEdges } from '../elements';
import { nodeTypes } from '../elements/node-types';
import { edgeTypes } from '../elements/edge-types';
import dagre from 'dagre';
import ConnectionLine from '../elements/connection-line';

import ArrowMarker from '../elements/arrow-marker';
import AddNode from './add-node';

import { getBBox, createEdgeLabel, createNodeLabel } from '../utils';
const dagreGraph = new dagre.graphlib.Graph();

dagreGraph.setDefaultEdgeLabel(() => ({}));

interface IGraphEditorProps {}

const GraphEditor: React.FunctionComponent<IGraphEditorProps> = props => {
  const { store, updateStore } = useContext();
  const { screenToFlowPosition, setCenter, fitBounds } = useReactFlow();

  const { displayMode, nodes, edges, theme } = store;
  const connectingNodeId = useRef(null);

  const setEdges = _edges => {
    updateStore(draft => {
      draft.edges = transformEdges(_edges, displayMode);
    });
  };

  console.log('running...', edges);

  const onConnect = useCallback(params => {
    // reset the start node on connections
    console.log('onConnect');
    connectingNodeId.current = null;
    setEdges(eds => addEdge(params, eds));
  }, []);

  const onConnectStart = useCallback((_, { nodeId }) => {
    console.log('onConnectStart');
    connectingNodeId.current = nodeId;
  }, []);

  const onConnectEnd = useCallback(
    event => {
      console.log('onConnectEnd');
      if (!connectingNodeId.current) return;

      const targetIsPane = event.target.classList.contains('react-flow__pane');

      // 空白画板需要添加节点
      if (targetIsPane) {
        // we need to remove the wrapper bounds, in order to get the correct position
        const nodeId = uuid();
        const edgeId = uuid();
        /** 这里计算的 position 是 handle 的位置，对GraphNode 而言，就是圆心的坐标 */
        const newPosition = screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });
        const newNode = {
          id: nodeId,
          position: {
            x: newPosition.x - 50,
            y: newPosition.y - 50,
          },
          type: 'graph-node',
          data: { label: createNodeLabel() },
        };

        updateStore(draft => {
          draft.nodes.push(newNode);
          draft.edges.push({
            id: edgeId,
            source: connectingNodeId.current,
            target: nodeId,
            type: 'graph-edge',
            data: {
              label: createEdgeLabel(),
            },
          });
        });
      } else {
        const { nodeid } = event.target.dataset;
        console.log('event.target.dataset', event.target.dataset);

        const edgeId = uuid();
        const edgeLabel = createEdgeLabel();
        updateStore(draft => {
          draft.edges = transformEdges(
            [
              ...draft.edges,
              {
                id: edgeId,
                data: { label: edgeLabel },
                source: connectingNodeId.current,
                target: nodeid,
                type: 'graph-edge',
              },
            ],
            displayMode,
          );
        });
      }
    },
    [screenToFlowPosition],
  );

  useEffect(() => {
    console.log('fetching graph schema....');
    updateStore(draft => {
      draft.edges = []; //initalData.edges; // [];
      draft.nodes = []; //initalData.nodes; // [];
    });
  }, []);

  const onNodesChange = (changes: NodeChange[]) => {
    updateStore(draft => {
      draft.nodes = applyNodeChanges(changes, draft.nodes);
    });
  };
  const onEdgesChange = (changes: EdgeChange[]) => {
    updateStore(draft => {
      draft.edges = applyEdgeChanges(changes, draft.edges);
    });
  };
  const isEmpty = nodes.length === 0;
  const onDoubleClick = () => {
    const bbox = getBBox(proxyStore.nodes);
    fitBounds(bbox, { duration: 600 });
  };
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
          onConnect={onConnect}
          onConnectStart={onConnectStart}
          onConnectEnd={onConnectEnd}
          zoomOnDoubleClick={false}
          onDoubleClick={onDoubleClick}

          // fitView
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
