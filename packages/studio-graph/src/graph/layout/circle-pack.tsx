import { pack, hierarchy } from 'd3-hierarchy';
import { Utils } from '@graphscope/studio-components';
import { handleNodeStyle } from '../utils/handleStyle';
import { GraphData } from '../types';
import { get } from '../utils';

interface TreeNode {
  children: TreeNode[];
  name: string;
}

export interface CirclePackOptions {
  width: number;
  height: number;
  nodeStyle: any;
  groupBy: string;
}

export const runCirclePack = (data: GraphData, options: CirclePackOptions) => {
  const { width, height, groupBy, nodeStyle } = options;
  const groupedData = Utils.groupBy(data.nodes, node => {
    return get(node, groupBy);
  });

  const root: TreeNode = { name: 'root', children: [] };

  for (const [key, nodes] of Object.entries(groupedData)) {
    root.children.push({ name: key, children: nodes as TreeNode[] });
  }
  const rootNode = hierarchy<TreeNode>(root).sort((a, b) => {
    try {
      // 如果 label 是数字，则按照数字大小排序
      return Number(a.data.name) - Number(b.data.name);
    } catch (error) {
      return 0;
    }
  });

  const padding = 20;
  const packLayput = pack<TreeNode>()
    .size([width, height])
    .padding(padding)
    .radius(d => {
      //@ts-ignore
      const { size } = handleNodeStyle(d.data, nodeStyle);
      const R = Math.round(Math.sqrt(Math.max(0, size)) * 4 + 2 - padding / 2);
      return R;
    });

  packLayput(rootNode);

  let nodes = [];

  rootNode.descendants().forEach(node => {
    //@ts-ignore
    const { data, r, depth } = node;
    const { x, y } = node;
    if (depth > 1) {
      //@ts-ignore
      nodes.push({
        ...data,
        x,
        y,
        r,
      });
    }
  });

  // 绘制分组节点

  const combos = (rootNode.children || []).map(d => {
    const { x, y } = d;
    const { color } = handleNodeStyle({ id: d.data.name, label: d.data.name }, nodeStyle);

    return {
      id: d.data.name,
      label: d.data.name,
      type: 'circle',
      x: x,
      y: y,
      color,
      r: (d as any).r,
      children: d.data.children.map(child => {
        //@ts-ignore
        return child.id;
      }),
    };
  });

  return { nodes, edges: data.edges, combos };
};
