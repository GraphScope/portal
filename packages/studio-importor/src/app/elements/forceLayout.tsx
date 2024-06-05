// 引入 d3-force 模块
import { forceSimulation, forceLink, forceManyBody, forceCenter, forceCollide } from 'd3-force';
export interface IParams {
  iterations?: number;
  center?: { x: number; y: number };
}
export function createStaticForceLayout(nodes, edges, params: IParams = {}) {
  const { iterations = 300, center = { x: window.innerWidth / 2, y: window.innerHeight / 2 } } = params;
  // 创建力仿真
  const simulation = forceSimulation(nodes)
    .force(
      'link',
      forceLink(edges)
        .id(d => d.id)
        .distance(300),
    )
    .force('charge', forceManyBody().strength(-30))
    .force('center', forceCenter(center.x, center.y))
    .force('collide', forceCollide().radius(30))
    .stop(); // 停止自动的力仿真

  // 手动运行力仿真
  for (let i = 0; i < iterations; i++) {
    simulation.tick();
  }

  // 输出最终的节点和连线的位置
  nodes.forEach(node => {
    console.log(`Node ${node.id}: x = ${node.x}, y = ${node.y}`);
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
