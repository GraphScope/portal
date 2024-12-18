import CypherDriver from './cypher-driver';
import GremlinDriver from './gremlin-driver';
import { KuzuDriver } from './kuzu-wasm-driver';

const DriverMap = new Map();

export interface QueryParams {
  script: string;
  language: 'gremlin' | 'cypher';
  endpoint: string;
  username?: string;
  password?: string;
}

export const getDriver = async (params: Pick<QueryParams, 'endpoint' | 'password' | 'language' | 'username'>) => {
  const { language, endpoint, username, password } = params;
  const id = `${language}_${endpoint}`;
  if (!DriverMap.has(id)) {
    if (language === 'cypher') {
      const [engineId, datasetId] = endpoint.split('://');
      if (engineId === 'kuzu_wasm') {
        const driver = new KuzuDriver();
        await driver.initialize();
        const exist = await driver.existDataset(datasetId);
        if (exist) {
          await driver.use(datasetId);
        }
        DriverMap.set(id, driver);
      } else {
        DriverMap.set(id, new CypherDriver(endpoint, username, password));
      }
    }
    if (language === 'gremlin') {
      DriverMap.set(id, new GremlinDriver(endpoint, username, password));
    }
  }
  return DriverMap.get(id) as CypherDriver | GremlinDriver | KuzuDriver;
};

export const queryGraph = async (params: QueryParams) => {
  const { script } = params;
  const driver = await getDriver(params);
  return driver.query(script);
};

export const cancelGraph = async (params: QueryParams) => {
  const driver = await getDriver(params);
  return driver.close();
};
