import { CypherDriver, CypherSchemaData } from '@graphscope/studio-query';
import type { IStudioQueryProps } from '@graphscope/studio-query';
import localforage from 'localforage';
import { v4 as uuidv4 } from 'uuid';
import { GraphApiFactory, GraphApi, GraphApiFp, ServiceApiFactory } from '@graphscope/studio-server';
import { transformSchema } from './utils/schema';
import { handleServerResponse } from './utils/handleServerResponse';

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

const HOST_URL = '47.242.172.5'; //'localhost';
const driver = new CypherDriver(`neo4j://${HOST_URL}:7687`);

export interface IStatement {
  id: string;
  script: string;
}

export const queryGraphData = async (params: IStatement) => {
  createStatements('history', params);
  return driver.queryCypher(params.script);
};
export const queryInfo = async () => {
  const result = await ServiceApiFactory(undefined, location.origin).getServiceStatus();
  const service = handleServerResponse(result);

  return service;
};
export const queryGraphSchema = async (): Promise<CypherSchemaData> => {
  const result = await GraphApiFactory(undefined, location.origin).getSchema('graph_algo');
  const schema = handleServerResponse(result);
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
