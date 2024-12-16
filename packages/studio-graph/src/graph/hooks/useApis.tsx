import { useContext } from '../useContext';
import { ForceGraphInstance } from '../types';
export const useApis = () => {
  const { store, updateStore } = useContext();
  const { graph } = store;

  const runCombos = (clusterKey: string) => {
    updateStore(draft => {
      draft.layout = {
        type: 'force-combo',
        options: {
          groupBy: clusterKey,
          reheatSimulation: true,
        },
      };
    });
  };

  const clearCombos = () => {
    updateStore(draft => {
      draft.combos = [];
      draft.layout = {
        type: 'force',
        options: {},
      };
    });
  };

  const focusNodes = (ids: string[]) => {
    if (graph) {
      const bbox = graph.getGraphBbox(node => {
        return ids.includes(node.id as string);
      });
      if (bbox) {
        const center = {
          x: (bbox.x[0] + bbox.x[1]) / 2,
          y: (bbox.y[0] + bbox.y[1]) / 2,
        };
        (graph as ForceGraphInstance).centerAt(center.x, center.y, 400);
      }
    }
  };

  return {
    runCombos,
    clearCombos,
    focusNodes,
  };
};
