import { get } from './utils';
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
        console.log(d, clusterKey, groupMap, get(d, clusterKey));
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
