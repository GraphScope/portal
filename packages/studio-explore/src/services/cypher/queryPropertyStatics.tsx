import { queryStatement } from './queryStatement';
import { Utils } from '@graphscope/studio-components';
export const queryPropertyStatics = async (property: string, label?: string) => {
  const statistical_keys = (Utils.storage.get('exploration_chart_statistical_keys') as string[]) || [];

  if (!statistical_keys.includes(property)) {
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
