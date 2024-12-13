import { useEffect, useRef } from 'react';
import { useContext } from '../../';
import { ForceGraphInstance } from 'force-graph';
export const useFoucs = () => {
  const { store } = useContext();
  const { graph, focusNodes, width } = store;
  let timer = useRef<any>(0);
  useEffect(() => {
    timer.current = setTimeout(() => {
      const isSingleNode = focusNodes.length === 1;
      if (graph) {
        const bbox = graph.getGraphBbox(node => {
          return focusNodes.includes(node.id as string);
        });
        if (bbox) {
          const center = {
            x: (bbox.x[0] + bbox.x[1]) / 2,
            y: (bbox.y[0] + bbox.y[1]) / 2,
          };
          if ((graph as ForceGraphInstance) && (graph as ForceGraphInstance).centerAt) {
            (graph as ForceGraphInstance).centerAt(center.x, center.y, 400);
          }
        }
      }
    }, 200);
    return () => {
      clearTimeout(timer.current);
    };
  }, [graph, focusNodes, width]);
};
