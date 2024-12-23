import { queryStatement } from './queryStatement';
import { getQueryEngineType } from '../utils';
export const queryStatistics = async () => {
  try {
    const engine = getQueryEngineType();

    if (engine === 'kuzu_wasm') {
      const [total_vertex_count, total_edge_count] = await queryStatement('CALL kuzu.meta.statistics');
      return {
        total_vertex_count,
        total_edge_count,
      };
    }
    if (engine === 'graphscope') {
      // const script = `call gs.procedure.meta.statistics()`;
      // const result = await queryStatement(script);
      // console.log('result', result, result.raw.records[0]._fields[0]);
      // return JSON.parse(result.raw.records[0]._fields[0]);
    }

    // 临时方案
    const countNodes = await queryStatement('MATCH (n) RETURN count(n)');
    const countEdges = await queryStatement('MATCH (a)-[r]-(b) RETURN count(r)');
    return {
      total_vertex_count: countNodes.raw.records[0]._fields[0].toNumber(),
      total_edge_count: countEdges.raw.records[0]._fields[0].toNumber(),
    };
  } catch (error) {
    return {
      total_vertex_count: 0,
      total_edge_count: 0,
    };
  }
};
