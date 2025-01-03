import { queryStatement } from './queryStatement';
export const queryPropertyStatics = async (property: string, label?: string) => {
  const match = ['year', 'month'];
  if (!match.includes(property)) {
    return [];
  }
  let matchScript = `MATCH(a)`;

  if (label) {
    matchScript = `MATCH(a:${label})`;
  }
  const data = await queryStatement(`
         ${matchScript} where a.${property} IS NOT NULL
          WITH a.${property} AS ${property}
          return ${property},COUNT(${property}) as counts
        `);

  return data.table;
};
