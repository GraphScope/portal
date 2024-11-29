import { CypherServices } from '@graphscope/studio-graph';
import { Utils } from '@graphscope/studio-components';
import type { IQueryTypes, IServiceQueries } from '@graphscope/studio-graph';
import type { IQueryGraphData, IQueryGraphSchema } from '../components/FetchGraph';
import type { IQuerySearch } from '../components/Searchbar';
import type { IQuerySavedStatements } from '../components/Searchbar/CascaderSearch';
import type { IQueryStatistics } from '../components/Statistics';
import { transNeo4jSchema } from './utils';
import localforage from 'localforage';
import { KuzuDriver } from '@graphscope/graphy-website';
import { storage } from '@graphscope/studio-components/lib/Utils';

// export const datasetId = 'kuzu-wasm-default-graph';

declare global {
  interface Window {
    KUZU_DRIVER: KuzuDriver;
  }
}
export const getDriver = async () => {
  if (!window.KUZU_DRIVER) {
    const driver = new KuzuDriver();
    await driver.initialize();
    const query_endpoint = Utils.storage.get<string>('query_endpoint');
    if (query_endpoint) {
      const [engineId, datasetId] = query_endpoint.split('://');
      const exist = await driver.existDataset(datasetId);
      if (exist) {
        await driver.use(datasetId);
      }
    }
    window.KUZU_DRIVER = driver;
  }
  return window.KUZU_DRIVER;
};
//@ts-ignore
window.getDriver = getDriver;
let used = false;
const __TEMP = {};
export const setFiles = (dataset_id: string, params) => {
  __TEMP[dataset_id] = params;
};
const getFiles = (dataset_id: string) => {
  return __TEMP[dataset_id];
};

export const useKuzuGraph = async (dataset_id: string) => {
  const driver = await getDriver();
  const exist = await driver.existDataset(dataset_id);
  if (exist) {
    return {
      success: true,
      message: 'Successfully connect to the existing IndexedDB',
    };
  }
  // 新的实例，需要清除默认的样式
  localStorage.removeItem('GRAPH__STYLE');
  const res = await createKuzuGraph(dataset_id);
  //自动刷新页面
  window.location.reload();
  return res;
};

export const createKuzuGraph = async (dataset_id: string) => {
  const driver = await getDriver();
  //@ts-ignore
  const { files, schema } = await getFiles(dataset_id);
  await driver.use(dataset_id);
  await driver.createSchema(schema);
  await driver.loadGraph(files);
  return await driver.writeBack();
};

export type ExploreQueryTypes =
  | IQueryGraphData
  | IQueryGraphSchema
  | IQuerySearch
  | IQuerySavedStatements
  | IQueryStatistics;

const DB_QUERY_SAVED = localforage.createInstance({
  name: 'DB_QUERY_SAVED',
});

const queryStatement = async script => {
  const driver = await getDriver();
  return await driver.queryData(script);
};

const services: IServiceQueries<ExploreQueryTypes | IQueryTypes> = {
  ...CypherServices.services,
  queryStatement,
  queryGraphSchema: async () => {
    try {
      const driver = await getDriver();
      const data = await driver.querySchema();
      console.log('data', data);
      return data;
    } catch (error) {
      return { nodes: [], edges: [] };
    }
  },
  queryGraphData: async () => {
    try {
      const data = await queryStatement('Match (a)-[b]-(c) return a,b,c limit 100');
      return data;
      return {
        nodes: [],
        edges: [],
      };
    } catch (error) {
      console.log('error', error);
      return {
        nodes: [],
        edges: [],
      };
    }
  },
  querySearch: async params => {
    const { config, value } = params;
    const { value: type } = config.find(item => item.type === 'type') || { value: null };
    const { value: label } = config.find(item => item.type === 'label') || { value: null };
    const { value: property } = config.find(item => item.type === 'property') || { value: null };

    if (type === 'Vertex') {
      if (label && property) {
        return queryStatement(`match (n:${label}) where n.${property} CONTAINS "${value}" return n`);
      }
      if (!label && property) {
        return queryStatement(`match (n) where n.${property} CONTAINS "${value}" return n`);
      }
    }
    if (type === 'Edge') {
      if (label && property) {
        return queryStatement(`match (a)-[r:${label}]->(b) where r.${property} CONTAINS "${value}" return a,r,b`);
      }
      if (!label && property) {
        return queryStatement(`match (a)-[r]->(b) where r.${property} CONTAINS "${value}" return a,r,b`);
      }
    }
    return {
      nodes: [],
      edges: [],
    };
  },
  querySavedStaments: async () => {
    const result: any[] = [];
    await DB_QUERY_SAVED.iterate(item => {
      if (item) {
        result.push(item);
      }
    });
    return result;
  },
  queryStatistics: async () => {
    try {
      const driver = await getDriver();
      const count = await driver.getCount();

      const [total_vertex_count, total_edge_count] = count;
      return {
        total_vertex_count,
        total_edge_count,
      };
    } catch (error) {
      return {
        total_vertex_count: 0,
        total_edge_count: 0,
      };
    }
  },
  queryNeighborData: async params => {
    const { key, selectIds } = params;
    const script = `
    MATCH ${key}
    WHERE  elementId(a) IN [${selectIds}] 
    RETURN a,b,c
    `;
    const data = await queryStatement(script);
    return data;
  },
  queryNeighborItems: async params => {
    const { schema } = params;
    const itemMap = {};
    schema.nodes.forEach(node => {
      itemMap[node.label] = getOptionsBySchema(schema, node.label);
    });
    return itemMap;
  },
};

function getOptionsBySchema(schema, nodeLabel) {
  const options: { key: string; label: string }[] = [];
  schema.edges.forEach(item => {
    let direction = 'out';
    const { source, target, label } = item;
    const include = nodeLabel === source || nodeLabel === target;
    if (include && source === target) {
      direction = 'both';
      options.push({
        key: `(a:${source})-[b:${label}]-(c:${target})`,
        label: `[${label}]-(${target})`,
      });
      return;
    }
    if (source === nodeLabel) {
      direction = 'out';
      options.push({
        key: `(a:${source})-[b:${label}]->(c:${target})`,
        label: `[${label}]->(${target})`,
      });
    }
    if (target === nodeLabel) {
      direction = 'in';
      options.push({
        key: `(a:${source})<-[b:${label}]-(c:${target})`,
        label: `[${label}]<-(${target})`,
      });
    }
  });

  const extraItems =
    options.length > 1
      ? [
          {
            key: `(a)-[b]-(c)`,
            label: `All Neighbors`,
          },
        ]
      : [];
  return [...extraItems, ...options];
}
export default services;
