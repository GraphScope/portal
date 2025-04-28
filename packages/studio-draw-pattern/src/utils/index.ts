import { ISchemaNode } from '@graphscope/studio-flow-editor';

export function isArrayExist<T>(item: T, arrary: Array<T>): boolean {
  return arrary.indexOf(item) !== -1;
}

export function getSequentialLetter(): () => string {
  const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
  let index = 0;

  return function () {
    if (index >= letters.length) {
      throw new Error('No more letters to choose from');
    }

    const letter = letters[index];
    index++; // Move to the next letter in sequence
    return letter;
  };
}

export const updateNodePositions = (nodes: ISchemaNode[]): ISchemaNode[] => {
  const updatedNodes: ISchemaNode[] = []; // 初始化一个新的数组

  nodes.forEach((node, index) => {
    let { x, y } = node.position ?? { x: Math.random() * 200, y: Math.random() * 200 };

    const spacing = 200; // 节点之间的最小间隔

    console.log(node.id);

    while (
      updatedNodes.some(
        n => n.id !== node.id && Math.abs(n.position.x - x) < spacing && Math.abs(n.position.y - y) < spacing,
      )
    ) {
      console.log('collision');
      x += spacing; // 向右移动
      // 如果向右移动之后仍然有重叠，尝试向下移动
      if (
        updatedNodes.some(
          n => n.id !== node.id && Math.abs(n.position.x - x) < spacing && Math.abs(n.position.y - y) < spacing,
        )
      ) {
        y += spacing; // 向下移动
        x -= spacing; // 还原到原来的 x 位置
      }
    }

    updatedNodes.push({ ...node, position: { x, y }, width: 100, height: 100 }); // 将更新后的节点添加到数组
  });

  return updatedNodes;
};
