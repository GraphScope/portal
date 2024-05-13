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
} from 'reactflow';
import type { NodeChange, EdgeChange, Node } from 'reactflow';
import { useContext } from '../useContext';
import { transformDataToReactFlow, transformEdges, transformNodes, transformGraphNodes } from '../utils';
import { nodeTypes } from '../utils/nodeTypes';
import { edgeTypes } from '../utils/edgesTypes';
import dagre from 'dagre';
import ConnectionLine from '../utils/connectionLine';
import { Button } from 'antd';

import { initalData } from '../const';
const dagreGraph = new dagre.graphlib.Graph();

dagreGraph.setDefaultEdgeLabel(() => ({}));

interface IGraphEditorProps {}

let nodeIndex = 1;
let edgeIndex = 1;
const getNodeId = () => `Vertex_${nodeIndex++}`;
const getEdgeId = () => `Edge_${edgeIndex++}`;

const GraphEditor: React.FunctionComponent<IGraphEditorProps> = props => {
  const { store, updateStore } = useContext();
  const { screenToFlowPosition } = useReactFlow();

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
        const newPosition = screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });
        const newNode = {
          id: nodeId,
          position: newPosition,
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
      draft.nodes.push({
        id,
        position: {
          x: Math.round(Math.random() * 400),
          y: Math.round(Math.random() * 400),
        },
        type: 'graph-node',
        data: { label: id },
      });
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
  return (
    <div>
      <Button onClick={handleAddVertex}>Add Vertex</Button>
      <div style={{ height: '500px', width: '100%' }}>
        <svg
          width="200"
          height="200"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: 'absolute', top: 0, left: 0, zIndex: -1 }}
        >
          <defs>
            <marker
              id="arrow"
              markerWidth="10"
              markerHeight="10"
              refX="8"
              refY="3"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path d="M0,0 L0,6 L9,3 z" fill="#ddd" />
            </marker>
            <marker
              id="arrow-selected"
              markerWidth="10"
              markerHeight="10"
              refX="8"
              refY="3"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path d="M0,0 L0,6 L9,3 z" fill={theme.primaryColor} />
            </marker>
          </defs>
        </svg>
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
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
};

export default GraphEditor;
