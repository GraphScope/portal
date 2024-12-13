import { Utils } from '@graphscope/studio-components';
import { KuzuDriver } from '@graphscope/graphy-website';

declare global {
  interface Window {
    KUZU_DRIVER: KuzuDriver;
  }
}
export const getDriver = async () => {
  if (!window.KUZU_DRIVER) {
    const driver = new KuzuDriver();
    await driver.initialize();
    const query_endpoint = Utils.storage.get<string>('query_endpoint');
    if (query_endpoint) {
      const [engineId, datasetId] = query_endpoint.split('://');
      const exist = await driver.existDataset(datasetId);
      if (exist) {
        await driver.use(datasetId);
      }
    }
    window.KUZU_DRIVER = driver;
  }
  return window.KUZU_DRIVER;
};
//@ts-ignore
window.getDriver = getDriver;
let used = false;
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
  //自动刷新页面
  window.location.reload();
  return res;
};

export const createKuzuGraph = async (dataset_id: string) => {
  const driver = await getDriver();
  //@ts-ignore
  const { files, schema } = await getFiles(dataset_id);
  await driver.use(dataset_id);
  await driver.createSchema(schema);
  await driver.loadGraph(files);
  return await driver.writeBack();
};
