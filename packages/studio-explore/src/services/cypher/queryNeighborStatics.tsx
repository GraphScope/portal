import { queryStatement } from './queryStatement';
export const queryNeighborStatics = async (property: string, selectIds: string[]) => {
  if (property === 'label') {
    const data = await queryStatement(`MATCH(a)-[b]-(c) 
      where elementId(a) IN [${selectIds}]
      WITH c, labels(c) as label
      return label, COUNT(*) as counts
      ORDER BY counts DESC
      `);

    return data.table;
  }
  const data = await queryStatement(`
        MATCH(a)-[b]-(c) 
        where a.${property} IS NOT NULL
        AND elementId(a) IN [${selectIds}]
        return c.${property},COUNT(c.${property}) as counts
      `);
  return data.table;
};
