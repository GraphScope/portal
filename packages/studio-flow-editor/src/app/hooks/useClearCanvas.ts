import { useGraphStore } from '../store';
import { resetIndex } from '../utils';

export const useClearCanvas = () => {
  const { updateStore } = useGraphStore();

  const handleClear = () => {
    resetIndex();
    updateStore(draft => {
      draft.nodes = [];
      draft.edges = [];
    });
  };

  return { handleClear };
};