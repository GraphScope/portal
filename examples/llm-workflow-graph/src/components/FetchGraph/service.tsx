interface Params {
  name: string;
  type?: 'nodes' | 'edges' | 'cluster';
  weight?: string;
  [key: string]: any;
}
export async function query(params: Params) {
  const baseURL = 'http://localhost:7777/api/query';

  const url = new URL(baseURL);
  url.search = new URLSearchParams(params).toString();
  return await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(res => res.json())
    .then(res => {
      if (res.success) {
        return res.data;
      }
      return {
        nodes: [],
        edges: [],
      };
    })
    .catch(err => {
      return {
        nodes: [],
        edges: [],
      };
    });
}
