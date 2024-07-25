import { useRef, useEffect, useState } from 'react';

import type { GraphProps, Graph, Emitter } from './types';
import ForceGraph from 'force-graph';
import ForceGraph3D from '3d-force-graph';
import type { ForceGraphInstance } from 'force-graph';
import type { ForceGraph3DInstance } from '3d-force-graph';
import { Utils } from '@graphscope/studio-components';
import mitt from 'mitt';

const handleColor = (item, style, type?: 'node' | 'edge') => {
  const { id, label, __style_color } = item;
  /** 用户手动指定的样式，优先级第一 */
  const userStyle = style[id];
  if (userStyle) {
    return userStyle.color;
  }
  /** 按照label 划分群组的样式，优先级第二 */
  const groupStyle = style[label];
  if (groupStyle) {
    return groupStyle.color;
  }
  /** 后台数据初始化就添加的样式，优先级第三 */
  if (__style_color) {
    return __style_color;
  }
  /** 兜底给一个样式 */
  if (type === 'edge') {
    return '#ddd';
  }
  return '#1978fe';
};

const handleSize = (item, style, type?: 'node' | 'edge') => {
  const { id, label, __style_size } = item;
  /** 用户手动指定的样式，优先级第一 */
  const userStyle = style[id];
  if (userStyle) {
    return userStyle.size;
  }
  /** 按照label 划分群组的样式，优先级第二 */
  const groupStyle = style[label];
  if (groupStyle) {
    return groupStyle.size;
  }
  /** 后台数据初始化就添加的样式，优先级第三 */
  if (__style_size) {
    return __style_size;
  }
  /** 兜底给一个样式 */
  if (type === 'edge') {
    return 1;
  }
  return 5;
};
const handleCaption = (item, style) => {
  const { id, label, __style_caption, properties = {} } = item;

  const userStyle = style[id];
  if (userStyle) {
    return properties[userStyle.caption];
  }

  const groupStyle = style[label];
  if (groupStyle) {
    return properties[groupStyle.caption];
  }

  if (__style_caption) {
    return properties[__style_caption];
  }

  return '';
};

/**
 * Hook for creating and managing a G6 graph instance.
 * @param props The props for the Graphin component.
 * @returns An object containing the graph instance, the container ref, and a boolean indicating whether the graph is ready.
 */
export default function useGraph<P extends GraphProps>(props: P) {
  const { onInit, onReady, onDestroy, options, render = '2D', data, nodeStyle, edgeStyle } = props;
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
    console.log('graph init...', nodeStyle);
    if (render === '2D') {
      graph = ForceGraph()(containerRef.current);
      graph
        .width(width)
        .height(height)
        .graphData(Utils.fakeSnapshot({ nodes: data.nodes, links: data.edges }))
        .nodeLabel(node => handleCaption(node, nodeStyle))
        .nodeColor(node => handleColor(node, nodeStyle))
        .nodeRelSize(4)
        .nodeVal(node => handleSize(node, nodeStyle))
        .linkColor(edge => handleColor(edge, edgeStyle, 'edge'))
        .linkLabel(edge => handleCaption(edge, edgeStyle))
        .linkWidth(edge => handleSize(edge, edgeStyle, 'edge'))
        .onNodeHover(node => {
          emitterRef.current?.emit('node:hover', node);
        })
        .onNodeClick(node => {
          emitterRef.current?.emit('node:click', node);
        })
        .onNodeRightClick((node, evt) => {
          emitterRef.current?.emit('node:contextmenu', { node, evt });
        })
        .cooldownTime(15000);
    }
    if (render === '3D') {
      graph = ForceGraph3D()(containerRef.current!)
        .width(width)
        .height(height)
        .enableNodeDrag(false)
        .nodeRelSize(4)
        .nodeVal(node => handleSize(node, nodeStyle))
        .nodeLabel(node => handleCaption(node, nodeStyle))
        .nodeColor(node => handleColor(node, nodeStyle))
        .linkColor(edge => handleColor(edge, edgeStyle, 'edge'))
        .linkLabel(edge => handleCaption(edge, edgeStyle))
        .linkWidth(edge => handleSize(edge, edgeStyle, 'edge'))
        .graphData(Utils.fakeSnapshot({ nodes: data.nodes, links: data.edges }))
        .cooldownTime(15000)
        .onNodeClick(node => {
          emitterRef.current?.emit('node:click', node);
        })
        .onNodeRightClick((node, evt) => {
          emitterRef.current?.emit('node:contextmenu', { node, evt });
        });
    }

    graphRef.current = graph;
    setIsReady(true);
    onInit?.(graph, emitterRef.current);

    /** 监听容器 DOM 尺寸变化 */
    const handleResize = Utils.debounce(() => {
      if (!containerRef.current) return;
      const width = containerRef.current.offsetWidth;
      const height = containerRef.current.offsetHeight;
      graphRef.current?.width(width).height(height);
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
      console.log('data change.....');
      graphRef.current.graphData(Utils.fakeSnapshot({ nodes: data.nodes, links: data.edges }));
    }
  }, [data]);
  useEffect(() => {
    if (graphRef.current) {
      console.log('node style change.....', nodeStyle);
      const graph = graphRef.current;
      graph.nodeColor(node => handleColor(node, nodeStyle));
      graph.nodeLabel(node => handleCaption(node, nodeStyle));
      graph.nodeVal(node => handleSize(node, nodeStyle));
    }
  }, [nodeStyle]);
  useEffect(() => {
    if (graphRef.current) {
      console.log('edge style change.....', edgeStyle);
      const graph = graphRef.current;
      graph.linkColor(edge => handleColor(edge, edgeStyle, 'edge'));
      graph.linkLabel(edge => handleCaption(edge, edgeStyle));
      graph.linkWidth(edge => handleSize(edge, edgeStyle, 'edge'));
    }
  }, [edgeStyle]);

  return {
    graph: graphRef.current,
    emitter: emitterRef.current,
    containerRef,
    isReady,
  };
}
