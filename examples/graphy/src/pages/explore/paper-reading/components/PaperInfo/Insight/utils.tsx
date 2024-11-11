interface Node {
  id: number;
  [key: string]: any; // 允许其他属性
}

interface Edge {
  source: number;
  target: number;
}

export function deleteLeafNodes(graph) {
  const { nodes, edges } = graph;
  const leafNodeIds: number[] = [];

  // 找出叶子节点
  nodes.forEach(node => {
    const connectedEdges = edges.filter(edge => edge.source === node.id || edge.target === node.id);
    if (connectedEdges.length === 1) {
      leafNodeIds.push(node.id);
    }
  });

  // 移除叶子节点和相关的边
  const updatedNodes = nodes.filter(node => !leafNodeIds.includes(node.id));
  const updatedEdges = edges.filter(edge => !leafNodeIds.includes(edge.source) && !leafNodeIds.includes(edge.target));

  // 返回更新后的图
  return { nodes: updatedNodes, edges: updatedEdges };
}
