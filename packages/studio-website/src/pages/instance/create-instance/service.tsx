import { GraphApiFactory } from '@graphscope/studio-server';

export const createGraph = async graph => {
  const graphs = await GraphApiFactory(undefined, location.origin)
    .createGraph(graph)
    .then(res => {
      if (res.status === 200) {
        return res.data;
      }
      return [];
    });

  return graphs;
};
