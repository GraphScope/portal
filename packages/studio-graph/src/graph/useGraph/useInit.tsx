import { useRef, useEffect } from 'react';

import type { Emitter } from '../types';
import ForceGraph from 'force-graph';
import ForceGraph3D from '3d-force-graph';
import type { ForceGraphInstance } from 'force-graph';
import type { ForceGraph3DInstance } from '3d-force-graph';
import { Utils } from '@graphscope/studio-components';
import mitt from 'mitt';

import { useContext } from '../../hooks/useContext';

export const useInit = () => {
  const { store, updateStore, id } = useContext();
  const { render } = store;

  const emitterRef: React.MutableRefObject<Emitter | null> = useRef(null);
  const containerRef: React.MutableRefObject<HTMLDivElement | null> = useRef(null);
  const engineStopped: React.MutableRefObject<boolean> = useRef(false);

  useEffect(() => {
    if (!containerRef.current) return;
    emitterRef.current = mitt();
    const width = containerRef.current.offsetWidth;
    const height = containerRef.current.offsetHeight;
    let graph: ForceGraphInstance | ForceGraph3DInstance | null = null;
    engineStopped.current = false;
    console.log('init.......');
    if (render === '2D') {
      graph = ForceGraph()(containerRef.current);
      graph
        .width(width)
        .height(height)
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
        .onLinkClick(edge => {
          emitterRef.current?.emit('edge:click', edge);
        });
    }
    if (render === '3D') {
      graph = ForceGraph3D()(containerRef.current!)
        .width(width)
        .height(height)
        .enableNodeDrag(false)
        .onNodeClick(node => {
          emitterRef.current?.emit('node:click', node);
        })
        .onNodeRightClick((node, evt) => {
          emitterRef.current?.emit('node:contextmenu', { node, evt });
        })
        .onBackgroundClick(evt => {
          emitterRef.current?.emit('canvas:click', evt);
        })
        .onLinkClick(edge => {
          emitterRef.current?.emit('edge:click', edge);
        });
    }

    /** 监听容器 DOM 尺寸变化 */
    const handleResize = Utils.debounce(() => {
      if (!containerRef.current) return;
      const width = containerRef.current.offsetWidth;
      const height = containerRef.current.offsetHeight;
      if (graph) {
        //@ts-ignore
        graph.width(width).height(height);
      }
    }, 200);

    const observer = new ResizeObserver(handleResize);
    observer.observe(containerRef.current);

    updateStore(draft => {
      //@ts-ignore
      draft.graph = graph;
      draft.emitter = emitterRef.current;
      draft.width = width;
      draft.height = height;
    });

    return () => {
      if (graph) {
        graph._destructor();
      }
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [render]);
  return {
    containerRef,
    id,
  };
};
