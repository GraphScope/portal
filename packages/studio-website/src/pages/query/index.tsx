import * as React from 'react';
import StudioQuery from '@graphscope/studio-query';
interface IQueryModuleProps {}

const queryGraph = async () => {};
const queryInfo = async () => {
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
const querySchema = async () => {
  return new Promise(reslove => {
    reslove({
      edges: [],
      nodes: [],
    });
  });
};

const queryStatement = async () => {
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
const delelteStatement = async () => {
  return {
    data: {},
    success: true,
  };
};

const updateStatement = async () => {
  return {
    data: {},
    success: true,
  };
};
const addStatement = async () => {
  return {
    data: {},
    success: true,
  };
};

const QueryModule: React.FunctionComponent<IQueryModuleProps> = props => {
  const services = {
    /** query graph info */
    queryInfo,
    querySchema,
    /** statement */
    queryStatement,
    delelteStatement,
    updateStatement,
    addStatement,
  };
  return (
    <div>
      <StudioQuery {...services} />
    </div>
  );
};

export default QueryModule;
