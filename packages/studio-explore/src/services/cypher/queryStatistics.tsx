import { queryStatement } from './queryStatement';
export const queryStatistics = async () => {
  try {
    // const script = `call gs.procedure.meta.statistics()`;
    // const result = await queryStatement(script);
    // debugger;
    // console.log('result', result, result.raw.records[0]._fields[0]);
    // return JSON.parse(result.raw.records[0]._fields[0]);

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
