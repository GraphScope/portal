import type { IQueryCommonNeighbor } from '@graphscope/studio-graph';
import { queryStatement } from './queryStatement';
export const queryCommonNeighbor: IQueryCommonNeighbor['query'] = async selectIds => {
  const data = {
    nodes: [],
    edges: [],
  };
  return data;
};
