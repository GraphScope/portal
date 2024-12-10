import { useContext } from '../../hooks/useContext';

import { ForceGraphInstance } from 'force-graph';
import {
  forceSimulation as d3ForceSimulation,
  forceLink as d3ForceLink,
  forceManyBody as d3ForceManyBody,
  forceCenter as d3ForceCenter,
  forceRadial as d3ForceRadial,
  forceCollide as d3ForceCollide,
} from 'd3-force-3d';
import * as d3Force from 'd3-force';
import { handleStyle } from '../handleStyle';

import { forceCluster, forceRadial } from './combo-force';
import { useEffect } from 'react';
import { renderCombo } from './render';

const useComboLayout = () => {
  const { store } = useContext();
  const { graph, render, nodeStyle, combos, layout } = store;

  useEffect(() => {
    if (render === '3D') {
      console.warn('3D not support combo');
      return;
    }
    if (!graph) {
      return;
    }
    const { type, options } = layout;

    if (type !== 'force-combo') {
      return;
    }
    const { enable, reheatSimulation, groupBy } = options;
    if (enable === undefined) {
      // 还未启动聚类
      return;
    }

    if (enable) {
      const combosMap = new Map();
      combos.forEach(group => {
        combosMap.set(group.id, group);
      });

      graph.d3Force('charge', null);
      graph.d3Force('center', null);
      graph.d3Force('link', null);

      graph.d3Force('cluster', forceCluster(combosMap, groupBy));
      graph.d3Force('radial', forceRadial(combosMap, groupBy));

      graph.d3Force(
        'collide',
        d3Force.forceCollide().radius(node => {
          const { size } = handleStyle(node, nodeStyle);
          const R = Math.round(Math.sqrt(Math.max(0, size)) * 4 + 2);
          return R;
        }),
      );
      /** render combos */
      renderCombo(graph as ForceGraphInstance, combos);
      /** 立即启动力导 */
      if (reheatSimulation && graph) {
        graph.d3ReheatSimulation();
      }
    }
  }, [layout, combos, render, graph]);
};

export default useComboLayout;
