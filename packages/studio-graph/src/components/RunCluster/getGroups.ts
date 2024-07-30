import { pack, hierarchy } from 'd3-hierarchy';
import { Utils } from '@graphscope/studio-components';
import { handleStyle } from '../../graph/handleStyle';

export const getGroups = (nodes, { width, height, screen2GraphCoords, nodeStyle }) => {
  const groupedData = Utils.groupBy(nodes, node => {
    return node.label;
  });
  const root = { name: 'root', children: [] };

  for (const [label, nodes] of Object.entries(groupedData)) {
    //@ts-ignore
    root.children.push({ name: label, children: nodes });
  }
  const rootNode = hierarchy(root)
    // .sum(d => {
    //   return d.size || 9;
    // })
    .sort((a, b) => {
      try {
        // 如果 label 是数字，则按照数字大小排序
        return Number(a.data.name) - Number(b.data.name);
      } catch (error) {
        return 0;
      }
    });

  // Circle Packing 布局，计算分组中心
  const packLayput = pack()
    .size([width, height])
    .padding(20)
    .radius(d => {
      const { size } = handleStyle(d.data, nodeStyle, 'node');
      const R = Math.round(Math.sqrt(Math.max(0, size)) * 4 + 2);
      return R / 2 || 1;
    });

  packLayput(rootNode);

  // 绘制分组节点
  const groups = rootNode.children.map(d => {
    const { x, y } = screen2GraphCoords(d.x, d.y);
    const { color } = handleStyle({ label: d.data.name }, nodeStyle, 'node');
    return {
      id: d.data.name,
      label: d.data.name,
      x: x,
      y: y,
      r: d.r,
      color,
    };
  });
  return groups;
};
