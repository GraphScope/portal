import { useCallback, useEffect, useRef } from 'react';
import { useReactFlow, applyEdgeChanges, applyNodeChanges } from 'reactflow';
import { uuid } from 'uuidv4';
import { createStaticForceLayout } from '../elements/forceLayout';
import { fakeSnapshot } from '../utils/index';
const deepclone = obj => {
  return JSON.parse(JSON.stringify(obj));
};

import type { NodeChange, EdgeChange } from 'reactflow';
import { useContext } from '../useContext';
import { transformEdges } from '../elements';

import { getBBox, createEdgeLabel, createNodeLabel } from '../utils';
let timer: any = null;
const useInteractive: any = () => {
  const { store, updateStore } = useContext();
  const { screenToFlowPosition, fitBounds, fitView } = useReactFlow();
  const { displayMode, nodes, edges, hasLayouted, elementOptions } = store;
  const connectingNodeId = useRef(null);

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
            //@ts-ignore
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

        const edgeId = uuid();
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
    if (elementOptions.isConnectable) {
      updateStore(draft => {
        draft.nodes = applyNodeChanges(changes, deepclone(draft.nodes));
      });
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
        clearTimeout(timer);
        timer = setTimeout(() => {
          const bbox = getBBox(graph.nodes);
          fitBounds(bbox, { duration: 300 });
        }, 300);
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

  return {
    store,
    updateStore,
    onDoubleClick,
    onEdgesChange,
    onNodesChange,
    onConnectStart,
    onConnectEnd,
  };
};

export default useInteractive;
