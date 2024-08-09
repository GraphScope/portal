import { pack, hierarchy } from 'd3-hierarchy';
import { Utils } from '@graphscope/studio-components';
import { handleStyle } from '../graph/handleStyle';

interface NodeData {
  children: NodeData[];
  name: string;
}

export function get(obj, path) {
  if (obj == null || typeof path !== 'string') return undefined;

  let keys = 0,
    key = '',
    len = path.length,
    result = obj;

  while (keys < len) {
    const char = path[keys];
    if (char === '.') {
      result = result[key];
      if (result == null) return undefined;
      key = '';
    } else {
      key += char;
    }
    keys++;
  }

  return result[key];
}

export const getGroups = (nodes, { width, height, screen2GraphCoords, nodeStyle, clusterKey }) => {
  const groupedData = Utils.groupBy(nodes, node => {
    return get(node, clusterKey);
  });

  const root: NodeData = { name: 'root', children: [] };

  for (const [key, nodes] of Object.entries(groupedData)) {
    root.children.push({ name: key, children: nodes as NodeData[] });
  }
  const rootNode = hierarchy<NodeData>(root).sort((a, b) => {
    try {
      // 如果 label 是数字，则按照数字大小排序
      return Number(a.data.name) - Number(b.data.name);
    } catch (error) {
      return 0;
    }
  });
  const padding = 20;
  const packLayput = pack<NodeData>()
    .size([width, height])
    .padding(padding)
    .radius(d => {
      const { size } = handleStyle(d.data, nodeStyle, 'node');
      const R = Math.round(Math.sqrt(Math.max(0, size)) * 4 + 2 - padding / 2);
      return R;
    });

  packLayput(rootNode);

  // 绘制分组节点
  const groups = (rootNode.children || []).map(d => {
    const { x, y } = screen2GraphCoords(d.x, d.y);
    const { color } = handleStyle({ label: d.data.name }, nodeStyle, 'node');
    return {
      id: d.data.name,
      cluster: d.data.name,
      x: x,
      y: y,
      r: (d as any).r,
      color,
    };
  });

  const groupsMap = new Map();
  groups.forEach(group => {
    groupsMap.set(group.id, group);
  });
  return { groups, groupsMap };
};
