import type {
  IServiceQueries,
  INeighborQueryData,
  INeighborQueryItems,
  IQueryStatement,
} from '@graphscope/studio-graph';
import { queryNeighborData, queryNeighborItems } from './queryNeighbor';

import { queryStatement } from '../queryStatement';

const services: IServiceQueries<INeighborQueryData | INeighborQueryItems | IQueryStatement> = {
  queryNeighborData: queryNeighborData,
  queryNeighborItems: queryNeighborItems,
  queryStatement: queryStatement,
};

export default services;
