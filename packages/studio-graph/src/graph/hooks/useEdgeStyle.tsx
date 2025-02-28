import { useContext } from '../useContext';
import { useEffect } from 'react';
import { handleEdgeStyle } from '../utils/handleStyle';
import { COLOR_DISABLED, SELECTED_EDGE_COLOR, SELECTED_EDGE_TEXT_COLOR } from '../const';

import { linkCanvasObject } from '../custom-edge';
import type { ForceGraphInstance } from 'force-graph';
import type { ForceGraph3DInstance } from '3d-force-graph';
import { EdgeStyle, EdgeData } from '../types';
import { handleStatus } from '../utils';
export const useEdgeStyle = () => {
  const { store } = useContext();
  const { graph, render, edgeStatus, edgeStyle } = store;

  useEffect(() => {
    if (graph) {
      if (render === '2D' && (graph as ForceGraphInstance).linkCanvasObject) {
        (graph as ForceGraphInstance)
          /** custome label */
          .linkCanvasObject((link, ctx, globalScale) => {
            linkCanvasObject(link as EdgeData, ctx, globalScale)(edgeStyle, edgeStatus);
          })
          .linkCanvasObjectMode(() => 'after')
          .linkDirectionalArrowLength(edge => {
            const { options = {}, size } = handleEdgeStyle(edge as EdgeData, edgeStyle) as EdgeStyle;
            return options.arrowLength === undefined ? size * 3 : options.arrowLength;
          })
          .linkDirectionalArrowRelPos(edge => {
            const { options } = handleEdgeStyle(edge as EdgeData, edgeStyle) as EdgeStyle;
            return options.arrowPosition || 1;
          })
          .linkColor((edge: any) => {
            const { color, options } = handleEdgeStyle(edge, edgeStyle);
            const { selected, disabled } = handleStatus(edge, edgeStatus);
            if (selected) {
              return options.selectColor || SELECTED_EDGE_COLOR;
            }
            if (disabled) {
              return COLOR_DISABLED;
            }
            return color;
          })
          // .onZoom(() => {
          //   if (render === '2D') {
          //     const l = 4 / (graph as ForceGraphInstance).zoom();
          //     console.log(l);
          //     // graph.linkWidth(0.1 * (graph as ForceGraphInstance).zoom());
          //     graph.linkHoverPrecision(l);
          //   }
          // })
          .linkWidth((edge: any) => {
            const { size } = handleEdgeStyle(edge, edgeStyle);
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
              const { size } = handleEdgeStyle(edge, edgeStyle);
              return size + 1;
            }
            return 0;
          });
        // .linkPointerAreaPaint((link, color, ctx, globalScale) => {
        //   // ctx.fillStyle = color;
        //   ctx.strokeStyle = color;
        //   const { source, target } = link;
        //   // ignore unbound links
        //   if (typeof source !== 'object' || typeof target !== 'object') return;
        //   // ignore unlayout links
        //   if (source.x === undefined || source.y === undefined || target.x === undefined || target.y === undefined) {
        //     return;
        //   }
        //   const { size } = handleEdgeStyle(link as EdgeData, edgeStyle);
        //   ctx.moveTo(source.x, source.y);
        //   ctx.lineTo(target.x, target.y);
        //   ctx.lineWidth = size;
        //   ctx.stroke();
        // });
      }
      if (render === '3D') {
        (graph as ForceGraph3DInstance)
          // .linkColor((edge: any) => {
          //   const { color } = handleEdgeStyle(edge, edgeStyle);
          //   const match = edgeStatus[edge.id];
          //   if (match && match.selected) {
          //     return SELECTED_EDGE_TEXT_COLOR;
          //   }
          //   return color;
          // })
          .linkLabel((edge: any) => {
            const { caption } = handleEdgeStyle(edge, edgeStyle);
            return caption
              .map(key => {
                const value = edge && edge.properties && edge.properties[key];
                if (key && value) {
                  return `${key}: ${value}`;
                }
              })
              .join('');
          })
          .linkWidth((edge: any) => {
            const { size } = handleEdgeStyle(edge, edgeStyle);
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
              const { size } = handleEdgeStyle(edge, edgeStyle);
              return size + 1;
            }
            return 0;
          });
      }
    }
  }, [edgeStyle, edgeStatus, render, graph]);
};
