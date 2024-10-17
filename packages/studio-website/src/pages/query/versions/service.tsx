export const queryVersion = (graph_id: string) => {
  return fetch(location.origin + `/api/v1/graph/${graph_id}/version`).then(res => {
    return res.json();
  });
};

export const startVersion = (graph_id: string, version_id: string) => {
  return fetch(location.origin + `/api/v1/graph/${graph_id}/version`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version_id,
    }),
  }).then(res => {
    return res.json();
  });
};
