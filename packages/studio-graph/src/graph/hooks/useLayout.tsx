import { useContext } from '../useContext';
import { useEffect } from 'react';
import type { ForceGraphInstance } from 'force-graph';

import { handleStyle } from '../utils/handleStyle';
import { dagreLayout } from '../layout/dagre';
import { calculateRenderTime } from './useData';
function processLinks(links) {
  return links.map(link => {
    return {
      id: link.id,
      label: link.label,
      source: typeof link.source === 'string' ? link.source : link.source.id,
      target: typeof link.target === 'string' ? link.target : link.target.id,
      properties: link.properties,
    };
  });
}

import {
  forceSimulation as d3ForceSimulation,
  forceLink as d3ForceLink,
  forceManyBody as d3ForceManyBody,
  forceCenter as d3ForceCenter,
  forceRadial as d3ForceRadial,
  forceCollide as d3ForceCollide,
} from 'd3-force-3d';

export const useLayout = () => {
  const { store } = useContext();
  const { layout, graph, nodeStyle, render } = store;
  useEffect(() => {
    if (!graph) {
      return;
    }
    const { type, options } = layout;
    const { nodes, links } = graph.graphData();
    console.log('layout effect ...');

    if (type === 'force' || type === 'force-dagre') {
      graph.dagMode(null);
      const renderTime = calculateRenderTime(nodes.length);
      graph.cooldownTime(renderTime);
      graph.cooldownTicks(Infinity);
      /** 关闭聚类力导 */
      graph.d3Force('cluster', null);
      graph.d3Force('radial', null);
      /** 关闭聚类绘图 */
      if ((graph as ForceGraphInstance).onRenderFramePost) {
        (graph as ForceGraphInstance).onRenderFramePost(() => {});
      }

      if (type === 'force') {
        if (render === '2D') {
          (graph as ForceGraphInstance)
            .d3Force('center', d3ForceCenter().strength(1))
            .d3Force('charge', d3ForceManyBody())
            .d3Force('link', d3ForceLink())
            .d3Force(
              'collide',
              d3ForceCollide().radius(node => {
                return handleStyle(node, nodeStyle).size + 5;
              }),
            )
            .d3ReheatSimulation();
        }
      }
      if (type === 'force-dagre') {
        graph.dagMode('lr');
      }
    }
    if (type === 'preset') {
      graph.cooldownTicks(0); //cancel force engine iterations
    }
    if (type === 'dagre') {
      graph.cooldownTicks(0); //cancel force engine iterations
      const size = graph.nodeRelSize() * 4;

      const layoutData = dagreLayout(
        { nodes, edges: processLinks(links) },
        {
          ...options,
          nodeWidth: size,
          nodeHeight: size,
          height: graph.height(),
          width: graph.width(),
          bbox: graph.getGraphBbox(),
        },
      );
      graph.graphData({ nodes: layoutData.nodes, links: layoutData.links });
    }
  }, [render, graph, layout, nodeStyle]);
};
