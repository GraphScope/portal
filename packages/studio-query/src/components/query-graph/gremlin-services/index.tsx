import type {
  IServiceQueries,
  INeighborQueryData,
  INeighborQueryItems,
  IQueryStatement,
} from '@graphscope/studio-graph';
import { queryNeighborData, queryNeighborItems } from './queryNeighbor';

import { queryStatement } from '../queryStatement';

const services: IServiceQueries<INeighborQueryData | INeighborQueryItems | IQueryStatement> = {
  queryStatement: queryStatement,
  queryNeighborData: queryNeighborData,
  queryNeighborItems: queryNeighborItems,
};

export default services;
