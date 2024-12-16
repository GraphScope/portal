import { useEffect } from 'react';
import { useContext, getDataMap } from '../../';

const useEdgeClick = () => {
  const { store, updateStore } = useContext();
  const { emitter, data, graph } = store;

  useEffect(() => {
    const dataMap = getDataMap(data);
    const handleClick = edge => {
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
          draft.selectEdges = [edge];
        });
      }
    };

    emitter?.on('edge:click', handleClick);
    return () => {
      emitter?.off('edge:click', handleClick);
    };
  }, [emitter, data, graph]);
};

export default useEdgeClick;
