const baseURL = 'http://localhost:9999/api';

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
  const { file } = params;
  const formData = new FormData();
  formData.append('file', file); // 添加文件到表单数据中

  return fetch(baseURL + '/dataset/create', {
    method: 'POST',
    body: formData,
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

export const updateClusterSummarize = async (datasetId, params) => {
  return fetch(baseURL + '/dataset/entity', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ datasetId, ...params }),
  })
    .then(res => res.json())
    .then(res => {
      if (res.success) {
        return res.data;
      }
    });
};

export const downloadDataset = async () => {
  return fetch(baseURL + '/download/dataset', { method: 'GET' })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.blob();
    })
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'dataset.zip');
      document.body.appendChild(link);
      link.click();
    })
    .catch(error => {
      console.error('Failed to download ZIP:', error);
    });
};
