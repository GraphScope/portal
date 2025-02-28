import { useEffect } from 'react';
import { useContext, getDataMap } from '../../';

let isCtrlPressed = false;

const useNodeClick = () => {
  const { store, updateStore } = useContext();
  const { emitter, data, graph } = store;

  useEffect(() => {
    const dataMap = getDataMap(data);

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Shift') {
        isCtrlPressed = true;
      }
    };
    const handleKeyup = (event: KeyboardEvent) => {
      if (event.key === 'Shift') {
        isCtrlPressed = false;
      }
    };

    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('keyup', handleKeyup);

    const handleClick = (node: any) => {
      if (!node) {
        return;
      }
      const { id } = node;

      if (isCtrlPressed) {
        //多选模式
        updateStore(draft => {
          /** 让所有的点和边进入 disabled 状态 */
          draft.data.nodes.forEach(node => {
            draft.nodeStatus[node.id] = {
              disabled: true,
            };
          });
          /** 边状态置灰 */
          draft.data.edges.forEach(edge => {
            draft.edgeStatus[edge.id] = {
              disabled: true,
            };
          });

          const sIds = draft.selectNodes.map(item => item.id);
          const overlap = sIds.includes(id);
          const _slNodes = overlap ? draft.selectNodes.filter(item => item.id !== id) : [...draft.selectNodes, node];

          draft.selectNodes = _slNodes;
          _slNodes.forEach(item => {
            draft.nodeStatus[item.id] = {
              selected: true,
              disabled: false,
            };
          });
        });
        return;
      }

      // 单选模式，要考虑关联的点和边
      const { outEdges = [], neighbors = [], inEdges = [] } = dataMap.get(id) || {};
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
        draft.selectEdges = [];
      });
    };
    emitter?.on('node:click', handleClick);
    return () => {
      emitter?.off('node:click', handleClick);
      document.removeEventListener('keydown', handleKeydown);
      document.removeEventListener('keyup', handleKeyup);
    };
  }, [emitter, data, graph]);
};

export default useNodeClick;
