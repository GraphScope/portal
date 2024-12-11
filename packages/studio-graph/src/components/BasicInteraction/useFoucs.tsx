import { useEffect, useRef } from 'react';
import { useContext } from '../../';
import { ForceGraphInstance } from 'force-graph';
export const useFoucs = () => {
  const { store } = useContext();
  const { graph, focusNodes } = store;
  let timer = useRef<any>(0);
  useEffect(() => {
    timer.current = setTimeout(() => {
      const isSingleNode = focusNodes.length === 1;
      const duration = isSingleNode ? 0 : 500;
      graph?.zoomToFit(duration, 20, node => {
        return focusNodes.includes(node.id as string);
      });
      if (isSingleNode) {
        (graph as ForceGraphInstance).zoom(6);
      }
    }, 1200);
    return () => {
      clearTimeout(timer.current);
    };
  }, [graph, focusNodes]);
};
