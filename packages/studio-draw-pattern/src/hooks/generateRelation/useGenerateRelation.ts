import { useNodeStore } from '../../stores/useNodeStore';
import { useCallback, useEffect } from 'react';
import { Node } from '../../types/node';
import { Edge } from '../../types/edge';

export const useGenerateRelation = () => {
  const editNode = useNodeStore(state => state.editNode);

  const generateRelation = useCallback((nodes: Node[], edges: Edge[]) => {
    console.log('开始生成');
    edges.map(edge => {
      const sourceNode = nodes.find(node => node.nodeKey === edge.sourceNode);
      if (sourceNode && editNode) {
        console.log('生成出节点关系');
        editNode({
          ...sourceNode,
          outRelations: [...(sourceNode.outRelations || []), edge.edgeKey],
        });
      }

      const targetNode = nodes.find(node => node.nodeKey === edge.targetNode);
      if (targetNode && editNode) {
        console.log('生成进节点关系');
        editNode({
          ...targetNode,
          inRelations: [...(targetNode.inRelations || []), edge.edgeKey],
        });
      }
    });
  }, []);

  return { generateRelation };
};
