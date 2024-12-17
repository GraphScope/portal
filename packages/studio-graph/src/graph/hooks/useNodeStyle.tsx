import { useContext } from '../useContext';
import { useEffect } from 'react';
import { handleNodeStyle } from '../utils/handleStyle';
import { BASIC_NODE_R, SELECTED_EDGE_COLOR } from '../const';

import { nodeCanvasObject, nodePointerAreaPaint } from '../custom-node';
import type { ForceGraphInstance } from 'force-graph';
import type { ForceGraph3DInstance } from '3d-force-graph';
import type { NodeData } from '../types';
export const useNodeStyle = () => {
  const { store } = useContext();
  const { graph, render, nodeStyle, nodeStatus } = store;
  useEffect(() => {
    if (graph) {
      if (render === '2D' && (graph as ForceGraphInstance).nodeCanvasObject) {
        (graph as ForceGraphInstance)
          .nodeCanvasObject((node, ctx, globalScale) => {
            nodeCanvasObject(node as NodeData, ctx, globalScale)(nodeStyle, nodeStatus);
          })
          .nodePointerAreaPaint((node, color, ctx, globalScale) => {
            nodePointerAreaPaint(node as NodeData, color, ctx, globalScale)(nodeStyle);
          })
          .nodeVal(node => handleNodeStyle(node as NodeData, nodeStyle).size)
          .nodeRelSize(BASIC_NODE_R)
          .nodeCanvasObjectMode(() => {
            return 'replace';
          });
      }
      if (render === '3D') {
        (graph as ForceGraph3DInstance)
          .nodeVal(node => handleNodeStyle(node as NodeData, nodeStyle).size)
          .nodeLabel(node => handleNodeStyle(node as NodeData, nodeStyle).caption.join(' '))
          .nodeRelSize(BASIC_NODE_R)
          .nodeColor(node => handleNodeStyle(node as NodeData, nodeStyle).color)
          .nodeLabel(
            (node: any) =>
              node && node.properties && node.properties[handleNodeStyle(node, nodeStyle).caption.join(' ')],
          );
      }
    }
  }, [nodeStyle, nodeStatus, graph, render]);
};
