import { useEffect } from 'react';
import { useContext, getDataMap } from '../../';

const useEdgeClick = () => {
  const { store, updateStore } = useContext();
  const { emitter, data, graph } = store;

  useEffect(() => {
    const handleClick = edge => {
      const { id, source, target } = edge;
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
