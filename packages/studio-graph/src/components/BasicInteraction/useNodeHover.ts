import { useEffect } from 'react';
import { useContext } from '../..';

const useNodeHover = () => {
  const { store, updateStore } = useContext();
  const { emitter, data, graph } = store;

  useEffect(() => {
    if (emitter && graph) {
      emitter.on('node:hover', ({ node, prevNode }: any) => {
        if (prevNode) {
          const { id } = prevNode;
          updateStore(draft => {
            const prevStyle = draft.nodeStatus[id] || {};
            draft.nodeStatus[id] = {
              ...prevStyle,
              hovering: false,
            };
          });
        }
        if (node) {
          const { id } = node;
          updateStore(draft => {
            const prevStyle = draft.nodeStatus[id] || {};
            draft.nodeStatus[id] = {
              ...prevStyle,
              hovering: true,
            };
          });
        }
      });
    }
    return () => {
      emitter?.off('node:hover');
    };
  }, [emitter, data, graph]);
};

export default useNodeHover;
