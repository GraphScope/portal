import { GraphApiFactory } from '@graphscope/studio-server';
import { transformSchemaToOptions } from '@/components/utils/schema';
// import { transformGrootSchemaToOptions } from '@/components/utils/schema-groot';

export const getSchema = async (graph_id: string) => {
  let graphs;
  if (window.GS_ENGINE_TYPE === 'interactive') {
    graphs = await GraphApiFactory(undefined, location.origin)
      .getGraphById(graph_id)
      .then(res => {
        if (res.status === 200) {
          return res.data.schema;
        }
        return [];
      });
    // return transformSchemaToOptions(graphs as any, true);
  }

  if (window.GS_ENGINE_TYPE === 'groot') {
    graphs = await GraphApiFactory(undefined, location.origin)
      .getSchemaById(graph_id)
      .then(res => {
        if (res.status === 200) {
          return res.data;
        }
      });
    // console.log('graphs', graphs, transformGrootSchemaToOptions(graphs));

    // return transformGrootSchemaToOptions(graphs);
  }
  return transformSchemaToOptions(graphs as any, true);
};
