export const SERVICES: {
  queryCypher: (params: { script: string }) => Promise<any>;
  queryCypherSchema: () => Promise<any>;
  queryStatistics: () => Promise<any>;
  queryLLM: (params: any) => Promise<any>;
  queryLLMResult: (params: any) => Promise<any>;
  setPrompt: (params: any) => Promise<any>;
  runClustering: (params: any) => Promise<any>;
  runSummarizing: (params: any) => Promise<any>;
} = {
  queryCypher: async () => ({}),
  queryCypherSchema: async () => ({}),
  queryStatistics: async () => ({}),
  queryLLM: async () => ({}),
  queryLLMResult: async () => ({}),
  setPrompt: async () => ({}),
  runClustering: async () => ({}),
  runSummarizing: async () => ({}),
};

export const registerServices = (id, server) => {
  SERVICES[id] = server;
};
