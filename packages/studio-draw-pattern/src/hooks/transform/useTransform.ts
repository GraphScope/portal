import { ISchemaNode } from '@graphscope/studio-graph-editor';
import { useCallback } from 'react';
import { Node } from '../../types/node';
import { ISchemaEdge } from '@graphscope/studio-graph-editor';
import { Edge } from '../../types/edge';
import { useNodeStore } from '../../stores/useNodeStore';
import { useEdgeStore } from '../../stores/useEdgeStore';
import { useGraphStore } from '../../stores/useGraphStore';

export const useTransform = () => {
  const addNode = useNodeStore(state => state.addNode);
  const addEdge = useEdgeStore(state => state.addEdge);
  const updateGraphNode = useGraphStore(state => state.updateGraphNode);
  const updateGraphEdge = useGraphStore(state => state.updateGraphEdge);

  const transformNode = useCallback((node: ISchemaNode): Node => {
    return {
      id: node.id,
      label: node.data.label,
    } as Node;
  }, []);

  const transformEdge = useCallback((edge: ISchemaEdge): Edge => {
    return {
      id: edge.id,
      label: edge.data.label,
      sourceNode: edge.source,
      targetNode: edge.target,
    } as Edge;
  }, []);

  const transformNodes = useCallback((nodes: ISchemaNode[]) => {
    // console.log('传入的节点', nodes);
    nodes.map(node => {
      node && addNode && addNode(transformNode(node));
      updateGraphNode(node);
    });
  }, []);

  const transformEdges = useCallback((edges: ISchemaEdge[], nodes: ISchemaNode[]) => {
    // console.log('传入的路径', edges);
    edges.map(edge => {
      const isEdgeExist = checkEdgeExist(edge, nodes);
      isEdgeExist && edge && addEdge && addEdge(transformEdge(edge));
      isEdgeExist && updateGraphEdge(edge);
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
