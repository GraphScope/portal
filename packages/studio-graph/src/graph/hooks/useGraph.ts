import { useRef, useEffect, useState } from 'react';

import type { GraphProps, Graph } from '../types';

import ForceGraph from 'force-graph';

import ForceGraph3D from '3d-force-graph';
import type { ForceGraphInstance } from 'force-graph';
import type { ForceGraph3DInstance } from '3d-force-graph';
import mitt from 'mitt';
import type { Emitter } from '../types';

const emitter = mitt();
/**
 * Hook for creating and managing a G6 graph instance.
 * @param props The props for the Graphin component.
 * @returns An object containing the graph instance, the container ref, and a boolean indicating whether the graph is ready.
 */
export default function useGraph<P extends GraphProps>(props: P) {
  const { onInit, onReady, onDestroy, options, render = '2D', data } = props;
  const [isReady, setIsReady] = useState(false);
  const graphRef: React.MutableRefObject<Graph | null> = useRef(null);
  const containerRef: React.MutableRefObject<HTMLDivElement | null> = useRef(null);
  // const emitterRef: React.MutableRefObject<null | Emitter> = useRef(null);
  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.offsetWidth;
    const height = containerRef.current.offsetHeight;
    // emitterRef.current = mitt();

    let graph: ForceGraphInstance | ForceGraph3DInstance | null = null;
    console.log('data ?>>', { nodes: data.nodes, links: data.edges });
    if (render === '2D') {
      graph = ForceGraph()(containerRef.current)
        .width(width)
        .height(height)
        .graphData({ nodes: data.nodes, links: data.edges })
        .nodeAutoColorBy('group')
        .onNodeHover(node => {
          // console.log('onNodeHover', node);
          emitter.emit('node:hover', node);
        })
        .onNodeClick(node => {
          console.log('onNodeClick', node);
          emitter.emit('node:click', node);
        })
        .onNodeRightClick((node, evt) => {
          console.log('onNodeRightClick', node);
          emitter.emit('node:contextmenu', { node, evt });
        });
    }
    if (render === '3D') {
      graph = ForceGraph3D()(containerRef.current!)
        .width(width)
        .height(height)
        .enableNodeDrag(false)
        .graphData({ nodes: data.nodes, links: data.edges })
        .nodeAutoColorBy('group')
        .onNodeClick(node => {
          console.log('onNodeClick', node);
          emitter.emit('node:click', node);
        })
        .onNodeRightClick((node, evt) => {
          console.log('onNodeRightClick', node);
          emitter.emit('node:contextmenu', { node, evt });
        });
    }

    graphRef.current = graph;
    setIsReady(true);
    onInit?.(graph);

    return () => {
      const graph = graphRef.current;
      if (graph) {
        graph._destructor();
      }
    };
  }, [render]);
  useEffect(() => {
    if (graphRef.current) {
      console.log('data change.....');
      graphRef.current.graphData({ nodes: data.nodes, links: data.edges });
    }
  }, [data]);

  return {
    graph: graphRef.current,
    containerRef,
    isReady,
    emitter,
  };
}
