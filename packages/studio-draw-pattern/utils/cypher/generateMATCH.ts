import type { Edge } from "../../types/edge";
import type { Node } from "../../types/node";
import hasIntersection from "../public_functions/hasIntersection";
import { Variable } from "../../types/variable";

interface ReturnValueProps {
  MATCH: string;
  edges: Edge[];
  nextNode: Node;
}

type Arrow = "->" | "<-";
type Direction = "TARGET" | "SOURCE";

const generateMATCH = (
  nodes: Node[],
  edges: Edge[],
  variables: Variable[],
): string[] => {
  let MATCHs: string[] = [];
  while (edges.length !== 0) {
    const startEdge = edges[0];
    let MATCH: string = startEdge.statement!;
    // 进行sourceNode进行遍历
    ({ edges, MATCH, nodes } = ergodicNode(
      startEdge,
      MATCH,
      "SOURCE",
      nodes,
      edges,
      variables,
    ));
    // 进行targetNode进行遍历
    ({ edges, MATCH, nodes } = ergodicNode(
      startEdge,
      MATCH,
      "TARGET",
      nodes,
      edges,
      variables,
    ));
    MATCHs.push("MATCH " + MATCH);
  }
  return MATCHs;
};

// 当节点遍历过后将isErgodic设置为true,再次使用时可以直接用变量替代
const changeErgodicNode = (nodes: Node[], node: Node): Node[] => {
  const nodeIndex = nodes.findIndex((item) => item.nodeKey === node.nodeKey);
  nodes[nodeIndex].isErgodic = true;
  return nodes;
};

// 对edge的target&source方向进行遍历
const ergodicNode = (
  edge: Edge,
  MATCH: string,
  direction: Direction,
  nodes: Node[],
  edges: Edge[],
  variables: Variable[],
) => {
  let returnValue: ReturnValueProps | null = edgeNext(
    edge,
    MATCH,
    direction,
    nodes,
    edges,
    "->",
    variables,
  );
  while (returnValue !== null) {
    nodes = changeErgodicNode(nodes, returnValue?.nextNode);
    edges = returnValue.edges;
    MATCH = returnValue.MATCH;
    returnValue = nodeNext(
      returnValue.nextNode,
      returnValue.MATCH,
      direction,
      nodes,
      returnValue.edges,
      variables,
    );
  }
  return { edges, MATCH, nodes };
};

const deleteEdge = (edges: Edge[], deleteEdge: Edge): Edge[] => {
  return edges.filter((edge) => edge !== deleteEdge);
};

const edgeNext = (
  edge: Edge,
  MATCH: string,
  direction: Direction,
  nodes: Node[],
  edges: Edge[],
  arrow: Arrow = "->",
  variables: Variable[],
): ReturnValueProps | null => {
  // 拿到当前边界的targe或者source节点
  let nextDirectionNode: string = "";
  let renderArrow: string = arrow;
  // 对->和<-和-进行处理
  if (direction === "TARGET") {
    if (arrow === "->") nextDirectionNode = edge.targetNode;
    else {
      nextDirectionNode = edge.sourceNode;
      renderArrow = "-";
    }
  } else {
    if (arrow === "->") {
      nextDirectionNode = edge.sourceNode;
      renderArrow = "-";
    } else nextDirectionNode = edge.targetNode;
  }
  const nextNode = nodes.find((node) => node.nodeKey === nextDirectionNode);
  // 检测是否可以用变量替代
  const renderNode =
    nextNode?.isErgodic && nextNode.variables
      ? `(${variables.find((item) => item.variableKey === nextNode.variables)?.name})`
      : nextNode?.statement;
  if (nextNode) {
    // 进行字符串拼接
    direction === "TARGET"
      ? (MATCH += `${renderArrow}${renderNode}`)
      : (MATCH = `${renderNode}${renderArrow}` + MATCH);
    edges = deleteEdge(edges, edge);
  } else return null;
  return { MATCH, edges, nextNode };
};

const nodeNext = (
  node: Node,
  MATCH: string,
  direction: Direction,
  nodes: Node[],
  edges: Edge[],
  variables: Variable[],
) => {
  const nextDirectionRelations: string[] = [
    ...node.inRelations,
    ...node.outRelations,
  ];
  // 判断当前节点是否还有relations
  if (nextDirectionRelations.length !== 0) {
    const relationsKeysArray: string[] = edges.map(
      (item, index) => item.relationKey,
    );
    // 判断两个数组是否有交集
    const intersectionEdges: string[] = hasIntersection(
      relationsKeysArray,
      nextDirectionRelations,
    );
    // 如果两个数组的交集数组的长度为0 那么直接返回null
    if (intersectionEdges.length === 0) return null;
    const nextEdge: Edge = edges.find(
      (item) => item.relationKey === intersectionEdges[0],
    ) as Edge;

    edges = deleteEdge(edges, nextEdge!);
    const nextRelations =
      direction === "TARGET" ? node.outRelations : node.inRelations;

    const arrow = nextRelations.find((item) => item === nextEdge.relationKey)
      ? "->"
      : "<-";

    // 对->和<-和-进行处理
    let renderArrow = arrow;
    if (
      (direction === "TARGET" && arrow === "->") ||
      (direction === "SOURCE" && arrow === "<-")
    )
      renderArrow = "-";
    // 进行字符串拼接
    direction === "TARGET"
      ? (MATCH += `${renderArrow}${nextEdge?.statement}`)
      : (MATCH = `${nextEdge?.statement}${renderArrow}` + MATCH);
    // 调用degeNext再次进行拼接
    const returnEdgeValue = edgeNext(
      nextEdge,
      MATCH,
      direction,
      nodes,
      edges,
      arrow,
      variables,
    );
    return returnEdgeValue;
  } else return null;
};
export default generateMATCH;
