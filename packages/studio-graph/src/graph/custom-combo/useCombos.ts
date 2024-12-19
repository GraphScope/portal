import { useContext } from '../../hooks/useContext';
import { getGroups } from './utils';
import { Utils } from '@graphscope/studio-components';
import { ForceGraphInstance } from 'force-graph';
const useCombos = () => {
  const { store, updateStore } = useContext();
  const { graph, render, nodeStyle, width, height } = store;
  const data = Utils.fakeSnapshot(store.data);

  const runCombos = (clusterKey: string) => {
    (graph as ForceGraphInstance).zoom(1);
    const { groups } = getGroups(data.nodes, {
      width: width,
      height: height,
      //@ts-ignore
      screen2GraphCoords: render === '2D' ? graph.screen2GraphCoords : (x, y) => ({ x, y }),
      nodeStyle,
      clusterKey,
    });

    updateStore(draft => {
      draft.combos = groups;
      draft.enableCombo = true;
      draft.combosByKey = clusterKey;
      draft.reheatSimulation = true;
    });
  };

  const clearCombos = () => {
    updateStore(draft => {
      draft.combos = [];
      draft.enableCombo = false;
      draft.reheatSimulation = false;
    });
  };

  return {
    runCombos,
    clearCombos,
  };
};

export default useCombos;
