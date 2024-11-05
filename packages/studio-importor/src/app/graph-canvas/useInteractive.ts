import { useCallback, useEffect, useRef } from 'react';
import { useReactFlow, applyEdgeChanges, applyNodeChanges } from 'reactflow';
import { v4 as uuidv4 } from 'uuid';
import { createStaticForceLayout } from '../elements/forceLayout';
import { fakeSnapshot } from '../utils/index';
const deepclone = obj => {
  return JSON.parse(JSON.stringify(obj));
};

import type { NodeChange, EdgeChange, NodePositionChange } from 'reactflow';
import { useContext } from '@graphscope/use-zustand';
import { transformEdges } from '../elements';

import { getBBox, createEdgeLabel, createNodeLabel } from '../utils';

const useInteractive: any = () => {
  const { store, updateStore } = useContext();
  const { screenToFlowPosition, fitBounds, fitView } = useReactFlow();
  const { displayMode, nodes, edges, hasLayouted, elementOptions } = store;
  const connectingNodeId = useRef(null);
  const timerRef = useRef<any>(null);
  const tempRef = useRef<any>(null);

  const onConnectStart = useCallback((_, { nodeId }) => {
    connectingNodeId.current = nodeId;
    if (!elementOptions.isConnectable) return;
  }, []);

  const onConnectEnd = useCallback(
    event => {
      if (!connectingNodeId.current) return;
      if (!elementOptions.isConnectable) return;

      const targetIsPane = event.target.classList.contains('react-flow__pane');

      // 空白画板需要添加节点
      if (targetIsPane) {
        // we need to remove the wrapper bounds, in order to get the correct position
        const nodeId = uuidv4();
        const edgeId = uuidv4();
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
          draft.nodes = [...draft.nodes, newNode];
          draft.edges = [
            ...draft.edges,
            {
              id: edgeId,
              //@ts-ignore
              source: connectingNodeId.current,
              target: nodeId,
              type: 'graph-edge',
              data: {
                label: createEdgeLabel(),
              },
            },
          ];
        });
      } else {
        const { nodeid } = event.target.dataset;

        const edgeId = uuidv4();
        const edgeLabel = createEdgeLabel();

        updateStore(draft => {
          // 可能存在多边，所以需要走一遍 transform 函数
          draft.edges = transformEdges(
            [
              ...draft.edges,
              {
                id: edgeId,
                data: {
                  label: edgeLabel,
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
    [screenToFlowPosition],
  );

  const onNodesChange = (changes: NodeChange[]) => {
    const { type } = changes[0];

    if (elementOptions.isConnectable && type !== 'position') {
      updateStore(draft => {
        draft.nodes = applyNodeChanges(changes, deepclone(draft.nodes));
      });
    }
    if (type === 'position') {
      if (changes[0].dragging) {
        tempRef.current = changes;
        updateStore(draft => {
          draft.nodePositionChange = changes as NodePositionChange[];
        });
      } else {
        // 需要在拖拽结束后，更新一次位置到 nodes
        updateStore(draft => {
          draft.nodes = applyNodeChanges(tempRef.current, draft.nodes);
        });
      }
    }
  };
  const onEdgesChange = (changes: EdgeChange[]) => {
    if (elementOptions.isConnectable) {
      updateStore(draft => {
        //@ts-ignore
        draft.edges = applyEdgeChanges(changes, deepclone(draft.edges));
      });
    }
  };

  const onDoubleClick = () => {
    //@ts-ignore
    const bbox = getBBox(nodes);
    fitBounds(bbox, { duration: 600 });
  };

  useEffect(() => {
    if (nodes.length > 0) {
      // 交互
      // if (hasLayouted) {
      //   onDoubleClick();
      // }
      // 布局
      if (!hasLayouted) {
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
    }
  }, [nodes, edges, hasLayouted]);
  useEffect(() => {
    /** 把marker 放到 reactflow 内部，目的是为了导出的时候 dom 不丢失 */
    const marker = document.getElementById('arrow-marker-svg');
    const view = document.querySelector('.react-flow__viewport');
    if (marker && view) {
      view.appendChild(marker);
    }
  }, []);

  const onReactFlowInit = reactFlowInstance => {
    if (reactFlowInstance) {
      const allNodes = reactFlowInstance.toObject().nodes;
      const bbox = getBBox(allNodes);
      fitBounds(bbox, { duration: 600 });
    }
  };

  return {
    store,
    updateStore,
    onDoubleClick,
    onEdgesChange,
    onNodesChange,
    onConnectStart,
    onConnectEnd,
    onReactFlowInit,
  };
};

export default useInteractive;
