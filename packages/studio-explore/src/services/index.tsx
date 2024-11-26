import { CypherServices, queryStatement } from '@graphscope/studio-graph';
import { Utils } from '@graphscope/studio-components';
import type { IQueryTypes, IServiceQueries } from '@graphscope/studio-graph';
import type { IQueryGraphData, IQueryGraphSchema } from '../components/FetchGraph';
import type { IQuerySearch } from '../components/Searchbar';
import type { IQuerySavedStatements } from '../components/Searchbar/CascaderSearch';
import type { IQueryStatistics } from '../components/Statistics';

import localforage from 'localforage';
export type ExploreQueryTypes =
  | IQueryGraphData
  | IQueryGraphSchema
  | IQuerySearch
  | IQuerySavedStatements
  | IQueryStatistics;
const { storage } = Utils;

const DB_QUERY_SAVED = localforage.createInstance({
  name: 'DB_QUERY_SAVED',
});

function getQueryEngineType() {
  const query_endpoint = storage.get<string>('query_endpoint') || '';
  if (query_endpoint.startsWith('neo4j+s://')) {
    return 'neo4j';
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
};
export default services;

function transNeo4jSchema(raw): { nodes: []; edges: [] } {
  try {
    const nodes: any[] = [];
    const edges: any[] = [];
    const [obj] = raw.records[0]['_fields'];
    Object.keys(obj).forEach(label => {
      const item = obj[label];
      const { type, relationships } = item;
      if (type === 'node') {
        nodes.push({
          id: label,
          label: label,
          properties: Object.keys(item.properties).map(property => {
            return {
              name: property,
              type: item.properties[property].type,
            };
          }),
        });
        Object.keys(relationships).forEach(edgeLabel => {
          const edge = relationships[edgeLabel];
          const { direction } = edge;
          const source = direction === 'out' ? label : relationships[edgeLabel].labels[0];
          const target = direction === 'out' ? relationships[edgeLabel].labels[0] : label;
          edges.push({
            id: edgeLabel,
            label: edgeLabel,
            source,
            target,
            type: 'edge',
            properties: Object.keys(relationships[edgeLabel].properties).map(property => {
              return {
                name: property,
                type: relationships[edgeLabel].properties[property].type,
              };
            }),
          });
        });
      }
    });

    const _edges = Utils.uniqueElementsBy(edges, (a, b) => {
      return a.id + a.source + a.target === b.id + b.source + b.target;
    });
    return {
      nodes: nodes as [],
      edges: _edges,
    };
  } catch (error) {
    console.log('error', error);
    return {
      nodes: [],
      edges: [],
    };
  }
}
