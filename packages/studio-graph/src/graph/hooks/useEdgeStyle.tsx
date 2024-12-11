import { useContext } from '../useContext';
import { useEffect } from 'react';
import { handleStyle } from '../utils/handleStyle';
import { SELECTED_EDGE_COLOR } from '../const';

import { linkCanvasObject } from '../custom-edge';
import type { ForceGraphInstance } from 'force-graph';
import type { ForceGraph3DInstance } from '3d-force-graph';
import { EdgeStyle } from '../types';
export const useEdgeStyle = () => {
  const { store } = useContext();
  const { graph, render, edgeStatus, edgeStyle } = store;

  useEffect(() => {
    if (graph) {
      console.log('edgeStyle effect ....');
      const edgeCount = graph.graphData().links.length;

      if (render === '2D' && (graph as ForceGraphInstance).linkCanvasObject) {
        (graph as ForceGraphInstance)
          .linkCanvasObject((link, ctx, globalScale) => {
            //@ts-ignore
            linkCanvasObject(link, ctx, globalScale)(edgeStyle, edgeStatus, edgeCount > 100);
          })
          // custom edge
          .linkCanvasObjectMode(() => 'after')
          .linkDirectionalArrowLength(edge => {
            const { options = {}, size } = handleStyle(edge, edgeStyle, 'edge') as EdgeStyle;
            const { arrowLength = size * 3 } = options as any;
            return arrowLength;
          })
          .linkDirectionalArrowRelPos(edge => {
            const { options = {} } = handleStyle(edge, edgeStyle, 'edge') as EdgeStyle;
            const { arrowPosition = 0.9 } = options as any;
            return arrowPosition;
          })
          .linkColor((edge: any) => {
            const { color } = handleStyle(edge, edgeStyle, 'edge');
            const match = edgeStatus[edge.id];
            if (match && match.selected) {
              return SELECTED_EDGE_COLOR;
            }
            return color;
          })
          .linkLabel((edge: any) => {
            const key = handleStyle(edge, edgeStyle, 'edge').caption;
            const value = edge && edge.properties && edge.properties[key];
            if (key && value) {
              return `${key}: ${value}`;
            }
            return '';
          })
          // .onZoom(() => {
          //   if (render === '2D') {
          //     graph.linkWidth(0.1 * (graph as ForceGraphInstance).zoom());
          //   }
          // })
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
      if (render === '3D') {
        (graph as ForceGraph3DInstance)
          .linkColor((edge: any) => {
            const { color } = handleStyle(edge, edgeStyle, 'edge');
            const match = edgeStatus[edge.id];
            if (match && match.selected) {
              return SELECTED_EDGE_COLOR;
            }
            return color;
          })
          .linkLabel((edge: any) => {
            const key = handleStyle(edge, edgeStyle, 'edge').caption;
            const value = edge && edge.properties && edge.properties[key];
            if (key && value) {
              return `${key}: ${value}`;
            }
            return '';
          })
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
    }
  }, [edgeStyle, edgeStatus, render, graph]);
};
