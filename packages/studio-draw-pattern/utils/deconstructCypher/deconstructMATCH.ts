import { Edge } from "../../types/edge";
import { Node } from "../../types/node";
import { Variable } from "../../types/variable";
import deconstructEdge from "./deconstructEdge";
import deconstructNode from "./deconstructNode";

const deconstructMATCH = async (query: string) => {
  const str = query;
  const nodeRegexp = /\(.+?\)/g;
  const pathRegexp = /\<?-\[.+?\]-\>?/g;
  const nodes: RegExpMatchArray | null = str.match(nodeRegexp);
  const paths: RegExpMatchArray | null = str.match(pathRegexp);
  const deconstructNodeReturn = deconstructNode(nodes);
  let nodesJSON: Node[] = [];
  let variableJSON: Variable[] = [];
  let edgesJSON: Edge[] = [];
  if (deconstructNodeReturn) {
    nodesJSON = deconstructNodeReturn.returnNodes;
    variableJSON = [...deconstructNodeReturn.returnVariables, ...variableJSON];
  }

  const deconstructEdgeReturn = deconstructEdge(nodesJSON, paths);
  if (deconstructEdgeReturn) {
    nodesJSON = deconstructEdgeReturn.nodes;
    edgesJSON = [...deconstructEdgeReturn.returnEdges];
    variableJSON = [...deconstructEdgeReturn.returnVariables, ...variableJSON];
  }
  // console.log(nodesJSON);
  const totalJSON = JSON.stringify({
    nodes: nodesJSON,
    relations: edgesJSON,
    variables: variableJSON,
  });
  return totalJSON;
};

export default deconstructMATCH;
