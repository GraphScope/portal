import { Utils } from '@graphscope/studio-components';
import { getDriver as getKuzuDriver, KuzuDriver } from '@graphscope/studio-driver';
const { storage } = Utils;

const getDriver = async () => {
  const language = storage.get<'cypher' | 'gremlin'>('query_language') || 'cypher';
  const endpoint = storage.get<string>('query_endpoint') || '';
  const username = storage.get<string>('query_username');
  const password = storage.get<string>('query_password');
  return getKuzuDriver({
    language,
    endpoint,
    username,
    password,
  }) as Promise<KuzuDriver>;
};
const __TEMP = {};
export const setFiles = (dataset_id: string, params) => {
  __TEMP[dataset_id] = params;
};
const getFiles = (dataset_id: string) => {
  return __TEMP[dataset_id];
};

export const useKuzuGraph = async (dataset_id: string) => {
  const driver = await getDriver();
  const exist = await driver.existDataset(dataset_id);
  if (exist) {
    return {
      success: true,
      message: 'Successfully connect to the existing IndexedDB',
    };
  }
  // 新的实例，需要清除默认的样式
  localStorage.removeItem('GRAPH__STYLE');
  const res = await createKuzuGraph(dataset_id);
  return res;
};

export const createKuzuGraph = async (dataset_id: string) => {
  const driver = await getDriver();
  //@ts-ignore
  const { files, schema } = await getFiles(dataset_id);
  await driver.use(dataset_id);
  await driver.createSchema(schema);
  const logs = await driver.loadGraph(files);
  const error = [...logs.nodes, ...logs.edges].some(item => item.message === 'false');

  if (error) {
    const message = [...logs.nodes, ...logs.edges]
      .map(item => {
        const { message, name } = item;
        return `${name}: ${message}`;
      })
      .join(';\n');
    return {
      success: false,
      message: `Some nodes or edges failed to load, please check the data format: ${message}`,
    };
  }
  return await driver.writeBack();
};
