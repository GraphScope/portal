import { queryGraph } from '@graphscope/studio-driver';
import { Utils } from '@graphscope/studio-components';
import type { IQueryStatement } from '@graphscope/studio-graph';
import { getQueryEngineType, transNeo4jSchema } from '../utils';
import { getDriver } from '../kuzu-wasm';
const { storage } = Utils;
export const queryStatement: IQueryStatement['query'] = async (script: string) => {
  const query_language = storage.get<'cypher' | 'gremlin'>('query_language') || 'cypher';
  const query_endpoint = storage.get<string>('query_endpoint') || '';
  const query_initiation = storage.get<'Server' | 'Browser'>('query_initiation');
  const query_username = storage.get<string>('query_username');
  const query_password = storage.get<string>('query_password');
  try {
    const engine = getQueryEngineType();
    if (engine === 'graphscope' || engine === 'neo4j') {
      const _params = {
        script,
        language: query_language,
        endpoint: query_endpoint,
        username: query_username,
        password: query_password,
      };

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
      return queryGraph(_params);
    }
    if (engine === 'kuzu_wasm') {
      const driver = await getDriver();
      return await driver.queryData(script);
    }
  } catch (error) {
    return {
      nodes: [],
      edges: [],
    };
  }
};
