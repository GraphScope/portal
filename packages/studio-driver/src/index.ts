import CypherDriver from './cypher-driver';
import GremlinDriver from './gremlin-driver';

export { CypherDriver, GremlinDriver };

const DriverMap = new Map();

export interface QueryParams {
  script: string;
  language: 'gremlin' | 'cypher';
  endpoint: string;
}

export const queryGraph = async (params: QueryParams) => {
  const { language, endpoint, script } = params;
  const id = `${language}_${endpoint}`;

  if (!DriverMap.has(id)) {
    if (language === 'cypher') {
      DriverMap.set(id, new CypherDriver(endpoint));
    }
    if (language === 'gremlin') {
      DriverMap.set(id, new GremlinDriver(endpoint));
    }
  }
  const driver = DriverMap.get(id);
  return driver.query(script);
};
