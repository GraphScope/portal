import { useContext } from '../useContext';
import { useEffect } from 'react';
import { ForceGraphInstance } from '../types';
import { renderCombo } from '../custom-combo/render';
export const useCombos = () => {
  const { store } = useContext();
  const { graph, combos } = store;

  useEffect(() => {
    if (graph) {
      if (combos.length === 0) {
        /** 关闭聚类 */
        if ((graph as ForceGraphInstance).onRenderFramePost) {
          (graph as ForceGraphInstance).onRenderFramePost(() => {});
        }
      } else {
        /** 数据驱动，开启聚类 */
        renderCombo(graph as ForceGraphInstance, combos);
      }
    }
  }, [combos, graph]);
};
