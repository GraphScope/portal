import { Edge } from "../../types/edge";
import { Node } from "../../types/node";
import { Variable } from "../../types/variable";
import deconstructProperty from "./deconstructProperty";
import deconstructVariable from "./deconstructVariable";

const deconstructEdge = (
  nodes: Node[],
  edges: RegExpMatchArray | null,
): { returnEdges: Edge[]; nodes: Node[]; returnVariables: Variable[] } => {
  let returnVariables: Variable[] = [];
  const typeRegexp = /(?<=\:)[\d\w\s]+?(?=[\{\]\s])/g;
  const nextRegexp = />$/g;
  let returnEdges: Edge[] = [];
  edges?.forEach((edge, edgeIndex) => {
    const type = edge.match(typeRegexp);
    let targetNode: Node = nodes[edgeIndex];
    let sourceNode: Node = nodes[edgeIndex + 1];
    if (edge.match(nextRegexp)) {
      targetNode = nodes[edgeIndex + 1];
      sourceNode = nodes[edgeIndex];
    }
    returnEdges.push({
      relationKey: `${edge}+${edgeIndex}`,
      targetNode: targetNode.nodeKey,
      sourceNode: sourceNode.nodeKey,
      type: type ? type[0] : "",
    });
    const variable = deconstructVariable(
      edge,
      "RELATION",
      returnEdges[edgeIndex].relationKey,
    );
    if (variable) {
      returnEdges[edgeIndex].variable = variable.variableKey;
      returnVariables.push(variable);
    }
    const propertyArrary = deconstructProperty(edge);
    propertyArrary.length !== 0 &&
      (returnEdges[edgeIndex].properties = propertyArrary);
  });

  returnEdges.forEach((item) => {
    const sourceNode = nodes.findIndex(
      (node) => node.nodeKey === item.sourceNode,
    );
    const targetNode = nodes.findIndex(
      (node) => node.nodeKey === item.targetNode,
    );
    nodes[sourceNode].outRelations.push(item.relationKey);
    nodes[targetNode].inRelations.push(item.relationKey);
  });

  return { returnEdges, nodes, returnVariables };
};

export default deconstructEdge;
