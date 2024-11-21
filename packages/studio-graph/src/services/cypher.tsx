import { queryGraph } from '@graphscope/studio-driver';
import type { INeighborQueryData, INeighborQueryItems } from '../components/ContextMenu/NeighborQuery';
import { Utils } from '@graphscope/studio-components';
const { storage } = Utils;
export type IServiceQueries<T extends { id: string; query: (...args: any[]) => Promise<any> }> = {
  [K in T['id']]?: T extends { id: K } ? T['query'] : never;
};

export interface IQueryStatement {
  id: 'queryStatement';
  query: (script: string) => Promise<any>;
}
export type IQueryTypes = INeighborQueryData | INeighborQueryItems | IQueryStatement;

export interface ICypherServices {
  id: string;
  desc: string;
  services: IServiceQueries<IQueryTypes>;
}

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

  try {
    return queryGraph(_params);
  } catch (error) {
    console.log('error', error);
    return {
      nodes: [],
      edges: [],
    };
  }
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
export const services: ICypherServices['services'] = {
  queryStatement: queryStatement,
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

const CypherServices: ICypherServices = {
  id: 'cypher',
  desc: 'Query services with cypher language',
  services,
};

export default CypherServices;
