import React, { useCallback, useEffect, useRef } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Position,
  useReactFlow,
  addEdge,
  ReactFlowProvider,
  applyEdgeChanges,
  applyNodeChanges,
  MiniMap,
} from 'reactflow';
import EmptyCanvas from '../../components/EmptyCanvas';
import type { NodeChange, EdgeChange, Node } from 'reactflow';
import { useContext } from '../useContext';
import { transformEdges, transformGraphNodes } from '../elements';
import { nodeTypes } from '../elements/node-types';
import { edgeTypes } from '../elements/edge-types';
import dagre from 'dagre';
import ConnectionLine from '../elements/connection-line';
import { Button } from 'antd';
import ArrowMarker from '../elements/arrow-marker';

import { initalData } from '../const';
const dagreGraph = new dagre.graphlib.Graph();

dagreGraph.setDefaultEdgeLabel(() => ({}));

interface IGraphEditorProps {}

let nodeIndex = 1;
let edgeIndex = 1;
let addNodeIndex = 0;
const getNodeId = () => `Vertex_${nodeIndex++}`;
const getEdgeId = () => `Edge_${edgeIndex++}`;

const GraphEditor: React.FunctionComponent<IGraphEditorProps> = props => {
  const { store, updateStore } = useContext();
  const { screenToFlowPosition, setCenter } = useReactFlow();

  const { displayMode, nodes, edges, theme } = store;
  const connectingNodeId = useRef(null);
  const setNodes = _nodes => {
    updateStore(draft => {
      draft.nodes = transformGraphNodes(_nodes, displayMode);
    });
  };
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
        const nodeId = getNodeId();
        const edgeId = getEdgeId();
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
          data: { label: nodeId },
          // origin: [-0.5, -0.5],
        };

        // setNodes(nds => nds.concat(newNode));
        // setEdges(eds => eds.concat({ id, source: connectingNodeId.current, target: id, type: 'graph-edge' }));
        updateStore(draft => {
          draft.nodes.push(newNode);
          draft.edges.push({ id: edgeId, source: connectingNodeId.current, target: nodeId, type: 'graph-edge' });
        });
      } else {
        const { nodeid } = event.target.dataset;
        console.log('event.target.dataset', event.target.dataset);
        const edgeId = getEdgeId();
        updateStore(draft => {
          draft.edges = transformEdges(
            [
              ...draft.edges,
              {
                id: edgeId,
                data: { label: edgeId },
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

  const handleAddVertex = () => {
    updateStore(draft => {
      const id = getNodeId();
      const x = addNodeIndex * 200;
      const y = addNodeIndex * 100;
      addNodeIndex++;
      draft.nodes.push({
        id,
        position: {
          x,
          y,
        },
        type: 'graph-node',
        data: { label: id },
      });
      setCenter(x + 100 / 2, y + 100 / 2, { duration: 600, zoom: 1 });
    });
  };

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
          // fitView
        >
          <ArrowMarker selectedColor={theme.primaryColor} />
          <Button onClick={handleAddVertex} style={{ position: 'absolute', top: '0px', left: '0px', zIndex: 999 }}>
            Add Vertex
          </Button>
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
