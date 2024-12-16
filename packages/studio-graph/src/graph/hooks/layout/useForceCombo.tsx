import * as d3Force from 'd3-force';
import { handleNodeStyle } from '../../utils/handleStyle';
import { get } from '../../utils';
import { runCirclePack } from '../../layout/circle-pack';
import { NodeData } from '../../types';
import { processLinks } from '../../utils';

export const useForceCombo = props => {
  const { render, nodeStyle, graph, layout, updateStore, data } = props;
  if (!graph) {
    return;
  }
  if (render === '3D') {
    console.warn('3D not support combo');
    return;
  }
  const { type, options } = layout;
  const { groupBy } = options;
  if (type !== 'force-combo' || groupBy === '') {
    return;
  }
  const { nodes, edges: links } = data;

  graph.cooldownTicks(0); //cancel force engine iterations
  const _options = {
    width: graph.width(),
    height: graph.height(),
    groupBy: 'label',
    nodeStyle,
    reheatSimulation: true,
    ...options,
  };

  const layoutData = runCirclePack({ nodes, edges: processLinks(links) }, _options);
  const { combos } = layoutData;

  const combosMap = new Map();
  combos.forEach(combo => {
    combosMap.set(combo.id, {
      ...combo,
    });
  });

  graph.d3Force('charge', null);
  graph.d3Force('center', null);
  graph.d3Force('link', null);

  graph.d3Force('cluster', forceCluster(combosMap, groupBy));
  graph.d3Force('radial', forceRadial(combosMap, groupBy));

  graph.d3Force(
    'collide',
    d3Force.forceCollide().radius(node => {
      const { size } = handleNodeStyle(node as NodeData, nodeStyle);
      const R = Math.round(Math.sqrt(Math.max(0, size)) * 4 + 2);
      return R;
    }),
  );

  updateStore(draft => {
    draft.combos = combos;
  });

  graph.cooldownTicks(Infinity);
  graph.graphData({ nodes: layoutData.nodes, links: layoutData.edges });
  graph.d3ReheatSimulation();
  graph.zoomToFit();
};

/**
 * 自定义力：为每个分组添加向心力
 * @param groupMap
 * @param strength strength 是一个可调参数，默认值为 0.1
 * @returns
 */
export function forceRadial(groupMap, clusterKey, strength = 0.05) {
  let nodes;

  function force(alpha) {
    nodes.forEach(d => {
      const group = groupMap.get(get(d, clusterKey) || 'undefined');
      if (!group) return;

      // 使用 strength 调整向心力的强度
      const dx = group.x - d.x;
      const dy = group.y - d.y;

      d.vx += dx * alpha * strength;
      d.vy += dy * alpha * strength;
    });
  }

  force.initialize = _ => (nodes = _);

  return force;
}

/**
 * 自定义分组聚类力：将节点限制在各自的分组范围内
 * @param groupMap
 * @returns
 */
export function forceCluster(groupMap, clusterKey) {
  let nodes;

  function force(alpha) {
    nodes.forEach(d => {
      const group = groupMap.get(get(d, clusterKey) || 'undefined');

      if (!group) {
        return;
      }
      const dx = d.x - group.x;
      const dy = d.y - group.y;
      const r = Math.sqrt(dx * dx + dy * dy);
      const maxRadius = group.r - (d.size || 3);

      if (r > maxRadius) {
        /** 如果节点距离分组中心的距离 r 超过了最大距离 maxRadius，则按照比例 k 将节点拉回到允许的范围内 */
        const k = ((r - maxRadius) / r) * alpha;
        d.x -= dx * k;
        d.y -= dy * k;
      }
    });
  }

  force.initialize = _ => {
    return (nodes = _);
  };

  return force;
}
