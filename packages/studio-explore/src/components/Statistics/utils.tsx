/**
 *
 * @param graphData 画布数据
 * @param prop 节点/边属性
 * @param elementType 元素类型
 * @returns 图表数据
 */
import type { GraphData } from '@graphscope/studio-graph';
export const getChartData = (graphData: GraphData, prop: string, elementType: 'node' | 'edge') => {
  const elements = elementType === 'node' ? graphData.nodes : graphData.edges;
  const chartData = new Map<
    string,
    {
      counts: number;
      ids: Set<string>;
    }
  >();
  elements?.forEach(e => {
    const { properties, id } = e;
    if (properties) {
      const value = properties[prop];
      if (value === undefined) {
        return;
      }
      const current = chartData.get(value);
      if (current) {
        chartData.set(value, {
          ids: current.ids.add(id),
          counts: current.counts + 1,
        });
      } else {
        chartData.set(value, {
          ids: new Set([id]),
          counts: 1,
        });
      }
    }
  });

  return chartData;
};
