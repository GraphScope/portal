interface Params {
  name: string;
  type?: 'nodes' | 'edges' | 'cluster';
  weight?: string;
  [key: string]: any;
}
import { Utils } from '@graphscope/studio-components';
const { uuid, getSearchParams } = Utils;
import { queryGraph } from '@graphscope/studio-driver';

export async function query(params: Params) {
  const { script = `match (p: Paper) where p.title starts with "Graph" return p` } = params;
  const endpoint = getSearchParams('endpoint') || 'neo4j://127.0.0.1:7687';
  const language = (getSearchParams('language') || 'cypher') as 'cypher' | 'gremlin';
  const username = getSearchParams('username') || 'admin';
  const password = getSearchParams('password') || 'password';

  const data = await queryGraph({ script, language, endpoint, username, password });
  return data;
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
