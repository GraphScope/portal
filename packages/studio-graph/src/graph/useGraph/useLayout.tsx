import { useContext } from '../../hooks/useContext';
import { useEffect } from 'react';
import type { ForceGraphInstance } from 'force-graph';

import { Utils } from '@graphscope/studio-components';
import { handleStyle } from '../handleStyle';
import { dagreLayout } from '../layout/dagre';
import { calculateRenderTime } from './useData';

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
  const { layout, graph, nodeStyle, data, render } = store;
  useEffect(() => {
    if (!graph) {
      return;
    }
    const { type, options } = layout;

    if (type === 'force' || type === 'force-dagre') {
      graph.dagMode(null);
      const renderTime = calculateRenderTime(data.nodes.length);
      graph.cooldownTime(renderTime);
      graph.cooldownTicks(Infinity);
      graph.graphData(Utils.fakeSnapshot({ nodes: data.nodes, links: data.edges }));

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
      graph.graphData(Utils.fakeSnapshot({ nodes: data.nodes, links: data.edges }));
    }
    if (type === 'dagre') {
      // not force layout
      graph.cooldownTicks(0); //cancel force engine iterations
      const size = graph.nodeRelSize() * 4;
      const layoutData = dagreLayout(data, {
        ...options,
        nodeWidth: size,
        nodeHeight: size,
        height: graph.height(),
        width: graph.width(),
        bbox: graph.getGraphBbox(),
      });

      graph.graphData(Utils.fakeSnapshot({ nodes: layoutData.nodes, links: layoutData.links }));
    }
  }, [render, data, graph, layout, nodeStyle]);
};
