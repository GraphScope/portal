import { useContext } from '../../hooks/useContext';
import { useEffect } from 'react';
import type { ForceGraphInstance } from 'force-graph';

import { Utils } from '@graphscope/studio-components';
import { handleStyle } from '../handleStyle';
import { dagreLayout } from '../layout/dagre';
import { calculateRenderTime } from './useData';

import { forceCenter as d3ForceCenter, forceCollide as d3ForceCollide } from 'd3-force-3d';

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
      if (type === 'force') {
        if (render === '2D') {
          (graph as ForceGraphInstance)
            .d3Force(
              'collide',
              d3ForceCollide().radius(node => {
                return handleStyle(node, nodeStyle).size + 5;
              }),
            )
            .d3Force('center', d3ForceCenter().strength(1));
          graph.d3ReheatSimulation();
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
      const layoutData = dagreLayout(data, options);
      graph.graphData(Utils.fakeSnapshot({ nodes: layoutData.nodes, links: layoutData.links }));
    }
  }, [render, data, graph, layout, nodeStyle]);
};
