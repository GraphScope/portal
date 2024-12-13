import { queryStatement } from './queryStatement';
export const queryNeighborStatics = async (property: string, selectIds: string[]) => {
  const data = await queryStatement(`
        MATCH(a)-[b]-(c) 
        where a.${property} IS NOT NULL
        AND elementId(a) IN [${selectIds}]
        return c.${property},COUNT(c.${property}) as counts
      `);
  return data.table;
};
