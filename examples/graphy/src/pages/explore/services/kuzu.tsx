import { getDriver } from '../../dataset/service';
import { Utils } from '@graphscope/studio-components';
export const queryCypher = async (params: any) => {
  const driver = await getDriver();
  const data = await driver.queryData(params.script).catch(res => {
    return {
      nodes: [],
      edges: [],
    };
  });

  return data;
};

export const queryCypherSchema = async () => {
  const driver = await getDriver();
  const schema = await driver.querySchema();
  return schema;
};
export const queryStatistics = async () => {
  const driver = await getDriver();
  const count = await driver.getCount();

  const [total_vertex_count, total_edge_count] = count;
  return {
    total_vertex_count,
    total_edge_count,
  };
};
export const reload = async () => {
  const graph_id = (Utils.getSearchParams('graph_id') || '0') as string;
  const driver = await getDriver();
  await driver.switchDataset(graph_id);
  window.KUZU_DRIVER = driver;
};

export const queryLLM = async params => {
  const baseURL = 'http://localhost:9999/api';
  return fetch(`${baseURL}/llm/report/prepare`, {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(res => {
    return res.json();
  });
};

export const queryLLMResult = async params => {
  const baseURL = 'http://localhost:9999/api';
  return fetch(`${baseURL}/llm/report/generate`, {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(res => {
    return res.json();
  });
};

export const setPrompt = async params => {
  const baseURL = 'http://localhost:9999/api';
  return fetch(`${baseURL}/llm/report/prompt`, {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(res => {
    return res.json();
  });
};

export const runClustering = async params => {
  const baseURL = 'http://localhost:9999/api';
  return fetch(`${baseURL}/llm/report/clustering`, {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(res => {
    return res.json();
  });
};

export const runSummarizing = async params => {
  const baseURL = 'http://localhost:9999/api';
  return fetch(`${baseURL}/dataset/summarizing`, {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(res => {
    return res.json();
  });
};
