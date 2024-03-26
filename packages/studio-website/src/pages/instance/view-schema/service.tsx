import { GraphApiFactory, LegacyApiFactory } from '@graphscope/studio-server';
import { transformSchemaToOptions } from '@/components/utils/schema';
import { transformGrootSchemaToOptions } from '@/components/utils/schema-groot';

export const getSchema = async (graphName: string) => {
  if (window.GS_ENGINE_TYPE === 'interactive') {
    const graphs = await GraphApiFactory(undefined, location.origin)
      .getSchema(graphName)
      .then(res => {
        if (res.status === 200) {
          return res.data;
        }
        return [];
      });
    return transformSchemaToOptions(graphs as any, true);
  }

  if (window.GS_ENGINE_TYPE === 'groot') {
    const graphs = await LegacyApiFactory(undefined, location.origin)
      .getGrootSchema(graphName)
      .then(res => {
        if (res.status === 200) {
          return res.data;
        }
      });
    console.log('graphs', graphs, transformGrootSchemaToOptions(graphs));

    return transformGrootSchemaToOptions(graphs);
  }
};
