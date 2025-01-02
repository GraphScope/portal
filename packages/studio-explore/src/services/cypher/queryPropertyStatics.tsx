import { queryStatement } from './queryStatement';
export const queryPropertyStatics = async (label: string, property: string) => {
  const match = ['year', 'month'];
  if (!match.includes(property)) {
    return [];
  }

  const data = await queryStatement(`
          MATCH(a:${label}) where a.${property} IS NOT NULL
          WITH a.${property} AS ${property}
          return ${property},COUNT(${property}) as counts
        `);
  return data.table;
};
