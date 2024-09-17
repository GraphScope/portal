const baseURL = 'http://localhost:9999/api';
import { Utils } from '@graphscope/studio-components';

const url = new URL(baseURL);
// url.search = new URLSearchParams(params).toString();
export const queryDataset = async () => {
  return fetch(baseURL + '/dataset', {
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
export const deleteDataset = async (id: string) => {
  return fetch(`${baseURL}/dataset/${id}`, {
    method: 'DELETE',
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

  return fetch(baseURL + '/dataset', {
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
  console.log('params', params);
  let { model_kwargs, ...others } = params;
  try {
    model_kwargs = JSON.parse(model_kwargs);
  } catch (error) {}
  return fetch(baseURL + '/llm/config', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ dataset_id: id, model_kwargs, ...others }),
  })
    .then(res => res.json())
    .then(res => {
      if (res.success) {
        return res.data;
      }
    });
};
export const getExtractConfig = async id => {
  return fetch(baseURL + `/llm/config?dataset_id=${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(res => res.json())
    .then(res => {
      if (res.success) {
        let {
          model_kwargs = {
            streaming: true,
          },
          llm_model = 'qwen-plus',
          base_url = 'https://dashscope.aliyuncs.com/compatible-mode/v1',
          ...others
        } = res.data;

        try {
          model_kwargs = JSON.stringify(model_kwargs, null, 2);
        } catch (error) {
          model_kwargs = '{}';
        }
        return {
          model_kwargs,
          llm_model,
          base_url,
          ...others,
        };
      }
    });
};

export const runExtract = async id => {
  return fetch(baseURL + '/dataset/extract', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ dataset_id: id }),
  })
    .then(res => res.json())
    .then(res => {
      if (res.success) {
        return res.data;
      }
    });
};

export const getExtractResult = async (id: string) => {
  return fetch(`${baseURL}/dataset/extract?dataset_id=${id}`, {
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
  return fetch(baseURL + `/dataset/workflow/config?dataset_id=${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(res => res.json())
    .then(res => {
      if (res.success) {
        return (res.data && res.data.workflow_json) || { nodes: [], edges: [] };
      }
    });
};

export const updateEmbedSchema = async (id, params) => {
  const { nodes, edges } = params;

  const workflow_json = {
    nodes: nodes.map(item => {
      const { id, data } = item;
      const { label, query = '', output_schema = '' } = data;
      return {
        id,
        name: label,
        query,
        output_schema: output_schema,
        extract_from: [],
      };
    }),

    edges: edges.map(item => {
      const { id, data } = item;
      return {
        id,
        source: item.source,
        target: item.target,
        label: data.label,
      };
    }),
  };

  return fetch(baseURL + '/dataset/workflow/config', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ dataset_id: id, workflow_json }),
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

export const downloadDataset = async (dataset_id: string) => {
  return fetch(baseURL + '/dataset/graphy', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ dataset_id }),
  })
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

export const runCluster = async (datasetId, entityId) => {
  return fetch(baseURL + '/dataset/clustering', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ dataset_id: datasetId, workflow_node_name: entityId }),
  })
    .then(res => res.json())
    .then(res => {
      if (res.success) {
        const nodes = res.data.nodes.map(item => {
          const { id, cluster_id = 'Unclustered' } = item;
          return {
            id,
            label: cluster_id,
            properties: {
              ...item,
              cluster_id,
            },
          };
        });
        const edges = res.data.edges.map(item => {
          return {
            id: Utils.uuid(),
            ...item,
          };
        });
        return { nodes, edges };
      }
      return {
        nodes: [],
        edges: [],
      };
    });
};

export const runSummarize = async (datasetId, { entityId, cluster_ids }) => {
  return fetch(baseURL + '/dataset/summarizing', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      dataset_id: datasetId,
      cluster_ids,
      workflow_node_name: entityId,
    }),
  })
    .then(res => res.json())
    .then(res => {
      if (res.success) {
        const nodes = res.data.map(item => {
          const { id } = item;
          return {
            id,
            label: entityId,
            properties: item,
          };
        });
        return nodes;
      }
      return [];
    });
};

export async function getExtractResultByEntity(params: any) {
  const url = new URL(`${baseURL}/dataset/extract`);
  url.search = new URLSearchParams(params).toString();
  return await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(res => res.json())
    .then(res => {
      if (res.success && res.data) {
        try {
          const { papers, node_name, progress } = res.data[0];
          const nodes: any[] = [];
          const edges: any[] = [];
          papers.forEach(paper => {
            const { id, name, data } = paper;
            nodes.push({
              id,
              label: 'Paper',
              properties: {
                name,
              },
            });
            data.forEach(d => {
              nodes.push({
                id: d.id,
                label: node_name,
                properties: d,
              });
              edges.push({
                id: Utils.uuid(),
                source: id,
                target: d.id,
              });
            });
          });
          return {
            nodes,
            edges,
            progress,
          };
        } catch (error) {}
      }
      return {
        nodes: [],
        edges: [],
        progress: 0,
      };
    })
    .catch(err => {
      return {
        nodes: [],
        edges: [],
        progress: 0,
      };
    });
}
