import { useContext } from './useContext';
import { useEffect } from 'react';
import { getDataMap } from './utils';
const useNodeClick = () => {
  const { store, updateStore } = useContext();
  const { emitter, data, graph } = store;

  useEffect(() => {
    if (emitter && graph) {
      const dataMap = getDataMap(data);

      emitter.on('node:click', (node: any) => {
        const { id } = node;

        const { outNeighbors, outEdges } = dataMap.get(id);

        const slNodes = outNeighbors.reduce(
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
        const slEdges = outEdges.reduce((acc, curr) => {
          return {
            ...acc,
            [curr]: { selected: true },
          };
        }, {});
        if (node) {
          updateStore(draft => {
            draft.nodeStatus = slNodes;
            draft.edgeStatus = slEdges;
          });
        }
      });
    }
    return () => {
      emitter?.off('node:click');
    };
  }, [emitter, data, graph]);
};

export default useNodeClick;
