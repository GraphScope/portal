import { useNodeStore } from '../../stores/useNodeStore';
import { useCallback } from 'react';
import { Node } from '../../types/node';
import { Edge } from '../../types/edge';

export const useGenerateRelation = () => {
  const editNode = useNodeStore(state => state.editNode);
  const nodes = useNodeStore(state => state.nodes);

  const generateRelation = useCallback(
    (edges: Edge[]) => {
      const newNodes = [...nodes]; // 创建节点副本来存储中间状态
      edges.forEach(edge => {
        const sourceNodeIndex = newNodes.findIndex(node => node.id === edge.sourceNode);
        const targetNodeIndex = newNodes.findIndex(node => node.id === edge.targetNode);

        if (sourceNodeIndex !== -1 && targetNodeIndex !== -1) {
          const sourceNode = newNodes[sourceNodeIndex];
          const targetNode = newNodes[targetNodeIndex];

          if (sourceNode === targetNode) {
            newNodes[sourceNodeIndex] = {
              ...sourceNode,
              outRelations: new Set([...(sourceNode.outRelations || []), edge.id]),
              inRelations: new Set([...(sourceNode.inRelations || []), edge.id]),
            };
          } else {
            if (sourceNode) {
              newNodes[sourceNodeIndex] = {
                ...sourceNode,
                outRelations: new Set([...(sourceNode.outRelations || []), edge.id]),
              };
            }
            if (targetNode) {
              newNodes[targetNodeIndex] = {
                ...targetNode,
                inRelations: new Set([...(targetNode.inRelations || []), edge.id]),
              };
            }
          }
        }
      });

      newNodes.forEach(node => {
        editNode && editNode(node); // 一次性更新状态
      });
    },
    [nodes],
  );

  return { generateRelation };
};
