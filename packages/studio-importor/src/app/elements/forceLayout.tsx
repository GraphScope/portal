// 引入 d3-force 模块
import { forceSimulation, forceLink, forceManyBody, forceCenter, forceCollide } from 'd3-force';
export interface IParams {
  iterations?: number;
  center?: { x: number; y: number };
}
export function createStaticForceLayout(nodes, edges, params: IParams = {}) {
  const { iterations = 1000, center = { x: window.innerWidth / 2, y: window.innerHeight / 2 } } = params;
  const edgeDistance = 250;
  const nodeStrength = -1 * (edgeDistance * (edges.length === 0 ? 0.5 : 8));
  // 创建力仿真
  const simulation = forceSimulation(nodes)
    .force(
      'link',
      forceLink(edges)
        .id((d: any) => d.id)
        .distance(edgeDistance),
    )
    .force('charge', forceManyBody().strength(nodeStrength))
    // .force('center', forceCenter(center.x, center.y))
    .stop();

  // 手动运行力仿真
  for (let i = 0; i < iterations; i++) {
    simulation.tick();
  }

  // 输出最终的节点和连线的位置
  nodes.forEach(node => {
    delete node.index;
    delete node.vx;
    delete node.vy;
    node.position = { x: node.x, y: node.y };
    delete node.x;
    delete node.y;
  });

  edges.forEach(edge => {
    delete edge.index;
    edge.source = edge.source.id;
    edge.target = edge.target.id;
  });

  return { nodes, edges, simulation };
}
