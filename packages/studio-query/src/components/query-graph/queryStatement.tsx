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
      const isNeugQuery = query_mode === 'neug-query';
      
      const requestConfig = isNeugQuery 
        ? {
            headers: { 'Content-Type': 'text/plain' },
            body: script,
          }
        : {
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(_params),
          };

      const response = await fetch(query_initiation_service, {
        method: 'POST',
        ...requestConfig,
      });

      const res = await response.json();
      
      // 根据不同模式处理响应数据
      if (isNeugQuery) {
        return res || { nodes: [], edges: [] };
      } else {
        return res.success ? res.data : { nodes: [], edges: [] };
      }
    }
    return queryGraph(_params);
  } catch (error) {
    return {
      nodes: [],
      edges: [],
    };
  }
};
