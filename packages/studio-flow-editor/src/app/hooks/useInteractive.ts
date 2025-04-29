import { useCallback, useEffect, useRef } from 'react';
import {
  useReactFlow,
  applyEdgeChanges,
  applyNodeChanges,
  getNodesBounds,
  ReactFlowInstance,
  OnConnectStartParams,
  OnConnectEnd,
  useOnSelectionChange,
} from 'reactflow';
import { v4 as uuidv4 } from 'uuid';
import { createStaticForceLayout } from '../elements/forceLayout';
import { transformEdges } from '../elements';
import { fakeSnapshot } from '../utils/index';
import type { NodeChange, EdgeChange, NodePositionChange } from 'reactflow';
import { useGraphStore } from '../store';
import { ISchemaEdge } from '../types';
import { getBBox, createEdgeLabel, createNodeLabel } from '../utils';

const useInteractive = props => {
  const { store, updateStore } = useGraphStore();
  const { handleNodesChange, handleEdgesChange, onSelectionChange, isPreview, noDefaultLabel } = props;
  const { nodes, edges, nodePositionChange, hasLayouted, elementOptions, displayMode } = store;
  const { screenToFlowPosition, fitBounds } = useReactFlow();
  const connectingNodeId = useRef<string | null>(null);
  const timerRef = useRef<any>(null);
  const tempRef = useRef<any>([]);

  const onConnectStart = useCallback(
    (_: any, { nodeId }: OnConnectStartParams) => {
      connectingNodeId.current = nodeId;
      if (!elementOptions.isConnectable) return;
    },
    [elementOptions.isConnectable],
  );

  const onConnectEnd: OnConnectEnd = useCallback(
    event => {
      if (!connectingNodeId.current) return;
      if (!elementOptions.isConnectable) return;

      const target = event.target as HTMLElement;
      const targetIsPane = target.classList.contains('react-flow__pane');
      if (targetIsPane) {
        const nodeId = uuidv4();
        const edgeId = uuidv4();
        const position =
          'clientX' in event
            ? {
                x: event.clientX,
                y: event.clientY,
              }
            : {
                x: event.touches[0].clientX,
                y: event.touches[0].clientY,
              };
        const newPosition = screenToFlowPosition(position);
        const newNode = {
          id: nodeId,
          position: {
            x: newPosition.x - 50,
            y: newPosition.y - 50,
          },
          type: 'graph-node',
          data: { label: noDefaultLabel ? '' : createNodeLabel() },
        };

        updateStore(draft => {
          draft.nodes = [...nodes, newNode];
          draft.edges = [
            ...edges,
            {
              id: edgeId,
              source: connectingNodeId.current || '',
              target: nodeId,
              type: 'graph-edge',
              data: {
                label: noDefaultLabel ? '' : createEdgeLabel(),
              },
            },
          ];
        });
      } else {
        const nodeid = target.dataset.nodeid;
        if (!nodeid) return;
        const edgeId = uuidv4();
        const edgeLabel = createEdgeLabel();

        updateStore(draft => {
          draft.edges = transformEdges(
            [
              ...draft.edges,
              {
                id: edgeId,
                data: {
                  label: noDefaultLabel ? '' : edgeLabel,
                },
                source: connectingNodeId.current || '',
                target: nodeid,
              },
            ],
            displayMode,
          );
        });
      }
    },
    [screenToFlowPosition, elementOptions.isConnectable, nodes, edges, updateStore],
  );

  const onNodesChange = (changes: NodeChange[]) => {
    if (isPreview) {
      return;
    }
    const { type } = changes[0];

    if (elementOptions.isConnectable && type !== 'position') {
      updateStore(draft => {
        const newNodes = applyNodeChanges(changes, fakeSnapshot(nodes));
        draft.nodes = newNodes;
        if (handleNodesChange) {
          handleNodesChange(newNodes);
        }
      });
    }

    if (type === 'position') {
      if (changes[0].dragging) {
        tempRef.current = changes;
        updateStore(draft => {
          draft.nodePositionChange = changes as NodePositionChange[];
        });
      } else {
        updateStore(draft => {
          const newNodes = applyNodeChanges(tempRef.current, nodes);
          draft.nodes = newNodes;
          if (handleNodesChange) {
            handleNodesChange(newNodes);
          }
        });
      }
    }
  };

  useOnSelectionChange({
    onChange: useCallback(
      ({ nodes, edges }) => {
        updateStore(draft => {
          draft.selectedNodeIds = nodes.map(node => node.id);
          draft.selectedEdgeIds = edges.map(edge => edge.id);
        });
        onSelectionChange && onSelectionChange(nodes, edges as unknown as ISchemaEdge[]);
      },
      [onSelectionChange],
    ),
  });
  const onEdgesChange = (changes: EdgeChange[]) => {
    if (isPreview) return;
    if (elementOptions.isConnectable) {
      updateStore(draft => {
        draft.edges = applyEdgeChanges(changes, fakeSnapshot(edges)) as typeof edges;
      });
    }
  };

  const onDoubleClick = () => {
    const bbox = getBBox(nodes);
    fitBounds(bbox, { duration: 600 });
  };

  useEffect(() => {
    if (handleEdgesChange) {
      handleEdgesChange(edges);
      console.log('handleEdgesChange edges::: ', edges);
    }
    if (handleNodesChange) {
      handleNodesChange(nodes);
    }
  }, [edges, nodes]);

  useEffect(() => {
    if (nodes.length > 0 && !hasLayouted) {
      const graph = createStaticForceLayout(fakeSnapshot(nodes), fakeSnapshot(edges));
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      const timerId = setTimeout(() => {
        const bbox = getBBox(graph.nodes);
        fitBounds(bbox, { duration: 300 });
      }, 300);
      timerRef.current = timerId;
      updateStore(draft => {
        draft.hasLayouted = true;
        draft.nodes = graph.nodes;
        draft.edges = graph.edges;
      });
    }
  }, [nodes, edges, hasLayouted, updateStore]);

  const onReactFlowInit = (reactFlowInstance: ReactFlowInstance) => {
    if (reactFlowInstance) {
      setTimeout(() => {
        const allNodes = reactFlowInstance.toObject().nodes;
        const bbox = getNodesBounds(allNodes);
        fitBounds(bbox, { duration: 600 });
      }, 300);
    }
  };

  useEffect(() => {
    /** 把marker 放到 reactflow 内部，目的是为了导出的时候 dom 不丢失 */
    const marker = document.getElementById('arrow-marker-svg');
    const view = document.querySelector('.react-flow__viewport');
    if (marker && view) {
      view.appendChild(marker);
    }
  }, []);

  return {
    nodes,
    edges,
    nodePositionChange,
    onDoubleClick,
    onEdgesChange,
    onNodesChange,
    onConnectStart,
    onConnectEnd,
    onReactFlowInit,
  };
};

export default useInteractive;
