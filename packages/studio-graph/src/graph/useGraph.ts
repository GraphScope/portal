import { useRef, useEffect, useState } from 'react';

import type { GraphProps, Graph, Emitter } from './types';
import ForceGraph from 'force-graph';
import ForceGraph3D from '3d-force-graph';
import type { ForceGraphInstance } from 'force-graph';
import type { ForceGraph3DInstance } from '3d-force-graph';
import { Utils } from '@graphscope/studio-components';
import mitt from 'mitt';
import { handleStyle } from './handleStyle';
import { nodeCanvasObject } from './custom-node';
// import { linkCanvasObject } from './custom-edge';
import { BASIC_NODE_R, SELECTED_EDGE_COLOR } from './const';

import {
  // forceSimulation as d3ForceSimulation,
  // forceLink as d3ForceLink,
  // forceManyBody as d3ForceManyBody,
  // forceRadial as d3ForceRadial,
  forceCenter as d3ForceCenter,
  forceCollide as d3ForceCollide,
} from 'd3-force-3d';

let timer: any = null;
export default function useGraph<P extends GraphProps>(props: P) {
  const {
    onInit,
    onReady,
    onDestroy,
    options,
    render = '2D',
    data,
    nodeStyle,
    edgeStyle,
    nodeStatus,
    edgeStatus,
  } = props;
  const [isReady, setIsReady] = useState(false);
  const graphRef: React.MutableRefObject<Graph | null> = useRef(null);
  const emitterRef: React.MutableRefObject<Emitter | null> = useRef(null);
  const containerRef: React.MutableRefObject<HTMLDivElement | null> = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    emitterRef.current = mitt();
    const width = containerRef.current.offsetWidth;
    const height = containerRef.current.offsetHeight;
    let graph: ForceGraphInstance | ForceGraph3DInstance | null = null;

    if (render === '2D') {
      graph = ForceGraph()(containerRef.current);
      graph
        .width(width)
        .height(height)
        .graphData(Utils.fakeSnapshot({ nodes: data.nodes, links: data.edges }))
        /** node */
        .nodeRelSize(BASIC_NODE_R)
        .nodeCanvasObjectMode(() => {
          return 'replace';
        })
        .nodeCanvasObject((node, ctx, globalScale) => {
          nodeCanvasObject(node, ctx, globalScale)(nodeStyle, nodeStatus);
        })
        // .nodePointerAreaPaint((node, color, ctx, globalScale) => {
        //   console.log(node, color, ctx, globalScale);
        //   nodeCanvasObject(node, ctx, globalScale)(nodeStyle, nodeStatus);
        // })
        /** edge */
        .linkLabel(edge => handleStyle(edge, edgeStyle, 'edge').caption)
        .linkWidth(edge => handleStyle(edge, edgeStyle, 'edge').width)
        .linkColor(edge => handleStyle(edge, edgeStyle, 'edge').color)
        .linkDirectionalArrowLength(3)
        .linkDirectionalArrowRelPos(0.9)
        // custom edge
        // .linkCanvasObjectMode(() => 'after')
        // .linkCanvasObject((link, ctx, globalScale) => {
        //   linkCanvasObject(link, ctx, globalScale)(edgeStyle, edgeStatus);
        // })

        /** force */
        .d3Force(
          'collide',
          d3ForceCollide().radius(node => {
            return handleStyle(node, nodeStyle).size + 5;
          }),
        )
        .d3Force('center', d3ForceCenter().strength(1))

        /** interaction */
        .onNodeHover(node => {
          emitterRef.current?.emit('node:hover', node);
        })
        .onNodeClick(node => {
          emitterRef.current?.emit('node:click', node);
        })
        .onNodeRightClick((node, evt) => {
          emitterRef.current?.emit('node:contextmenu', { node, evt });
        })
        .onBackgroundClick(evt => {
          emitterRef.current?.emit('canvas:click', evt);
        })
        .cooldownTime(15000);
    }
    if (render === '3D') {
      graph = ForceGraph3D()(containerRef.current!)
        .width(width)
        .height(height)
        .enableNodeDrag(false)
        /** node */
        .nodeRelSize(BASIC_NODE_R)
        .nodeVal(node => handleStyle(node, nodeStyle).size)
        .nodeLabel((node: any) => node && node.properties && node.properties[handleStyle(node, nodeStyle).caption])
        .nodeColor(node => handleStyle(node, nodeStyle).color)
        /** edge */
        .linkLabel((edge: any) => edge && edge.properties && edge.properties[handleStyle(edge, edgeStyle).caption])
        .linkWidth(edge => handleStyle(edge, edgeStyle, 'edge').width)
        .linkColor(edge => handleStyle(edge, edgeStyle, 'edge').color)
        .linkDirectionalArrowLength(3)
        .linkDirectionalArrowRelPos(0.9)

        .graphData(Utils.fakeSnapshot({ nodes: data.nodes, links: data.edges }))
        .cooldownTime(15000)
        .onNodeClick(node => {
          emitterRef.current?.emit('node:click', node);
        })
        .onNodeRightClick((node, evt) => {
          emitterRef.current?.emit('node:contextmenu', { node, evt });
        })
        .onBackgroundClick(evt => {
          emitterRef.current?.emit('canvas:click', evt);
        });
    }

    graphRef.current = graph;
    setIsReady(true);
    onInit?.(graph, emitterRef.current, { width, height });

    /** 监听容器 DOM 尺寸变化 */
    const handleResize = Utils.debounce(() => {
      if (!containerRef.current) return;
      const width = containerRef.current.offsetWidth;
      const height = containerRef.current.offsetHeight;
      if (graphRef.current) {
        //@ts-ignore
        graphRef.current.width(width).height(height);
      }
    }, 200);
    const observer = new ResizeObserver(handleResize);
    observer.observe(containerRef.current);
    return () => {
      if (graphRef.current) {
        graphRef.current._destructor();
      }
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [render]);
  useEffect(() => {
    if (graphRef.current) {
      graphRef.current.graphData(Utils.fakeSnapshot({ nodes: data.nodes, links: data.edges }));

      timer = setTimeout(() => {
        console.log('Math.max(400 / (data.nodes.length + 1), 20)', Math.max(400 / (data.nodes.length + 1), 20));
        graphRef.current?.zoomToFit(400, Math.max(400 / (data.nodes.length + 1), 20));
      }, 1200);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [data]);
  useEffect(() => {
    if (graphRef.current) {
      const graph = graphRef.current;
      if (render === '2D') {
        (graph as ForceGraphInstance).nodeCanvasObject((node, ctx, globalScale) => {
          nodeCanvasObject(node, ctx, globalScale)(nodeStyle, nodeStatus);
        });
      }
      if (render === '3D') {
        (graph as ForceGraph3DInstance)
          .nodeLabel(node => handleStyle(node, nodeStyle).caption)
          .nodeColor(node => handleStyle(node, nodeStyle).color)
          .nodeLabel((node: any) => node && node.properties && node.properties[handleStyle(node, nodeStyle).caption]);
      }
    }
  }, [nodeStyle, nodeStatus]);

  useEffect(() => {
    if (graphRef.current) {
      const graph = graphRef.current;
      (graph as ForceGraphInstance)

        .linkColor((edge: any) => {
          const { color } = handleStyle(edge, edgeStyle, 'edge');
          const match = edgeStatus[edge.id];
          if (match && match.selected) {
            return SELECTED_EDGE_COLOR;
          }
          return color;
        })
        .linkLabel(
          (edge: any) => edge && edge.properties && edge.properties[handleStyle(edge, edgeStyle, 'edge').caption],
        )
        .linkWidth((edge: any) => {
          const { size } = handleStyle(edge, edgeStyle, 'edge');
          const match = edgeStatus[edge.id];
          if (match && match.selected) {
            return size + 1;
          }
          return size;
        })
        .linkDirectionalParticles(1)
        .linkDirectionalParticleWidth((edge: any) => {
          const match = edgeStatus[edge.id];
          if (match && match.selected) {
            const { size } = handleStyle(edge, edgeStyle, 'edge');
            return size + 1;
          }
          return 0;
        });
    }
  }, [edgeStyle, edgeStatus]);

  return {
    graph: graphRef.current,
    emitter: emitterRef.current,
    containerRef,
    isReady,
  };
}
