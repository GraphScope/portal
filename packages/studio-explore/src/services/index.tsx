import CypherServices from './cypher';
import GremlinServices from './gremlin';
import { Utils } from '@graphscope/studio-components';
export default {
  gremlin: GremlinServices,
  cypher: CypherServices,
};

export const getDefaultServices = () => {
  const query_language = Utils.storage.get<string>('query_language');
  if (query_language === 'gremlin') {
    return GremlinServices;
  }
  return CypherServices;
};
