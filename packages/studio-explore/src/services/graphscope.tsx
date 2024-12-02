import { CypherServices, queryStatement } from '@graphscope/studio-graph';
import { Utils } from '@graphscope/studio-components';
import type { IQueryTypes, IServiceQueries } from '@graphscope/studio-graph';
import type { IQueryGraphData, IQueryGraphSchema } from '../components/FetchGraph';
import type { IQuerySearch } from '../components/Searchbar';
import type { IQuerySavedStatements } from '../components/Searchbar/CascaderSearch';
import type { IQueryStatistics } from '../components/Statistics/TotalCounts';
import type { IQueryPropertyStatics } from '../components/Statistics/Properties/ChartView';
import { transNeo4jSchema } from './utils';
import localforage from 'localforage';
export type ExploreQueryTypes =
  | IQueryGraphData
  | IQueryGraphSchema
  | IQuerySearch
  | IQuerySavedStatements
  | IQueryStatistics
  | IQueryPropertyStatics;
const { storage } = Utils;

const DB_QUERY_SAVED = localforage.createInstance({
  name: 'DB_QUERY_SAVED',
});

function getQueryEngineType() {
  const query_endpoint = storage.get<string>('query_endpoint') || '';
  if (query_endpoint.startsWith('neo4j+s://')) {
    return 'neo4j';
  }
  if (query_endpoint.startsWith('kuzu_wasm://')) {
    return 'kuzu_wasm';
  }
  return 'interactive';
}

const services: IServiceQueries<ExploreQueryTypes | IQueryTypes> = {
  ...CypherServices.services,
  queryGraphSchema: async () => {
    try {
      if (getQueryEngineType() === 'neo4j') {
        const neo4jSchema = await queryStatement('CALL apoc.meta.schema');
        const schema = transNeo4jSchema(neo4jSchema.raw);
        return schema;
      }
      const script = `call gs.procedure.meta.schema()`;
      const result = await queryStatement(script);
      const { schema } = result.table[0];
      const _schema = JSON.parse(schema);
      return Utils.transSchema(_schema);
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

    // 精确模糊搜索

    if (type === 'Vertex') {
      if (label && !property) {
        return queryStatement(`match (n:${label}) return n`);
      }
      if (label && property) {
        if (value) {
          return queryStatement(`match (n:${label}) where n.${property} CONTAINS "${value}" return n`);
        } else {
          return queryStatement(`match  (n:${label}) where n.${property} IS NOT NULL return n`);
        }
      }
      if (!label && property) {
        if (value) {
          return queryStatement(`match (n) where n.${property} CONTAINS "${value}" return n`);
        } else {
          return queryStatement(`match  (n) where n.${property} IS NOT NULL return n`);
        }
      }
    }
    if (type === 'Edge') {
      if (label && !property) {
        return queryStatement(`match (a)-[r:${label}]->(b) return a,r,b`);
      }
      if (label && property) {
        if (value) {
          return queryStatement(`match (a)-[r:${label}]->(b) where r.${property} CONTAINS "${value}" return a,r,b`);
        } else {
          return queryStatement(`match (a)-[r:${label}]->(b) where r.${property} IS NOT NULL return a,r,b`);
        }
      }
      if (!label && property) {
        if (value) {
          return queryStatement(`match (a)-[r]->(b) where r.${property} CONTAINS "${value}" return a,r,b`);
        } else {
          return queryStatement(`match (a)-[r]->(b) where r.${property} IS NOT NULL return a,r,b`);
        }
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
      // const script = `call gs.procedure.meta.statistics()`;
      // const result = await queryStatement(script);
      // debugger;
      // console.log('result', result, result.raw.records[0]._fields[0]);
      // return JSON.parse(result.raw.records[0]._fields[0]);

      // 临时方案
      const countNodes = await queryStatement('MATCH (n) RETURN count(n)');
      const countEdges = await queryStatement('MATCH (a)-[r]-(b) RETURN count(r)');

      return {
        total_vertex_count: countNodes.raw.records[0]._fields[0].toNumber(),
        total_edge_count: countEdges.raw.records[0]._fields[0].toNumber(),
      };
    } catch (error) {
      return {
        total_vertex_count: 0,
        total_edge_count: 0,
      };
    }
  },
  queryPropertyStatics: async (property: string) => {
    const data = await queryStatement(`
          MATCH(a) where a.${property} IS NOT NULL
          WITH a.${property} AS ${property}
          return ${property},COUNT(${property}) as counts
        `);

    return data.table;
  },
};

export default services;
