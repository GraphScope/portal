import _ from 'lodash';
import { Edge } from '../types/edge';
import { Node } from '../types/node';
import { Properties, Property } from '../types/property';
import { isArrayExist } from '.';

export const encodeProperties = (
  encodeCallback: (changeProperties: Properties, preProperties: Property[], currentProperties: Property[]) => void,
  properties: Properties[],
) => {
  properties.forEach(properties => {
    const newProperties = properties.data.map(property => {
      return {
        ...property,
        statement: `${property.name} ${property.compare} ${property.value}`,
      };
    });
    encodeCallback(properties, properties.data ?? [], newProperties ?? []);
  });
};

export const encodeNodes = (nodes: Node[], encodeSingleNodeCallback: (preNode: Node, currentNode: Node) => void) => {
  if (!nodes) return;

  nodes
    .filter(node => node !== undefined)
    .forEach(node => {
      const newStatement = node.data?.data?.label && `:${node.data.data.label}`;
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
      const newStatement = edge?.data?.data?.label && `:${edge.data.data.label}`;
      const newEdges: Edge = {
        ...edge,
        statement: newStatement ?? '',
      };
      encodeSingleEdgeCallback(edge, newEdges);
    });
};

export const generateWHERE = (nodes: Node[], properties: Properties[]) => {
  const WHEREs: string[] = [];
  properties.forEach(properties => {
    const currentNode = nodes.find(node => node.nodeKey === properties.belongId);
    const currentProperties = properties.data?.map(property => {
      return `${currentNode?.variable}.${property.statement}`;
    });
    WHEREs.push(`WHERE ${currentProperties?.join(' AND ')}`);
  });
  return WHEREs.join('\n');
};

export const generateMATCH = (nodes: Node[], edges: Edge[]) => {
  let edgesSnapShot = _.cloneDeep(edges);

  console.log(edgesSnapShot);

  const MATCHs: string[] = [];

  while (true) {
    const currentEdge = edgesSnapShot.find(edge => !edge.isErgodic);
    console.log('currentEdge', currentEdge);
    console.log('edgesSnapShot', edgesSnapShot);
    if (!currentEdge) break;
    let targetCurrentEdge: Edge | undefined = currentEdge;
    let sourceCurrentEdge: Edge | undefined = currentEdge;
    let targetNode: Node | undefined = nodes.find(node => node.nodeKey === currentEdge?.targetNode);
    let sourceNode: Node | undefined = nodes.find(node => node.nodeKey === currentEdge?.sourceNode);
    // when use it, set it's isErgodic true
    if (currentEdge) currentEdge.isErgodic = true;

    let MATCH = `[${currentEdge?.statement}]`;
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
        const targetEdges = edgesSnapShot.filter(edge => isArrayExist(edge.edgeKey, [...targetNode!.outRelations!]));
        targetCurrentEdge = targetEdges.find(edge => !edge.isErgodic);
        if (!targetCurrentEdge) break;
        MATCH = `${MATCH}-[${targetCurrentEdge?.statement}]`;
        targetNode = nodes.find(node => node.nodeKey === targetCurrentEdge?.targetNode);
        if (!targetNode) throw new Error('targetNode is not exist');
      }
    }
    // 当前 edge source遍历
    if (sourceNode) {
      while (true) {
        // 是否存在源节点
        console.log('sourceNode 源节点', sourceNode);
        // const isExistProperty = !!sourceNode.properties;
        const nodeStatement = sourceNode.variable
          ? `(${sourceNode.variable}${sourceNode.statement})`
          : `(${sourceNode.statement})`;
        MATCH = `${nodeStatement}-${MATCH}`;
        sourceCurrentEdge.isErgodic = true;
        if (!sourceNode.inRelations) break;
        const sourceEdges = edgesSnapShot.filter(edge => isArrayExist(edge.edgeKey, [...sourceNode!.inRelations!]));
        sourceCurrentEdge = sourceEdges.find(edge => !edge.isErgodic);
        console.log('继续往前走 sourceCurrentEdge', sourceCurrentEdge);
        if (!sourceCurrentEdge) break;
        MATCH = `[${sourceCurrentEdge?.statement}]->${MATCH}`;
        sourceNode = nodes.find(node => node.nodeKey === sourceCurrentEdge?.sourceNode);
        if (!sourceNode) throw new Error('sourceNode is not exist');
      }
    }

    MATCH = `MATCH ${MATCH}`;
    MATCHs.push(MATCH);
  }

  return MATCHs;
};
