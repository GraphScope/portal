export const getBBox = (nodes: { position: { x: number; y: number } }[]) => {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  const padding = 100;
  nodes.forEach(node => {
    if (node.position.x < minX) minX = node.position.x;
    if (node.position.x > maxX) maxX = node.position.x;
    if (node.position.y < minY) minY = node.position.y;
    if (node.position.y > maxY) maxY = node.position.y;
  });

  let width = maxX - minX + padding;
  let height = maxY - minY + padding;
  return {
    x: minX,
    y: minY,
    width: width,
    height: height,
  };
};

let nodeIndex = 1;
let edgeIndex = 1;
export const createNodeLabel = () => `Vertex_${nodeIndex++}`;
export const createEdgeLabel = () => `Edge_${edgeIndex++}`;
