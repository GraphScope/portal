import { CypherServices } from '@graphscope/studio-graph';
import { Utils } from '@graphscope/studio-components';
import type { IQueryTypes, IServiceQueries } from '@graphscope/studio-graph';
import type { IQueryGraphData, IQueryGraphSchema } from '../components/FetchGraph';
import type { IQuerySearch } from '../components/Searchbar';
import { queryGraph } from '@graphscope/studio-driver';
export type ExploreQueryTypes = IQueryGraphData | IQueryGraphSchema | IQuerySearch;
const { storage } = Utils;

export const queryStatement = async (script: string) => {
  const query_language = storage.get<'cypher' | 'gremlin'>('query_language') || 'cypher';
  const query_endpoint = storage.get<string>('query_endpoint') || '';
  const query_initiation = storage.get<'Server' | 'Browser'>('query_initiation');
  const query_username = storage.get<string>('query_username');
  const query_password = storage.get<string>('query_password');

  const _params = {
    script,
    language: query_language,
    endpoint: query_endpoint,
    username: query_username,
    password: query_password,
  };

  if (query_initiation === 'Browser') {
    return queryGraph(_params);
  }
  if (query_initiation === 'Server') {
    return await fetch('/graph/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(_params),
    })
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          return res.data;
        }
        return {
          nodes: [],
          edges: [],
        };
      });
  }
};

const services: IServiceQueries<ExploreQueryTypes | IQueryTypes> = {
  ...CypherServices.services,
  queryGraphSchema: async () => {
    return { nodes: [], edges: [] };
  },
  queryGraphData: async () => {
    const data = await queryStatement('Match (a)-[b]-(c) return a,b,c limit 100');

    return data;
  },
  querySearch: async params => {
    const { value, label, property } = params;
    return queryStatement(`match (n:${label}) where n.${property} CONTAINS "${value}" return n`);
  },
};
export default services;
