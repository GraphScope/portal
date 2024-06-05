import { useCallback, useEffect, useRef } from 'react';
import { useReactFlow, applyEdgeChanges, applyNodeChanges } from 'reactflow';
import { uuid } from 'uuidv4';
const deepclone = obj => {
  return JSON.parse(JSON.stringify(obj));
};

import type { NodeChange, EdgeChange } from 'reactflow';
import { useContext } from '../useContext';
import { transformEdges } from '../elements';

import { getBBox, createEdgeLabel, createNodeLabel } from '../utils';

const useInteractive: any = () => {
  const { store, updateStore } = useContext();
  const { screenToFlowPosition, fitBounds } = useReactFlow();
  const { displayMode } = store;
  const connectingNodeId = useRef(null);

  const onConnectStart = useCallback((_, { nodeId }) => {
    connectingNodeId.current = nodeId;
  }, []);

  const onConnectEnd = useCallback(
    event => {
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
          // //如果移除这个，会导致节点无法再次拖拽
          // draft.nodes = [...draft.nodes];
        });
      }
    },
    [screenToFlowPosition],
  );

  const onNodesChange = (changes: NodeChange[]) => {
    updateStore(draft => {
      draft.nodes = applyNodeChanges(changes, deepclone(draft.nodes));
    });
  };
  const onEdgesChange = (changes: EdgeChange[]) => {
    updateStore(draft => {
      draft.edges = applyEdgeChanges(changes, deepclone(draft.edges));
    });
  };

  const onDoubleClick = () => {
    //@ts-ignore
    const bbox = getBBox(store.nodes);
    fitBounds(bbox, { duration: 600 });
  };
  useEffect(() => {
    if (store.nodes.length > 0) {
      onDoubleClick();
    }
  }, [store.nodes]);

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
