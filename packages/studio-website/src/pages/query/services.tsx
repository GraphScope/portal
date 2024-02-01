import { CypherDriver, CypherSchemaData } from '@graphscope/studio-query';
const HOST_URL = 'localhost';
const driver = new CypherDriver(`neo4j://${HOST_URL}:7687`);
import { SCHEMA_DATA } from './const';
export interface IStatement {
  id: string;
  script: string;
}
export const queryGraphData = async (value: IStatement) => {
  return driver.queryCypher(value.script);
};
export const queryInfo = async () => {
  return new Promise(reslove => {
    reslove({
      name: 'defauleGraph',
      type: 'interactive',
      home_url: '/instance',
      connect: {
        url: 'bolt://localhost:7678',
        usename: '',
        password: '',
      },
      connect_url: 'bolt://localhost:7678',
    });
  });
};
export const queryGraphSchema = async (): Promise<CypherSchemaData> => {
  return new Promise(reslove => {
    //@ts-ignore
    reslove(SCHEMA_DATA);
  });
};

export const queryStatement = async () => {
  return new Promise(reslove => {
    reslove([
      {
        id: 'query-1',
        name: 'query_10_nodes',
        text: 'Match (n) return n limit 10',
      },
      {
        id: 'query-2',
        name: 'query_top_10_movie',
        text: `MATCH (n) 
            WHERE n.data IS NOT NULL
            RETURN DISTINCT "node" as entity, n.data AS data LIMIT 25
            UNION ALL 
            MATCH ()-[r]-() 
            WHERE r.data IS NOT NULL
            RETURN DISTINCT "relationship" AS entity, r.data AS data LIMIT 25;
          `,
      },
    ]);
  });
};
export const deleteStatement = async () => {
  return {
    data: {},
    success: true,
  };
};

export const updateStatement = async () => {
  return {
    data: {},
    success: true,
  };
};
export const createStatement = async () => {
  return {
    data: {},
    success: true,
  };
};
