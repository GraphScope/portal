import { Utils } from '@graphscope/studio-components';
import { queryStatement } from './queryStatement';
import { getQueryEngineType, transNeo4jSchema } from '../utils';

export const queryGraphSchema = async () => {
  try {
    const engine = getQueryEngineType();
    if (engine === 'neo4j') {
      const neo4jSchema = await queryStatement('CALL apoc.meta.schema');
      const schema = transNeo4jSchema(neo4jSchema.raw);
      return schema;
    }
    if (engine === 'kuzu_wasm') {
      return await queryStatement('CALL kuzu.meta.schema');
    }
    if (engine === 'graphscope') {
      const script = `call gs.procedure.meta.schema()`;
      const result = await queryStatement(script);
      const { schema } = result.table[0];
      const _schema = JSON.parse(schema);
      return Utils.transSchema(_schema);
    }
    return {
      nodes: [],
      edges: [],
    };
  } catch (error) {
    return { nodes: [], edges: [] };
  }
};
