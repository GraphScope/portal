import { useContext } from '../useContext';
import { ForceGraphInstance } from '../types';
export const useApis = () => {
  const { store, updateStore } = useContext();
  const { graph, width, height } = store;

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
      const isSingle = ids.length === 1;
      const padding = isSingle ? height / 2.5 : 10;

      if (bbox) {
        const center = {
          x: (bbox.x[0] + bbox.x[1]) / 2,
          y: (bbox.y[0] + bbox.y[1]) / 2,
        };
        const zoomK = Math.max(
          1e-5,
          Math.min(
            1e5,
            (width - padding * 2) / (bbox.x[1] - bbox.x[0]),
            (height - padding * 2) / (bbox.y[1] - bbox.y[0]),
          ),
        );

        (graph as ForceGraphInstance).centerAt(center.x, center.y, 400);

        (graph as ForceGraphInstance).zoom(isSingle ? 14 : zoomK, 400);
      }
    }
  };

  return {
    runCombos,
    clearCombos,
    focusNodes,
  };
};
