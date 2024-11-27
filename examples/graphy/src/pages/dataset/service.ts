const baseURL = 'http://localhost:9999/api';
import { Utils } from '@graphscope/studio-components';
import { KuzuDriver } from '../../kuzu-driver';
import JSZip from 'jszip';
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
    body: JSON.stringify({
      dataset_id: id,
      model_kwargs,
      api_key: 'sk-XXXXXXXXXXXXXXXXXXXXXX',
      ...others,
    }),
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

export const runExtract = async (id, thread_num = 1) => {
  return fetch(baseURL + '/dataset/extract', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ dataset_id: id, thread_num }),
  })
    .then(res => res.json())
    .then(res => {
      if (res.success) {
        return res.data;
      }
    });
};
export const runInteractive = async id => {
  return fetch(baseURL + '/dataset/graphy/interactive', {
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
      const { label, query = '', output_schema = '', extract_from_indexs = '', extract_from_words = '' } = data;
      return {
        id,
        name: label,
        query,
        output_schema: output_schema,
        extract_from: {
          exact: extract_from_indexs.split(','),
          match: extract_from_words.split(','),
        },
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
      console.log('blob', blob);
      blob.arrayBuffer().then(res => {
        console.log(res);
      });

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
            label: entityId,
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
        console.log(nodes, edges);
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
        return res.data;
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

export const getFiles = async (dataset_id: string) => {
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
      return unzip(blob);
    })
    .catch(error => {
      console.error('Failed to download ZIP:', error);
    });
};

export async function unzip(zipBlob) {
  const zip = new JSZip();
  const zipContent = await zip.loadAsync(zipBlob);
  const files: File[] = [];
  let schema = {};
  for (const fileName in zipContent.files) {
    if (!zipContent.files[fileName].dir) {
      const fileContent = await zipContent.files[fileName].async('blob');
      const fileType = fileName.split('.')[1];
      const _file_name = fileName.split('/').pop() as string;
      console.log('_file_name', _file_name);

      const file = new File([fileContent], _file_name, {
        //@ts-ignore
        type: zipContent.files[fileName].options.type || `application/${fileType}`,
        lastModified: Date.now(),
      });
      if (fileType === 'csv') {
        files.push(file);
      }
      if (fileType === 'json') {
        //@ts-ignore
        const schemaInteractive = await readJson(file);
        schema = Utils.transSchema(schemaInteractive);
      }
    }
  }

  return { files, schema };
}

export async function readJson(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onerror = reject;
    reader.onload = async function (event) {
      //@ts-ignore
      const fileContent = event.target.result;
      //@ts-ignore
      const jsonObject = JSON.parse(fileContent);
      console.log(jsonObject);
      resolve(jsonObject);
    };
  });
}

declare global {
  interface Window {
    KUZU_DRIVER: KuzuDriver;
  }
}
export const getDriver = async () => {
  if (!window.KUZU_DRIVER) {
    const driver = new KuzuDriver();
    await driver.initialize();
    console.log('initialize', driver);
    window.KUZU_DRIVER = driver;
  }
  return window.KUZU_DRIVER;
};

export const useKuzuGraph = async (dataset_id: string) => {
  const driver = await getDriver();
  const exist = await driver.existDataset(dataset_id);

  if (!exist) {
    await createKuzuGraph(dataset_id);
  }
  return true;
};
export const createKuzuGraph = async (dataset_id: string) => {
  const driver = await getDriver();
  //@ts-ignore
  const { files, schema } = await getFiles(dataset_id);
  console.log(`DATASETID: ${dataset_id}`);
  await driver.use(dataset_id);
  await driver.createSchema(schema);
  await driver.loadGraph(files);
  console.log("finish load graph");
  await driver.writeBack();
  console.log('schema', files, schema);
};
