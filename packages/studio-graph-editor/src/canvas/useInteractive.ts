import { useCallback, useEffect, useRef } from 'react';
import { useReactFlow, applyEdgeChanges, applyNodeChanges, useOnSelectionChange } from 'reactflow';
import { v4 as uuidv4 } from 'uuid';
import { createStaticForceLayout } from '../elements/forceLayout';

const deepclone = obj => {
  return JSON.parse(JSON.stringify(obj));
};

import type { NodeChange, EdgeChange } from 'reactflow';
import { useContext } from './useContext';
import { transformEdges } from '../elements';

import { getBBox, createEdgeLabel, createNodeLabel } from '../elements/utils';
import { Utils } from '@graphscope/studio-components';
import { useGraphContext } from '..';
import { ISchemaEdge } from '../types/edge';
import _ from 'lodash';
const { fakeSnapshot } = Utils;
let timer: any = null;
const useInteractive: any = () => {
  const { store, updateStore } = useContext();
  const { screenToFlowPosition, fitBounds, fitView } = useReactFlow();
  const { displayMode, nodes, edges, hasLayouted, elementOptions } = store;
  const connectingNodeId = useRef(null);
  const {
    onNodesChange: handleNodesChange,
    onEdgesChange: handleEdgesChange,
    onSelectionChange,
    disabled,
    noDefaultLabel,
  } = useGraphContext();

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
          data: { label: noDefaultLabel ? '' : createNodeLabel() },
        };
        const newEgde = {
          id: edgeId,
          //@ts-ignore
          source: connectingNodeId.current,
          target: nodeId,
          type: 'graph-edge',
          data: {
            label: noDefaultLabel ? '' : createEdgeLabel(),
          },
        };

        // handleEdgesChange && handleEdgesChange([...fakeSnapshot(edges), newEgde]);
        // handleNodesChange && handleNodesChange([...fakeSnapshot(nodes), newNode]);
        // console.log(
        //   'handleChange 时的 edges 和 nodes',
        //   [...fakeSnapshot(edges), newEgde],
        //   [...fakeSnapshot(nodes), newNode],
        // );

        updateStore(draft => {
          draft.nodes.push(newNode);
          draft.edges.push({
            id: edgeId,
            //@ts-ignore
            source: connectingNodeId.current,
            target: nodeId,
            type: 'graph-edge',
            data: {
              label: noDefaultLabel ? '' : createEdgeLabel(),
            },
          });
        });
      } else {
        const { nodeid } = event.target.dataset;

        const edgeId = uuidv4();
        const edgeLabel = createEdgeLabel();

        updateStore(draft => {
          // 可能存在多边，所以需要走一遍 transform 函数
          const newEdges = transformEdges(
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
          // handleEdgesChange && handleEdgesChange(newEdges);
          draft.edges = newEdges;
        });
      }
    },
    [screenToFlowPosition],
  );

  const onNodesChange = (changes: NodeChange[]) => {
    if (disabled) return;
    const { type } = changes[0];
    // console.log(changes);

    if (elementOptions.isConnectable || type === 'position') {
      updateStore(draft => {
        const newNodes = applyNodeChanges(changes, deepclone(draft.nodes));
        handleNodesChange && handleNodesChange(newNodes);
        const isEqual = _.isEqual(draft.nodes, newNodes);
        if (!isEqual) draft.nodes = newNodes;
      });
    }
  };

  useOnSelectionChange({
    onChange: useCallback(
      ({ nodes, edges }) => {
        onSelectionChange && onSelectionChange(nodes, edges as unknown as ISchemaEdge[]);
      },
      [onSelectionChange],
    ),
  });
  const onEdgesChange = (changes: EdgeChange[]) => {
    if (disabled) return;

    if (elementOptions.isConnectable) {
      updateStore(draft => {
        const newEdges = applyEdgeChanges(changes, deepclone(draft.edges));
        // handleEdgesChange && handleEdgesChange(newEdges as unknown as ISchemaEdge[]);
        draft.edges = newEdges;
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
    // console.log('监听时的 edges 和 nodes', JSON.stringify(edges), '\n', JSON.stringify(nodes));
    handleEdgesChange && handleEdgesChange(edges);
    handleNodesChange && handleNodesChange(nodes);
  }, [edges, nodes]);

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
