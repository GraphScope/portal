import type { DataMap } from '../types';
export function getDataMap(data): DataMap {
  const dataMap = new Map(); // 使用 Map 而不是对象
  const nodesMap = new Map(); // 用于快速查找节点

  // 首先处理所有节点
  data.nodes.forEach(node => {
    const { id } = node;
    nodesMap.set(id, {
      ...node,
      neighbors: [],
      inNeighbors: [],
      outNeighbors: [],
      inEdges: [],
      outEdges: [],
    });
    dataMap.set(id, nodesMap.get(id));
  });

  // 然后处理所有边
  data.edges.forEach((edge, index) => {
    const source = edge.source.id || edge.source; // 兼容force-graph source-object
    const target = edge.target.id || edge.target;
    const { id } = edge;
    if (!id) {
      throw new Error('edge id is required');
    }
    const sourceNode = nodesMap.get(source);
    const targetNode = nodesMap.get(target);

    // 确保边在映射中
    if (!dataMap.has(id)) {
      dataMap.set(id, edge);
    }

    if (!sourceNode || !targetNode) {
      console.log('edge source or target node not found', source, target);
      return;
    }

    // 更新出边和出邻居
    sourceNode.outEdges.push(id);
    sourceNode.outNeighbors.push(target);

    // 更新入边和入邻居
    targetNode.inEdges.push(id);
    targetNode.inNeighbors.push(source);

    // 更新通用邻居列表
    sourceNode.neighbors.push(target);
    targetNode.neighbors.push(source);
  });

  return dataMap;
}
