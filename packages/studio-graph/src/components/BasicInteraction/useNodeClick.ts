import { useEffect } from 'react';
import { useContext, getDataMap } from '../../';

const useNodeClick = () => {
  const { store, updateStore } = useContext();
  const { emitter, data, graph } = store;

  useEffect(() => {
    const dataMap = getDataMap(data);
    const handleClick = (node: any) => {
      const { id } = node;

      const {
        outNeighbors = [],
        outEdges = [],
        neighbors = [],
        inEdges = [],
        inNeighbors = [],
      } = dataMap.get(id) || {};

      const slNodes = neighbors.reduce(
        (acc, curr) => {
          return {
            ...acc,
            [curr]: { hovering: true },
          };
        },
        {
          [id]: { selected: true },
        },
      );
      const slEdges = [...new Set([...outEdges, ...inEdges])].reduce((acc, curr) => {
        return {
          ...acc,
          [curr]: { selected: true },
        };
      }, {});

      if (node) {
        updateStore(draft => {
          /** 让所有的点和边进入 disabled 状态 */
          draft.data.nodes.forEach(node => {
            draft.nodeStatus[node.id] = {
              disabled: true,
            };
          });
          draft.data.edges.forEach(edge => {
            draft.edgeStatus[edge.id] = {
              disabled: true,
            };
          });
          /** 设置关联的点边为 selected 状态 */
          draft.nodeStatus = {
            ...draft.nodeStatus,
            ...slNodes,
          };
          draft.edgeStatus = {
            ...draft.edgeStatus,
            ...slEdges,
          };
          // draft.edgeStatus = slEdges;
          draft.selectNodes = [node];
        });
      }
    };
    emitter?.on('node:click', handleClick);
    return () => {
      emitter?.off('node:click', handleClick);
    };
  }, [emitter, data, graph]);
};

export default useNodeClick;
