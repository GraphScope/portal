const express = require('express');
const path = require('path');
const csv = require('csv-parser');
const fs = require('fs');
const { queryLocalFile, uuid } = require('./utils');
const { dataset, entity } = require('./data');
const cors = require('cors');
const app = express();

const port = 7777;

app.use(cors());
app.use(express.json());

const status = {
  WAITING_EMBEDDING: 'WAITING_EMBEDDING',
  WAITING_EXTRACT: 'WAITING_EXTRACT',
  WAITING_CLUSTER: 'WAITING_CLUSTER',
};

/** query graph data */
app.get('/api/query', async (req, res) => {
  const { name, type } = req.query;
  if (type === 'cluster') {
    const data = await queryLocalFile(`${name}_clusters.json`);
    res.send({
      success: true,
      data,
    });
    return;
  }
  const nodes = await queryLocalFile(`${name}.json`);
  const edges = await queryLocalFile(`${name}_IsSimilar_${name}.json`);
  res.send({
    success: true,
    data: {
      nodes: nodes.map(item => {
        return {
          id: item.id,
          label: name,
          properties: { ...item, cluster_id: item.cluster_id || 'unset' },
        };
      }),
      edges: edges.map(item => {
        return {
          id: item.id,
          source: item.source,
          target: item.target,
          label: name,
          properties: item,
        };
      }),
    },
  });
});

/** dataset */
app.get('/api/dataset/list', async (req, res) => {
  res.send({
    success: true,
    data: Object.keys(dataset).map(key => {
      return {
        id: key,
        ...dataset[key],
      };
    }),
  });
});
app.post('/api/dataset/create', async (req, res) => {
  const datasetId = uuid();
  dataset[datasetId] = {
    ...req.body,
    status: status.WAITING_EMBEDDING,
    schema: {},
    extract: {},
    entity: [],
  };
  res.send({
    success: true,
    data: datasetId,
  });
});

/** query embed schema */
app.post('/api/dataset/embed', async (req, res) => {
  const { datasetId, ...others } = req.body;
  const prev = dataset[datasetId];
  dataset[datasetId] = {
    ...prev,
    status: status.WAITING_EXTRACT,
    schema: others,
  };
  res.send({
    success: true,
    data: datasetId,
  });
});
app.get('/api/dataset/embed', async (req, res) => {
  const { datasetId } = req.query;
  const prev = dataset[datasetId];
  res.send({
    success: true,
    data: (prev && prev.schema) || {},
  });
});

/** extract */
app.post('/api/dataset/extract', async (req, res) => {
  const { datasetId, ...others } = req.body;
  const prev = dataset[datasetId];
  dataset[datasetId] = {
    ...prev,
    status: status.WAITING_CLUSTER,
    extract: others,
    entity: entity,
  };
  res.send({
    success: true,
    data: datasetId,
  });
});
app.get('/api/dataset/extract', async (req, res) => {
  const { datasetId } = req.query;
  const prev = dataset[datasetId];
  console.log('extract', prev);
  res.send({
    success: true,
    data: (prev && prev.extract) || {},
  });
});

app.post('/api/dataset/entity', async (req, res) => {
  const { datasetId, entityId, summarized, count } = req.body;
  console.log(req.body);
  const prev = dataset[datasetId];
  dataset[datasetId] = {
    ...prev,
    entity: entity.map(item => {
      if (item.id === entityId) {
        item.summarized = summarized;
        item.count = count;
      }
      return item;
    }),
  };
  res.send({
    success: true,
    data: {},
  });
});

// 设置路由来处理ZIP文件的下载
app.get('/api/download/dataset', (req, res) => {
  const filePath = path.resolve(__dirname, 'data', 'dataset.zip');
  res.download(filePath, err => {
    if (err) {
      console.error(err);
      res.status(500).send('Error downloading file.');
    }
  });
});

app.listen(port);

console.log('Service listen on', `http://127.0.0.1:${port}`);
