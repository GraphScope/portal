import { Node } from 'reactflow';

export const getBBox = (nodes: Node[]) => {
  const xs = nodes.map(node => node.position.x);
  const ys = nodes.map(node => node.position.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  return {
    x: minX,
    y: minY,
    width: maxX - minX + 100,
    height: maxY - minY + 100,
  };
};

let nodeIndex = 1;
let edgeIndex = 1;
export const createNodeLabel = () => `Vertex_${nodeIndex++}`;
export const createEdgeLabel = () => `Edge_${edgeIndex++}`;
export const resetIndex = () => {
  nodeIndex = 1;
  edgeIndex = 1;
};
export const fakeSnapshot = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};