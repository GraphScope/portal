import { useContext } from '../../hooks/useContext';
import { getGroups, get } from './utils';
import { ForceGraphInstance } from 'force-graph';
import {
  forceSimulation as d3ForceSimulation,
  forceLink as d3ForceLink,
  forceManyBody as d3ForceManyBody,
  forceCenter as d3ForceCenter,
  forceRadial as d3ForceRadial,
} from 'd3-force-3d';
import * as d3Force from 'd3-force';
import { handleStyle } from '../handleStyle';

import { forceCluster, forceRadial } from './combo-force';
import { useEffect, useRef } from 'react';
import { renderCombo } from './render';

const useComboLayout = () => {
  const { store } = useContext();
  const { graph, render, nodeStyle, combos, layout } = store;
  const linkForceRef = useRef<any>(null);

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
      if (linkForceRef.current === null) {
        linkForceRef.current = graph.d3Force('link');
      }

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
    } else {
      /** 关闭聚类 */
      graph.d3Force('charge', d3ForceManyBody());
      graph.d3Force('center', d3ForceCenter());
      graph.d3Force('link', linkForceRef.current);

      graph.d3Force('cluster', null);
      graph.d3Force('radial', null);

      if ((graph as ForceGraphInstance).onRenderFramePost) {
        (graph as ForceGraphInstance).onRenderFramePost(() => {});
      }
    }
  }, [layout, combos, render, graph]);
};

export default useComboLayout;
