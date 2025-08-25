import { queryGraph } from '@graphscope/studio-driver';
import { Utils } from '@graphscope/studio-components';
import type { IQueryStatement } from '@graphscope/studio-graph';
const { storage } = Utils;
export const queryStatement: IQueryStatement['query'] = async (script: string) => {
  const query_language = storage.get<'cypher' | 'gremlin'>('query_language') || 'cypher';
  const query_endpoint = storage.get<string>('query_endpoint') || '';
  const query_initiation = storage.get<'Server' | 'Browser'>('query_initiation');
  const query_username = storage.get<string>('query_username');
  const query_password = storage.get<string>('query_password');
  const query_initiation_service = storage.get<string>('query_initiation_service');
  const query_mode = storage.get('query_mode');
  try {
    const _params = {
      script,
      language: query_language,
      endpoint: query_endpoint,
      username: query_username,
      password: query_password,
    };
    if (query_initiation === 'Server' && query_initiation_service) {
      if(query_mode === 'neug-query'){
        // neug-query 走 /cypherv2 接口
        return await fetch(`${query_initiation_service}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain',
          },
          body: script,
        })
          .then(res => res.json())
          .then(res => {
            if (res) {
              return res;
            }
            return {
              nodes: [],
              edges: [],
            };
          });

      }
      return await fetch(query_initiation_service, {
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
    return queryGraph(_params);
  } catch (error) {
    return {
      nodes: [],
      edges: [],
    };
  }
};
