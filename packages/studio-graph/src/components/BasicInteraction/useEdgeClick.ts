import { useEffect } from 'react';
import { useContext, getDataMap } from '../../';

const useEdgeClick = () => {
  const { store, updateStore } = useContext();
  const { emitter, data, graph } = store;

  useEffect(() => {
    if (emitter && graph) {
      const dataMap = getDataMap(data);
      emitter.on('edge:click', (edge: any) => {
        const { id } = edge;
        const { source, target } = dataMap.get(id) || {};

        if (edge && source && target) {
          updateStore(draft => {
            draft.nodeStatus = {
              [source.id]: { hovering: true },
              [target.id]: { hovering: true },
            };
            draft.edgeStatus = {
              [id]: { selected: true },
            };
          });
        }
      });
    }
    return () => {
      emitter?.off('edge:click');
    };
  }, [emitter, data, graph]);
};

export default useEdgeClick;
