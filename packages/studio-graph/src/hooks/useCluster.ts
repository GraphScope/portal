import { useContext } from './useContext';
import { getGroups, get } from './getGroups';
import { ForceGraphInstance } from './typing';
import {
  forceSimulation as d3ForceSimulation,
  forceLink as d3ForceLink,
  forceManyBody as d3ForceManyBody,
  forceCenter as d3ForceCenter,
  forceRadial as d3ForceRadial,
} from 'd3-force-3d';
import * as d3Force from 'd3-force';
import { handleStyle } from '../graph/handleStyle';
import { Utils } from '@graphscope/studio-components';
import { useEffect } from 'react';

/**
 * 自定义力：为每个分组添加向心力
 * @param groupMap
 * @param strength strength 是一个可调参数，默认值为 0.1
 * @returns
 */
function forceRadial(groupMap, clusterKey, strength = 0.1) {
  let nodes;

  function force(alpha) {
    nodes.forEach(d => {
      const group = groupMap.get(get(d, clusterKey));
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
function forceCluster(groupMap, clusterKey) {
  let nodes;

  function force(alpha) {
    nodes.forEach(d => {
      const group = groupMap.get(get(d, clusterKey));
      if (!group) return;
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

const useCluster = () => {
  const { store, updateStore } = useContext();
  const { graph, render, nodeStyle, width, height } = store;
  const data = Utils.fakeSnapshot(store.data);
  const enableCluster = (clusterKey = 'label') => {
    if (render === '2D' && graph) {
      (graph as ForceGraphInstance).zoom(1);
      const { groups, groupsMap } = getGroups(data.nodes, {
        width: width,
        height: height,
        //@ts-ignore
        screen2GraphCoords: graph.screen2GraphCoords,
        nodeStyle,
        clusterKey,
      });
      graph.d3Force('cluster', forceCluster(groupsMap, clusterKey));
      graph.d3Force('radial', forceRadial(groupsMap, clusterKey));
      graph.d3Force('center', null);
      graph.d3Force('charge', null);
      graph.d3Force('link', null);
      graph.d3Force(
        'collide',
        d3Force.forceCollide().radius(node => {
          const { size } = handleStyle(node, nodeStyle);
          const R = Math.round(Math.sqrt(Math.max(0, size)) * 4 + 2);
          return R;
        }),
      );
      (graph as ForceGraphInstance) // 在渲染帧之后绘制 Combo 边界
        .onRenderFramePost((ctx, globalScale) => {
          groups.forEach(group => {
            const { r, x, y, color, cluster } = group;
            // 绘制圆形边界
            ctx.beginPath();
            ctx.setLineDash([5, 5]);
            ctx.arc(x, y, r, 0, 2 * Math.PI, false);
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            ctx.stroke();
            // 设置文本
            ctx.font = '10px Arial';
            ctx.fillStyle = color;
            ctx.textAlign = 'center';
            const text = cluster;
            const textX = x; // 文本的 x 坐标（与圆心 x 坐标对齐）
            const textY = y - r - 6; // 文本的 y 坐标（在圆的上方）
            ctx.fillText(text, textX, textY);
          });
        });
      updateStore(draft => {
        draft.groups = groups;
      });
    }
    if (render === '3D' && graph) {
      const { groupsMap } = getGroups(data.nodes, {
        width: width,
        height: height,
        //@ts-ignore
        screen2GraphCoords: (x, y) => ({ x, y }),
        nodeStyle,
        clusterKey,
      });

      /** 启动聚类 */
      graph.d3Force('cluster', forceCluster(groupsMap, clusterKey));
      graph.d3Force('radial', forceRadial(groupsMap, clusterKey));
    }
    /** 立即启动力导 */
    graph && graph.d3ReheatSimulation();
  };
  const disableCluster = () => {
    if (render === '2D' && graph) {
      /** 关闭聚类 */
      graph.d3Force('charge', d3ForceManyBody());
      graph.d3Force('center', d3ForceCenter());
      graph.d3Force('cluster', null);
      graph.d3Force('radial', null);
      graph.d3Force(
        'link',
        d3ForceLink()
          .links(data.edges)
          .id(d => d.id),
      );
      (graph as ForceGraphInstance) // 在渲染帧之后绘制 Combo 边界
        .onRenderFramePost(() => {});
    }
    if (render === '3D' && graph) {
      /** 关闭聚类 */
      graph.d3Force('cluster', null);
      graph.d3Force('radial', null);
    }
  };

  return {
    enableCluster,
    disableCluster,
  };
};

export default useCluster;
