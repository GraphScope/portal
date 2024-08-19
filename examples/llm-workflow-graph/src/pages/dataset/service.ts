const baseURL = 'http://localhost:7777/api';

const url = new URL(baseURL);
// url.search = new URLSearchParams(params).toString();
export const queryDataset = async () => {
  return fetch(baseURL + '/dataset/list', {
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
    });
};

export const createDataset = async params => {
  return fetch(baseURL + '/dataset/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  })
    .then(res => res.json())
    .then(res => {
      if (res.success) {
        return res.data;
      }
    });
};
