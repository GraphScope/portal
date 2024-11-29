import GraphScopeServices from './graphscope';
import KuzuWasmServices from './kuzu-wasm';
import { Utils } from '@graphscope/studio-components';
export default {
  graphscope: GraphScopeServices,
  'kuzu-wasm': KuzuWasmServices,
};

export const getDefaultServices = () => {
  const query_endpoint = Utils.storage.get<string>('query_endpoint');
  if (!query_endpoint) {
    return GraphScopeServices;
  }
  const [engineId, graphId] = query_endpoint.split('://');
  if (engineId === 'kuzu_wasm') {
    return KuzuWasmServices;
  }
  return GraphScopeServices;
};
