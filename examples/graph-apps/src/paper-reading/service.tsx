import { Utils } from '@graphscope/studio-components';
const { getSearchParams } = Utils;
import { queryGraph } from '@graphscope/studio-driver';

interface Params {
  script: string;
}

export async function queryCypher(params: Params) {
  const { script = `` } = params;
  const endpoint = getSearchParams('endpoint') || 'neo4j://127.0.0.1:7687';
  const language = (getSearchParams('language') || 'cypher') as 'cypher' | 'gremlin';
  const username = getSearchParams('username') || 'admin';
  const password = getSearchParams('password') || 'password';
  const data = await queryGraph({ script, language, endpoint, username, password });
  return data;
}

export async function queryCypherSchema() {
  try {
    const script = `call gs.procedure.meta.schema()`;
    const result = await queryCypher({ script });
    const { schema } = result.table[0];
    const _schema = JSON.parse(schema);
    console.log('_schema', _schema, Utils.transSchema(_schema));
    return Utils.transSchema(_schema);
  } catch (error) {
    return {
      nodes: [],
      edges: [],
    };
  }
}
