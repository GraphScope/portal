import { CypherSchemaData, MockDriver } from '@graphscope/studio-query';
import { GremlinDriver, CypherDriver, queryGraph, cancelGraph } from '@graphscope/studio-driver';
import type { QueryParams } from '@graphscope/studio-driver';
import type { IStudioQueryProps, IStatement } from '@graphscope/studio-query';
import localforage from 'localforage';
import { GraphApiFactory, ServiceApiFactory, StoredProcedureApiFactory } from '@graphscope/studio-server';
import { transformSchema } from './utils/schema';
import { handleError, handleResponse } from '@/components/utils/handleServer';
import { Utils } from '@graphscope/studio-components';
const { storage } = Utils;
const DB_QUERY_HISTORY = localforage.createInstance({
  name: 'DB_QUERY_HISTORY',
});
const DB_QUERY_SAVED = localforage.createInstance({
  name: 'DB_QUERY_SAVED',
});

/** 删除历史记录 */
export async function deleteHistoryStatements(ids: string[]) {
  ids.forEach(id => {
    DB_QUERY_HISTORY.removeItem(id);
  });
  return;
}

export const queryEndpoint = async (): Promise<{
  cypher_endpoint: string;
  gremlin_endpoint: string;
}> => {
  return fetch('/query_endpoint')
    .then(res => {
      return res.json();
    })
    .then(res => res.data)
    .catch(() => {
      return {
        cypher_endpoint: null,
        gremlin_endpoint: null,
      };
    });
};

export const queryInfo = async (id: string) => {
  const result = await ServiceApiFactory(undefined, location.origin)
    .getServiceStatusById(id)
    .then(res => handleResponse(res))
    .catch(error => handleError(error));

  return result;
};
export const queryGraphSchema = async (graph_id: string): Promise<CypherSchemaData> => {
  const schema = await GraphApiFactory(undefined, location.origin)
    .getSchemaById(graph_id)
    .then(res => handleResponse(res))
    .catch(error => handleError(error));

  if (schema) {
    const cypherSchema = transformSchema(schema);
    //@ts-ignore
    return cypherSchema;
  }
  return {
    nodes: [],
    edges: [],
  };
};

export const queryStatements: IStudioQueryProps['queryStatements'] = async type => {
  const result: IStatement[] = [];
  if (type === 'history') {
    await DB_QUERY_HISTORY.iterate((item: IStatement) => {
      if (item) {
        result.push(item);
      }
    });
  }
  if (type === 'saved') {
    await DB_QUERY_SAVED.iterate((item: IStatement) => {
      if (item) {
        result.push(item);
      }
    });
  }
  if (type === 'store-procedure') {
    const graph_id = Utils.getSearchParams('graph_id');
    if (!graph_id) {
      return [];
    }
    return await StoredProcedureApiFactory(undefined, location.origin)
      .listStoredProcedures(graph_id)
      .then(res => {
        if (res.status === 200) {
          return res.data.map(item => {
            const { name, params, description, ...others } = item;
            const script = params.length > 0 ? `CALL ${name}("")` : `CALL ${name}()`;
            return {
              ...others,
              name: description,
              script,
            };
          });
        }
        return [];
      });
  }
  return result;
};

export const deleteStatements: IStudioQueryProps['deleteStatements'] = async (type, ids) => {
  if (type === 'history') {
    ids.forEach(id => {
      DB_QUERY_HISTORY.removeItem(id);
    });
    return true;
  }
  if (type === 'saved') {
    ids.forEach(id => {
      DB_QUERY_SAVED.removeItem(id);
    });
    return true;
  }
  return false;
};

export const createStatements: IStudioQueryProps['createStatements'] = async (type, params) => {
  if (type === 'history') {
    const { id } = params;
    await DB_QUERY_HISTORY.setItem(id, params);
    return true;
  }
  if (type === 'saved') {
    const { id } = params;
    await DB_QUERY_SAVED.setItem(id, params);
    return true;
  }
  return false;
};

const driver_config: Record<string, any> = {};

export const getDriver = async (language: 'cypher' | 'gremlin' = 'cypher') => {
  if (Object.keys(driver_config).length === 0) {
    const { cypher_endpoint, gremlin_endpoint } = await queryEndpoint();
    driver_config.cypher_endpoint = cypher_endpoint;
    driver_config.gremlin_endpoint = gremlin_endpoint;
  }
  const { gremlin_endpoint, cypher_endpoint, gremlin_driver, cypher_driver } = driver_config;

  if (cypher_endpoint === 'mock' && gremlin_endpoint === 'mock') {
    return new MockDriver(cypher_endpoint);
  }
  if (cypher_endpoint && !cypher_driver) {
    driver_config.cypher_driver = new CypherDriver(cypher_endpoint);
  }
  if (gremlin_endpoint && !gremlin_driver) {
    driver_config.gremlin_driver = new GremlinDriver(gremlin_endpoint);
  }
  if (language === 'cypher') {
    return driver_config.cypher_driver;
  }
  return driver_config.gremlin_driver;
};

export const queryGraphData = async (params: IStatement) => {
  createStatements('history', params);

  const query_language = storage.get<'cypher' | 'gremlin'>('query_language') || 'cypher';
  const query_endpoint = storage.get<string>('query_endpoint') || '';
  const query_initiation = storage.get<'Server' | 'Browser'>('query_initiation');
  const query_username = storage.get<string>('query_username');
  const query_password = storage.get<string>('query_password');

  const _params: QueryParams = {
    script: params.script,
    language: query_language,
    endpoint: query_endpoint,
    username: query_username,
    password: query_password,
  };

  if (query_initiation === 'Browser') {
    return queryGraph(_params);
  }
  if (query_initiation === 'Server') {
    return await fetch('/query', {
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

export const handleCancelQuery = async (params: IStatement) => {
  const query_language = storage.get<'cypher' | 'gremlin'>('query_language') || 'cypher';
  const query_endpoint = storage.get<string>('query_endpoint') || '';
  const query_initiation = storage.get<'Server' | 'Browser'>('query_initiation');
  const query_username = storage.get<string>('query_username');
  const query_password = storage.get<string>('query_password');

  const _params: QueryParams = {
    script: params.script,
    language: query_language,
    endpoint: query_endpoint,
    username: query_username,
    password: query_password,
  };

  if (query_initiation === 'Browser') {
    return cancelGraph(_params);
  }
  if (query_initiation === 'Server') {
    return await fetch('/query_cancel', {
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
