import _ from 'lodash';
import { Edge } from '../types/edge';
import { Node } from '../types/node';
import { PropertySet, Property } from '../types/property';
import { isArrayExist } from '.';

export const encodeProperties = (
  encodeCallback: (changeProperties: PropertySet, preProperties: Property[], currentProperties: Property[]) => void,
  properties: PropertySet[],
) => {
  if (properties.length === 0) return;

  properties.forEach(properties => {
    const newProperties = properties.data.map(property => {
      // 检查 name, compare 和 value 是否存在
      if (!property.name || !property.compare || !property.value) {
        return property; // 如果其中一个不存在，返回原始的 property，不修改 statement
      }

      const isNumber = !isNaN(Number(property.value));
      const propertyValue = isNumber ? property.value : `'${property.value}'`;

      return {
        ...property,
        statement: `${property.name} ${property.compare} ${propertyValue}`,
      };
    });

    encodeCallback(properties, properties.data, newProperties);
  });
};

export const encodeNodes = (nodes: Node[], encodeSingleNodeCallback: (preNode: Node, currentNode: Node) => void) => {
  if (!nodes) return;

  nodes
    .filter(node => node !== undefined)
    .forEach(node => {
      const newStatement = node.label && `:${node.label}`;
      const newNodes: Node = {
        ...node,
        statement: newStatement ?? '',
      };
      encodeSingleNodeCallback(node, newNodes);
    });
};

export const encodeEdges = (edges: Edge[], encodeSingleEdgeCallback: (preEdge: Edge, currentEdge: Edge) => void) => {
  if (!edges) return;

  edges
    .filter(edge => edge !== undefined)
    .forEach(edge => {
      const newStatement = edge.label && `:${edge.label}`;
      const newEdges: Edge = {
        ...edge,
        statement: newStatement ?? '',
      };
      encodeSingleEdgeCallback(edge, newEdges);
    });
};

export const generateWHERE = (nodes: Node[], properties: PropertySet[]) => {
  const WHEREs: string[] = [];
  if (nodes.length === 0) return '';

  properties.forEach(properties => {
    const currentNode = nodes.find(node => node.id === properties.belongId);
    if (!currentNode) return;

    const currentProperties = properties.data
      ?.filter(property => property.statement) // 过滤掉没有 statement 的属性
      .map(property => {
        return `${currentNode.variable}.${property.statement}`;
      });

    if (currentProperties && currentProperties.length > 0) {
      WHEREs.push(`WHERE ${currentProperties.join(' AND ')}`);
    }
  });

  return WHEREs.join('\n');
};

export const generateMATCH = (nodes: Node[], edges: Edge[]) => {
  let edgesSnapShot = _.cloneDeep(edges);

  if (edges.length === 0) {
    const MATCHs = nodes.map(node => {
      return `MATCH: (${node.variable}${node.statement})`;
    });

    return MATCHs;
  }

  const MATCHs: string[] = [];

  while (true) {
    const currentEdge = edgesSnapShot.find(edge => !edge.isErgodic);
    if (!currentEdge) break;
    let targetCurrentEdge: Edge | undefined = currentEdge;
    let sourceCurrentEdge: Edge | undefined = currentEdge;
    let targetNode: Node | undefined = nodes.find(node => node.id === currentEdge?.targetNode);
    let sourceNode: Node | undefined = nodes.find(node => node.id === currentEdge?.sourceNode);
    // when use it, set it's isErgodic true
    if (currentEdge) currentEdge.isErgodic = true;

    let MATCH = `[${currentEdge.variable}${currentEdge?.statement}]`;

    // 当前 egde target遍历
    if (targetNode) {
      while (true) {
        // 是否存在目标节点
        // const isExistProperty = !!targetNode.properties;
        const nodeStatement = targetNode.variable
          ? `(${targetNode.variable}${targetNode.statement})`
          : `(${targetNode.statement})`;
        MATCH = `${MATCH}->${nodeStatement}`;
        targetCurrentEdge.isErgodic = true;
        if (!targetNode.outRelations) break;
        const targetEdges = edgesSnapShot.filter(edge => isArrayExist(edge.id, [...targetNode!.outRelations!]));
        targetCurrentEdge = targetEdges.find(edge => !edge.isErgodic);
        if (!targetCurrentEdge) break;
        MATCH = `${MATCH}-[${targetCurrentEdge.variable}${targetCurrentEdge?.statement}]`;
        targetNode = nodes.find(node => node.id === targetCurrentEdge?.targetNode);
        if (!targetNode) throw new Error('targetNode is not exist');
      }
    }
    // 当前 edge source遍历
    if (sourceNode) {
      while (true) {
        // 是否存在源节点
        // const isExistProperty = !!sourceNode.properties;
        const nodeStatement = sourceNode.variable
          ? `(${sourceNode.variable}${sourceNode.statement})`
          : `(${sourceNode.statement})`;
        MATCH = `${nodeStatement}-${MATCH}`;
        sourceCurrentEdge.isErgodic = true;
        if (!sourceNode.inRelations) break;
        const sourceEdges = edgesSnapShot.filter(edge => isArrayExist(edge.id, [...sourceNode!.inRelations!]));
        sourceCurrentEdge = sourceEdges.find(edge => !edge.isErgodic);
        if (!sourceCurrentEdge) break;
        MATCH = `[${sourceCurrentEdge.variable}${sourceCurrentEdge?.statement}]->${MATCH}`;
        sourceNode = nodes.find(node => node.id === sourceCurrentEdge?.sourceNode);
        if (!sourceNode) throw new Error('sourceNode is not exist');
      }
    }

    MATCH = `MATCH ${MATCH}`;
    MATCHs.push(MATCH);
  }

  return MATCHs;
};
