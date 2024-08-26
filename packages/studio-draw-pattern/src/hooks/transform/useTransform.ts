import { ISchemaNode } from '@graphscope/studio-graph-editor/dist/types/node';
import { useCallback, useEffect } from 'react';
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
        ...node.data,
      },
    } as Node;
  }, []);

  const transformEdge = useCallback((edge: ISchemaEdge): Edge => {
    return {
      edgeKey: edge.id,
      data: {
        ...edge.data,
      },
    } as Edge;
  }, []);

  const transformNodes = useCallback((nodes: ISchemaNode[]) => {
    nodes.map(node => {
      node && addNode && addNode(transformNode(node));
    });
  }, []);

  const transformEdges = useCallback((edges: ISchemaEdge[]) => {
    edges.map(edge => {
      edge && addEdge && addEdge(transformEdge(edge));
    });
  }, []);

  return { transformNode, transformEdge, transformNodes, transformEdges };
};
