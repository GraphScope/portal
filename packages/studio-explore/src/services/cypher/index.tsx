import type {
  IServiceQueries,
  INeighborQueryData,
  INeighborQueryItems,
  IQueryStatement,
  IQueryCommonNeighbor,
} from '@graphscope/studio-graph';
import { queryNeighborData, queryNeighborItems } from './queryNeighbor';
import type { IQueryGraphData, IQueryGraphSchema } from '../../components/FetchGraph';
import type { IQuerySearch } from '../../components/Searchbar';
import type { IQuerySavedStatements } from '../../components/Searchbar/CascaderSearch';
import type { IQueryStatistics } from '../../components/Overview/TotalCounts';
import type { IQueryPropertyStatics } from '../../components/Overview/Properties/ChartView';
import type { IQueryNeighborStatics } from '../../components/Next/Neighbors';

export type ExploreQueryTypes =
  | IQueryGraphData
  | IQueryGraphSchema
  | IQuerySearch
  | IQuerySavedStatements
  | IQueryStatistics
  | IQueryPropertyStatics
  | IQueryNeighborStatics
  | INeighborQueryData
  | INeighborQueryItems
  | IQueryStatement
  | IQueryCommonNeighbor;

import { queryGraphSchema } from './queryGraphSchema';
import { queryStatement } from './queryStatement';
import { querySavedStaments } from './querySavedStatements';
import { queryGraphData } from './queryGraphData';
import { queryPropertyStatics } from './queryPropertyStatics';
import { queryNeighborStatics } from './queryNeighborStatics';
import { querySearch } from './querySearch';
import { queryStatistics } from './queryStatistics';
import { queryCommonNeighbor } from './queryCommonNeighbor';

const services: IServiceQueries<ExploreQueryTypes> = {
  queryNeighborData,
  queryNeighborItems,
  queryGraphSchema,
  queryStatement,
  querySavedStaments,
  queryGraphData,
  queryPropertyStatics,
  queryNeighborStatics,
  querySearch,
  queryStatistics,
  queryCommonNeighbor,
};
export default services;
