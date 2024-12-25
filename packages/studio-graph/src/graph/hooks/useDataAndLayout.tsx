import { useContext } from '../useContext';
import { useEffect } from 'react';
import type { ForceGraphInstance } from 'force-graph';
import { handleNodeStyle, processLinks } from '../utils';
import { dagreLayout } from '../layout/dagre';
import { runCirclePack } from '../layout/circle-pack';
import { useForceCombo } from './layout/useForceCombo';
import type { Layout } from '../types';
import { BASIC_NODE_R } from '../const';

import {
  forceSimulation as d3ForceSimulation,
  forceLink as d3ForceLink,
  forceManyBody as d3ForceManyBody,
  forceCenter as d3ForceCenter,
  forceRadial as d3ForceRadial,
  forceCollide as d3ForceCollide,
} from 'd3-force-3d';

export const resetForce = (graph: ForceGraphInstance) => {
  graph.cooldownTicks(Infinity);
  graph.dagMode(null);
  /** 关闭聚类力导 */
  graph.d3Force('cluster', null);
  graph.d3Force('radial', null);
  /** 关闭聚类绘图 */
  if ((graph as ForceGraphInstance).onRenderFramePost) {
    (graph as ForceGraphInstance).onRenderFramePost(() => {});
  }
};

export function calculateRenderTime(N: number) {
  if (N === 0) {
    return 0;
  }
  let groups = Math.floor((N - 1) / 500); // 超过基础1个点后，每500个点为一组
  let extraTime = groups * 0.5; // 每组增加0.5秒
  let renderTime = 1.2 + extraTime; // 加上基础的0.5秒
  return Math.min(renderTime, 15) * 1000; // 确保渲染时间不超过15秒
}

export const useDataAndLayout = () => {
  const { store, updateStore } = useContext();
  const { layout = {} as Layout, graph, nodeStyle, render, data, width, height } = store;
  useEffect(() => {
    if (!graph) {
      return;
    }
    const { type = 'force', options } = layout;
    const { nodes, edges: links } = data;
    console.log('use data and layout ...');

    if (type === 'force' || type === 'force-dagre' || type === 'force-combo') {
      if (render === '3D') {
        //3D 的力导布局不去自定义
        graph.graphData({ nodes, links });
        return;
      }
      resetForce(graph as ForceGraphInstance);
      const renderTime = calculateRenderTime(data.nodes.length);
      graph.cooldownTime(renderTime);
      if (type === 'force') {
        (graph as ForceGraphInstance)
          .d3Force('center', d3ForceCenter().strength(1))
          .d3Force('charge', d3ForceManyBody())
          .d3Force('link', d3ForceLink().distance(40))
          .d3Force(
            'collide',
            d3ForceCollide().radius(node => {
              const { size } = handleNodeStyle(node, nodeStyle);
              const R = Math.sqrt(Math.max(0, size)) * BASIC_NODE_R;
              return R + 2;
            }),
          );
        graph.graphData({ nodes, links });
        graph.d3ReheatSimulation();
      }
      if (type === 'force-dagre') {
        graph.dagMode('lr');
        graph.graphData({ nodes, links });
      }
      if (type === 'force-combo') {
        useForceCombo({ data, layout, graph, nodeStyle, render, updateStore });
      }
    }
    if (type === 'preset') {
      graph.cooldownTicks(0); //cancel force engine iterations
      graph.graphData({ nodes, links });
    }

    if (type === 'circle-pack') {
      graph.cooldownTicks(0); //cancel force engine iterations
      const _options = {
        width,
        height,
        groupBy: 'label',
        nodeStyle,
        ...options,
      };
      const layoutData = runCirclePack({ nodes, edges: processLinks(links) }, _options);
      graph.graphData({ nodes: layoutData.nodes, links: layoutData.edges });
      updateStore(draft => {
        draft.combos = layoutData.combos;
      });
      graph.zoomToFit();
    }
    if (type === 'dagre') {
      graph.cooldownTicks(0); //cancel force engine iterations
      const size = graph.nodeRelSize() * 4;
      const _options = {
        ...options,
        nodeWidth: size,
        nodeHeight: size,
        height: graph.height(),
        width: graph.width(),
        bbox: graph.getGraphBbox(),
      };
      const layoutData = dagreLayout({ nodes, edges: processLinks(links) }, _options);
      graph.graphData({ nodes: layoutData.nodes, links: layoutData.links });
      graph.zoomToFit();
    }
  }, [data, render, graph, layout, nodeStyle, width, height]);
};
