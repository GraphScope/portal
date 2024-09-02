import { useCallback } from 'react';
import { useNodeStore } from '../../stores/useNodeStore';
import { Property } from '../../types/property';
import _ from 'lodash';
import { useEdgeStore } from '../../stores/useEdgeStore';
import { Node } from '../../types/node';
import { Edge } from '../../types/edge';
import { isArrayExist } from '../../utils';

// 目前 GPE 只设计 model.json
export const useEncodeCypher = () => {
  const nodes = useNodeStore(state => state.nodes);
  const editNode = useNodeStore(state => state.editNode);
  const edges = useEdgeStore(state => state.edges);
  const editEdge = useEdgeStore(state => state.editEdge);

  const encodeProperties = useCallback(() => {
    nodes.forEach((node: Node) => {
      const newProperties =
        node.properties &&
        node.properties.map((property: Property) => {
          return {
            ...property,
            statement: `${node.nodeKey}.${property.name} ${property.compare} ${property.value}`,
          };
        });
      const isEqual = _.isEqual(node.properties, newProperties);
      !isEqual && editNode && editNode({ ...node, properties: newProperties });
    });
  }, [nodes]);

  const encodeNodes = useCallback(() => {
    nodes.forEach(node => {
      const newStatement = node.data.data.label && `:${node.data.data.label}`;
      newStatement && editNode && editNode({ ...node, statement: newStatement });
    });
  }, [nodes]);

  const encodeEdges = useCallback(() => {
    edges.forEach(edge => {
      // @ts-ignore
      const newStatement = edge.data.data.label && `:${edge.data.data.label}`;
      newStatement && editEdge && editEdge({ ...edge, statement: newStatement });
    });
  }, [edges]);

  const generateMATCH = useCallback(() => {
    let edgesSnapShot = _.cloneDeep(edges);
    const currentEdge = edgesSnapShot.find(edge => !edge.isErgodic);
    let targetCurrentEdge: Edge | undefined = currentEdge;
    let sourceCurrentEdge: Edge | undefined = currentEdge;
    let targetNode: Node | undefined = nodes.find(node => node.nodeKey === currentEdge?.targetNode);
    let sourceNode: Node | undefined = nodes.find(node => node.nodeKey === currentEdge?.sourceNode);
    // when use it, set it's isErgodic true
    if (currentEdge) currentEdge.isErgodic = true;

    let MATCH = `[${currentEdge?.edgeKey}${currentEdge?.statement}]`;
    // 当前 egde target遍历
    if (targetNode) {
      while (true) {
        const isExistProperty = !!targetNode.properties;
        const nodeStatement = `(${targetNode.nodeKey}${targetNode.statement})`;
        MATCH = `${MATCH}->${nodeStatement}`;
        if (!targetNode.outRelations) break;
        const targetEdges = edgesSnapShot.filter(edge => isArrayExist(edge.edgeKey, [...targetNode!.outRelations!]));
        targetCurrentEdge = targetEdges.find(edge => !edge.isErgodic);
        if (!targetCurrentEdge) break;
        MATCH = `${MATCH}-[${targetCurrentEdge?.edgeKey}${targetCurrentEdge?.statement}]]`;
        targetNode = nodes.find(node => node.nodeKey === targetCurrentEdge?.targetNode);
        if (!targetNode) throw new Error('targetNode is not exist');
      }
    }
    // 当前 edge source遍历
    if (sourceNode) {
      while (true) {
        const isExistProperty = !!sourceNode.properties;
        const nodeStatement = `(${sourceNode.nodeKey}${sourceNode.statement})`;
        MATCH = `${nodeStatement}-${MATCH}`;
        if (!sourceNode.outRelations) break;
        const sourceEdges = edgesSnapShot.filter(edge => isArrayExist(edge.edgeKey, [...sourceNode!.outRelations!]));
        sourceCurrentEdge = sourceEdges.find(edge => !edge.isErgodic);
        if (!sourceCurrentEdge) break;
        MATCH = `[${sourceCurrentEdge?.edgeKey}${sourceCurrentEdge?.statement}]->${MATCH}`;
        sourceNode = nodes.find(node => node.nodeKey === sourceCurrentEdge?.sourceNode);
        if (!sourceNode) throw new Error('sourceNode is not exist');
      }
    }

    MATCH = `MATCH ${MATCH}`;
    console.log('MATCH语句生成结束，生成的MATCH语句是：', MATCH);
    return MATCH;
  }, [nodes, edges]);

  const generateWHERE = useCallback(() => {
    let propertiesStatement: string[] = [];
    nodes.forEach(node => {
      // WHERE  = node.properties.
      const propertiesSingleNodeStatement = node.properties?.map(property => `${property.statement}`);

      if (propertiesSingleNodeStatement)
        propertiesStatement = [...propertiesStatement, ...propertiesSingleNodeStatement];
    });

    const WHERE = `WHERE ${propertiesStatement.join(' AND ')}`;
    return WHERE;
  }, [nodes]);

  return {
    encodeProperties,
    encodeNodes,
    encodeEdges,
    generateMATCH,
    generateWHERE,
  };
};
