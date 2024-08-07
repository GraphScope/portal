import CypherDriver from './cypher-driver';
import GremlinDriver from './gremlin-driver';

export { CypherDriver, GremlinDriver };

const DriverMap = new Map();

export interface QueryParams {
  script: string;
  language: 'gremlin' | 'cypher';
  endpoint: string;
  username?: string;
  password?: string;
}

export const queryGraph = async (params: QueryParams) => {
  const { language, endpoint, script, username, password } = params;
  const id = `${language}_${endpoint}`;

  if (!DriverMap.has(id)) {
    if (language === 'cypher') {
      DriverMap.set(id, new CypherDriver(endpoint, username, password));
    }
    if (language === 'gremlin') {
      DriverMap.set(id, new GremlinDriver(endpoint, username, password));
    }
  }
  const driver = DriverMap.get(id);
  return driver.query(script);
};

export const cancelGraph = async (params: QueryParams) => {
  const { language, endpoint } = params;
  const id = `${language}_${endpoint}`;
  if (!DriverMap.has(id)) {
    const driver = DriverMap.get(id);
    driver.close();
  }
};
