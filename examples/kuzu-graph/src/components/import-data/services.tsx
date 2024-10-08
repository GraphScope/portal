import { KuzuDriver } from '../../kuzu-javascript-driver/index';
declare global {
  interface Window {
    kuzuDriver: KuzuDriver; //
  }
}
export const getDriver = async () => {
  if (!window.kuzuDriver) {
    const kuzuDriver = new KuzuDriver();
    await kuzuDriver.initialize();
    window.kuzuDriver = kuzuDriver;
  }
  const { kuzuDriver } = window;
  return kuzuDriver;
};
export const createGraph = async (params: { nodes: any[]; edges: any[] }, graph_id?: string) => {
  const schema = transform(params);
  console.log('params2', params, schema);

  const kuzuDriver = await getDriver();

  await kuzuDriver.createSchema(schema);

  // const insertQuery = "CREATE (u:User {name: 'Alice', age: 35})";
  // await kuzuDriver.insertData(insertQuery);

  // const query = 'MATCH (n) RETURN n';
  // const queryResult = await kuzuDriver.queryData(query);

  return {
    graph_id: '1',
  };
};

export const importGraph = async (csvFiles: File[]) => {
  console.log('csvFiles', csvFiles);
  const kuzuDriver = await getDriver();
  return await kuzuDriver.switchDataset('DRAFT_GRAPH_FILES');
  // return await kuzuDriver.loadGraph(csvFiles);
};

export const switchGraph = async (datasetId: string) => {
  const kuzuDriver = await getDriver();
  return await kuzuDriver.switchDataset(datasetId);
}

export const exportGraph = async () => {
  const kuzuDriver = await getDriver();
  return await kuzuDriver.exportData();
}

export function transform(params) {
  return {
    nodes: params.nodes.map(item => {
      const { id, data } = item;
      const { properties, label } = data;
      return {
        id,
        label,
        properties: properties.map(item => {
          return {
            name: item.name,
            type: item.type,
            primaryKey: item.primaryKey,
          };
        }),
      };
    }),
    edges: params.edges.map(item => {
      const { id, data, source, target } = item;
      const { properties, label } = data;
      return {
        id,
        label,
        source,
        target,
        properties: properties.map(item => {
          return {
            name: item.name,
            type: item.type,
          };
        }),
      };
    }),
  };
}
