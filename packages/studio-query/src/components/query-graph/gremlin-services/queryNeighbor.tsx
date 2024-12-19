import type { INeighborQueryData, INeighborQueryItems } from '@graphscope/studio-graph';
import { queryStatement } from '../queryStatement';
export const queryNeighborData: INeighborQueryData['query'] = async params => {
  const { selectIds } = params;
  const ids = selectIds.join(',');
  const script = `g.V().hasId(${ids}).both().dedup()`;
  const data = await queryStatement(script);
  return data;
};

export const queryNeighborItems: INeighborQueryItems['query'] = async params => {
  return {
    all: [
      {
        key: `(a)-[b]-(c)`,
        label: `One-Hop Neighbors`,
      },
    ],
  };
};
