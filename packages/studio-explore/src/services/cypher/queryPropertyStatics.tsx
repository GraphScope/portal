import { queryStatement } from './queryStatement';
export const queryPropertyStatics = async (property: string) => {
  const data = await queryStatement(`
          MATCH(a) where a.${property} IS NOT NULL
          WITH a.${property} AS ${property}
          return ${property},COUNT(${property}) as counts
        `);

  return data.table;
};
