import { ISchemaNode } from '@graphscope/studio-graph-editor/dist/types/node';
import { useCallback } from 'react';
import { Node } from '../../types/node';
import { ISchemaEdge } from '@graphscope/studio-graph-editor/dist/types/edge';
import { Edge } from '../../types/edge';
import { useNodeStore } from '../../stores/useNodeStore';
import { useEdgeStore } from '../../stores/useEdgeStore';

export const useTransform = () => {
  const addNode = useNodeStore(state => state.addNode);
  const addEdge = useEdgeStore(state => state.addEdge);

  const transformNode = useCallback((node: ISchemaNode): Node => {
    return {
      nodeKey: node.id,
      data: {
        ...node,
      },
    } as Node;
  }, []);

  const transformEdge = useCallback((edge: ISchemaEdge): Edge => {
    return {
      edgeKey: edge.id,
      data: {
        ...edge,
      },
    } as Edge;
  }, []);

  const transformNodes = useCallback((nodes: ISchemaNode[]) => {
    nodes.map(node => {
      node && addNode && addNode(transformNode(node));
    });
  }, []);

  const transformEdges = useCallback((edges: ISchemaEdge[], nodes: ISchemaNode[]) => {
    edges.map(edge => {
      checkEdgeExist(edge, nodes) && edge && addEdge && addEdge(transformEdge(edge));
    });
  }, []);

  // 判断 edge 的 source & node 是否存在，要求必须这条的 edge 的 source & node 节点都存在，才能添加到 store 中
  const checkEdgeExist = useCallback((edge: ISchemaEdge, nodes: ISchemaNode[]) => {
    const isSourceExist = nodes.some(node => node.id === edge.source);
    const isTargetExist = nodes.some(node => node.id === edge.target);
    return isSourceExist && isTargetExist;
  }, []);

  return { transformNode, transformEdge, transformNodes, transformEdges };
};
