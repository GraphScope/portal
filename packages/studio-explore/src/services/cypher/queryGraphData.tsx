import type { IQueryGraphData } from '../../components/FetchGraph/index';
export const queryGraphData: IQueryGraphData['query'] = async () => {
  try {
    // const data = await queryStatement('Match a return a limit 100');
    // return data;
    return {
      nodes: [],
      edges: [],
    };
  } catch (error) {
    console.log('error', error);
    return {
      nodes: [],
      edges: [],
    };
  }
};
