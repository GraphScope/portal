import { Utils } from '@graphscope/studio-components';
const { uuid, getSearchParams } = Utils;
import { queryGraph } from '@graphscope/studio-driver';

interface Params {
  script: string;
}

export async function queryCypher(params: Params) {
  const { script = `` } = params;
  const endpoint = getSearchParams('endpoint') || 'neo4j://127.0.0.1:7687';
  const language = (getSearchParams('language') || 'cypher') as 'cypher' | 'gremlin';
  const username = getSearchParams('username') || 'admin';
  const password = getSearchParams('password') || 'password';
  const data = await queryGraph({ script, language, endpoint, username, password });
  return data;
}
export async function queryCypherSchema() {
  try {
    const script = `call gs.procedure.meta.schema()`;
    const result = await queryCypher({ script });
    const { schema } = result.table[0];
    const _schema = JSON.parse(schema);
    console.log('_schema', _schema, Utils.transSchema(_schema));
    return Utils.transSchema(_schema);
  } catch (error) {
    return {
      nodes: [],
      edges: [],
    };
  }
}

// export async function query(params: Params) {
//   const baseURL = 'http://localhost:9999/api/query';

//   const url = new URL(baseURL);
//   url.search = new URLSearchParams(params).toString();
//   return await fetch(url, {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   })
//     .then(res => res.json())
//     .then(res => {
//       if (res.success) {
//         const { nodes, edges } = res.data;
//         return {
//           nodes,
//           edges: edges.map(item => {
//             return {
//               id: Utils.uuid(),
//               ...item,
//             };
//           }),
//         };
//       }
//       return {
//         nodes: [],
//         edges: [],
//       };
//     })
//     .catch(err => {
//       return {
//         nodes: [],
//         edges: [],
//       };
//     });
// }
