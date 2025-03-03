import CypherDriver from './cypher-driver';
import GremlinDriver from './gremlin-driver';
import { KuzuDriver } from './kuzu-wasm-driver-official';

const DriverMap = new Map();

export interface QueryParams {
  script: string;
  language: 'gremlin' | 'cypher';
  endpoint: string;
  username?: string;
  password?: string;
}

class Mutex {
  _locked: any;
  _waiting: any;

  constructor() {
    this._locked = false;
    this._waiting = [];
  }

  lock() {
    const unlock = () => {
      this._locked = false;
      if (this._waiting.length > 0) {
        const nextUnlock = this._waiting.shift();
        this._locked = true;
        nextUnlock(unlock);
      }
    };

    if (this._locked) {
      return new Promise(resolve => {
        this._waiting.push(resolve);
      }).then(() => unlock);
    } else {
      this._locked = true;
      return Promise.resolve(unlock);
    }
  }
}

const mutex = new Mutex();

export const getDriver = async (params: Pick<QueryParams, 'endpoint' | 'password' | 'language' | 'username'>) => {
  const { language, endpoint, username, password } = params;
  const id = `${language}_${endpoint}`;
  const unlock = await mutex.lock();
  if (!DriverMap.has(id)) {
    console.log('create new driver');
    if (language === 'cypher') {
      const [engineId, datasetId] = endpoint.split('://');
      if (engineId === 'kuzu_wasm') {
        const driver = new KuzuDriver();
        await driver.initialize();
        const exist = await driver.existDataset(datasetId);
        if (exist) {
          console.log('start to use ', datasetId);
          await driver.use(datasetId);
          console.log('finish to use ', datasetId);
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
  unlock();
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
