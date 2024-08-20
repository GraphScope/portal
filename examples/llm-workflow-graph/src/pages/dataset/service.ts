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

export const updateExtractConfig = async (id, params) => {
  return fetch(baseURL + '/dataset/extract', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ datasetId: id, ...params }),
  })
    .then(res => res.json())
    .then(res => {
      if (res.success) {
        return res.data;
      }
    });
};
export const getExtractConfig = async id => {
  return fetch(baseURL + `/dataset/extract?datasetId=${id}`, {
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

export const getEmbedSchema = async id => {
  return fetch(baseURL + `/dataset/embed?datasetId=${id}`, {
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

export const updateEmbedSchema = async (id, params) => {
  return fetch(baseURL + '/dataset/embed', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ datasetId: id, ...params }),
  })
    .then(res => res.json())
    .then(res => {
      if (res.success) {
        return res.data;
      }
    });
};
