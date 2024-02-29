import { GraphApiFactory } from '@graphscope/studio-server';

export const getSchema = async (graph: string) => {
  const graphs = await GraphApiFactory(undefined, location.origin)
    .getSchema(graph)
    .then(res => {
      if (res.status === 200) {
        return res.data;
      }
      return [];
    });

  return graphs;
};
