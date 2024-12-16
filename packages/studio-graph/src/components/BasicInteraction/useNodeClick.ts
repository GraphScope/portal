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
      console.log(slNodes, slEdges, inEdges, outEdges);
      if (node) {
        updateStore(draft => {
          draft.nodeStatus = slNodes;
          draft.edgeStatus = slEdges;
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
