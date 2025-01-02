/**
 *
 * @param data 画布中的图数据
 * @param responseData 扩展出来的图数据
 * @returns
 */
export const handleExpand = (data, responseData) => {
  const { nodes = [], edges = [] } = responseData || {};
  return {
    nodes: uniqueElementsBy([...data.nodes, ...nodes], (a, b) => {
      return a.id === b.id;
    }),
    edges: uniqueElementsBy([...data.edges, ...edges], (a, b) => {
      if (a.id && b.id) {
        return a.id === b.id;
      }
      const sourceA = typeof a.source === 'object' ? a.source.id : a.source;
      const sourceB = typeof b.source === 'object' ? b.source.id : b.source;
      const targetA = typeof a.target === 'object' ? a.target.id : a.target;
      const targetB = typeof b.target === 'object' ? b.target.id : b.target;
      if (a.__controlPoints) {
        delete a.__controlPoints;
      }
      if (b.__controlPoints) {
        delete b.__controlPoints;
      }
      return sourceA === sourceB && targetA === targetB;
    }),
  };
};

/** 数据去重 */
export const uniqueElementsBy = (arr: any[], fn: (arg0: any, arg1: any) => any) =>
  arr.reduce((acc, v) => {
    if (!acc.some((x: any) => fn(v, x))) acc.push(v);
    return acc;
  }, []);
