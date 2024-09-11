import _ from 'lodash';
import { Edge } from '../types/edge';
import { Node } from '../types/node';
import { Property } from '../types/property';
import { isArrayExist } from '.';

export const encodeProperties = (
  nodes: Node[],
  encodeCallback: (currentNode: Node, preProperties: Property[], currentProperties: Property[]) => void,
) => {
  nodes.forEach((node: Node) => {
    const newProperties =
      node.properties &&
      node.properties.map((property: Property) => {
        return {
          ...property,
          statement: `${property.name} ${property.compare} ${property.value}`,
        };
      });
    encodeCallback(node, node.properties ?? [], newProperties ?? []);
  });
};

export const encodeNodes = (nodes: Node[], encodeSingleNodeCallback: (preNode: Node, currentNode: Node) => void) => {
  nodes.forEach(node => {
    const newStatement = node.data.data.label && `:${node.data.data.label}`;
    const newNodes: Node = {
      ...node,
      statement: newStatement,
    };
    encodeSingleNodeCallback(node, newNodes);
  });
};

export const encodeEdges = (edges: Edge[], encodeSingleEdgeCallback: (preEdge: Edge, currentEdge: Edge) => void) => {
  edges.forEach(edge => {
    // @ts-ignore
    const newStatement = edge.data.data.label && `:${edge.data.data.label}`;
    const newEdges: Edge = {
      ...edge,
      statement: newStatement,
    };
    encodeSingleEdgeCallback(edge, newEdges);
  });
};

export const generateWHERE = (nodes: Node[]) => {
  let propertiesStatement: string[] = [];
  nodes.forEach(node => {
    const propertiesSingleNodeStatement = node.properties?.map(property => `${node.variable}.${property.statement}`);

    if (propertiesSingleNodeStatement) {
      propertiesStatement = [...propertiesStatement, ...propertiesSingleNodeStatement];
    }
  });

  // TODO: 目前只有 AND， 未来想一个更好的交互方式展示其他比如说 NOT， OR
  const WHERE = `WHERE ${propertiesStatement.join(' AND ')}`;
  return WHERE;
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
        const isExistProperty = !!targetNode.properties;
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
        console.log('sourceNode 源节点', sourceNode);
        const isExistProperty = !!sourceNode.properties;
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
    console.log('MATCH语句生成结束，生成的MATCH语句是：', MATCH);
    MATCHs.push(MATCH);
  }

  console.log('MATCHs', JSON.stringify(MATCHs));

  return MATCHs;
};
