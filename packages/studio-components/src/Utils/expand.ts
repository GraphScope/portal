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
      return a.source === b.source && a.target === b.target;
    }),
  };
};

/** 数据去重 */
export const uniqueElementsBy = (arr: any[], fn: (arg0: any, arg1: any) => any) =>
  arr.reduce((acc, v) => {
    if (!acc.some((x: any) => fn(v, x))) acc.push(v);
    return acc;
  }, []);
