import { GraphApiFactory, LegacyApiFactory } from '@graphscope/studio-server';
const { GS_ENGINE_TYPE } = window;

export const createGraph = async (graph: any) => {
  let graphs;
  if (GS_ENGINE_TYPE === 'interactive') {
    graphs = await GraphApiFactory(undefined, location.origin)
      .createGraph(graph)
      .then(res => {
        if (res.status === 200) {
          return res.data;
        }
        return [];
      });
  }
  /** groot 创建 */
  if (GS_ENGINE_TYPE === 'groot') {
    const { name, schema } = graph;
    graphs = await LegacyApiFactory(undefined, location.origin)
      .importGrootSchema(name, schema)
      .then(res => {
        if (res.status === 200) {
          return res.data;
        }
        return [];
      });
  }
  return graphs;
};

export const getPrimitiveTypes = () => {
  if (GS_ENGINE_TYPE === 'groot') {
    return ['STRING', 'LONG', 'DOUBLE'];
  }
  if (GS_ENGINE_TYPE === 'interactive') {
    return ['DT_DOUBLE', 'DT_STRING', 'DT_SIGNED_INT32', 'DT_SIGNED_INT64', 'DT_DATE32'];
  }
  return [''];
};
