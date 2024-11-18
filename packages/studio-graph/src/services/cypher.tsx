import { queryGraph } from '@graphscope/studio-driver';
import type { INeighborQueryData, INeighborQueryItems } from '../components/ContextMenu/NeighborQuery';
import { Utils } from '@graphscope/studio-components';
export type IServiceQueries<T extends { id: string; query: (...args: any[]) => Promise<any> }> = {
  [K in T['id']]?: T extends { id: K } ? T['query'] : never;
};

export type IQueryTypes = INeighborQueryData | INeighborQueryItems;

export interface ICypherServices {
  id: string;
  desc: string;
  services: IServiceQueries<IQueryTypes>;
}

export const services: ICypherServices['services'] = {
  queryNeighborData: async params => {
    const { key, selectIds } = params;
    const script = `
    MATCH ${key}
    WHERE  elementId(a) IN [${selectIds}] 
    RETURN a,b,c
    `;
    const data = await queryGraph({
      script,
      language: 'cypher',
      endpoint: Utils.storage.get('query_endpoint') || '',
    });
    return data;
  },
  queryNeighborItems: async params => {
    const { schema, selectNode } = params;

    const relatedEdges = schema.edges.filter(item => {
      //@ts-ignore
      return item.source === selectNode.label;
    });

    const itemChildren = relatedEdges.map(item => {
      const { source, target, label } = item;
      if (source === target) {
        return {
          key: `(a:${source})-[b:${label}]-(c:${target})`,
          label: `[${label}]-(${target})`,
        };
      }
      return {
        key: `(a:${source})-[b:${label}]->(c:${target})`,
        label: `[${label}]->(${target})`,
      };
    });
    const extraItems =
      relatedEdges.length > 1
        ? [
            {
              key: `(a)-[b]-(c)`,
              label: `All Neighbors`,
            },
          ]
        : [];
    return [...extraItems, ...itemChildren];
  },
};

const CypherServices: ICypherServices = {
  id: 'cypher',
  desc: 'Query services with cypher language',
  services,
};

export default CypherServices;
