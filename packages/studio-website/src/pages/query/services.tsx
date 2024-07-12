import { CypherDriver, CypherSchemaData, MockDriver, GremlinDriver } from '@graphscope/studio-query';
import type { IStudioQueryProps, IStatement } from '@graphscope/studio-query';
import localforage from 'localforage';
import { GraphApiFactory, ServiceApiFactory } from '@graphscope/studio-server';
import { transformSchema } from './utils/schema';
import { handleError, handleResponse } from '@/components/utils/handleServer';

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
        cypher_endpoint: 'mock',
        gremlin_endpoint: 'mock',
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
    return [];
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
  const { language } = params;
  console.log('params', params);
  const driver = await getDriver(language);
  //@ts-ignore
  return driver.query(params.script);
};
export const handleCancelQuery = async (params: IStatement) => {
  const { language } = params;
  const driver = await getDriver(language);

  driver.close();
  console.log('driver', driver);
};
