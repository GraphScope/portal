import { useContext } from '../useContext';
import { useEffect } from 'react';
import { handleStyle } from '../utils/handleStyle';
import { BASIC_NODE_R, SELECTED_EDGE_COLOR } from '../const';

import { nodeCanvasObject, nodePointerAreaPaint } from '../custom-node';
import type { ForceGraphInstance } from 'force-graph';
import type { ForceGraph3DInstance } from '3d-force-graph';
export const useNodeStyle = () => {
  const { store } = useContext();
  const { graph, render, nodeStyle, nodeStatus } = store;
  useEffect(() => {
    if (graph) {
      console.log('nodeStyle effect ....');
      if (render === '2D' && (graph as ForceGraphInstance).nodeCanvasObject) {
        (graph as ForceGraphInstance)
          .nodeCanvasObject((node, ctx, globalScale) => {
            //@ts-ignore
            nodeCanvasObject(node, ctx, globalScale)(nodeStyle, nodeStatus);
          })
          .nodePointerAreaPaint((node, color, ctx, globalScale) => {
            nodePointerAreaPaint(node, color, ctx, globalScale)(nodeStyle);
          })
          .nodeRelSize(BASIC_NODE_R)
          .nodeCanvasObjectMode(() => {
            return 'replace';
          });
      }
      if (render === '3D') {
        (graph as ForceGraph3DInstance)
          .nodeLabel(node => handleStyle(node, nodeStyle).caption.join(' '))
          .nodeRelSize(BASIC_NODE_R)
          .nodeColor(node => handleStyle(node, nodeStyle).color)
          .nodeLabel(
            (node: any) => node && node.properties && node.properties[handleStyle(node, nodeStyle).caption.join(' ')],
          );
      }
    }
  }, [nodeStyle, nodeStatus, graph, render]);
};
