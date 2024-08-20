const express = require('express');
const path = require('path');
const csv = require('csv-parser');
const fs = require('fs');
const { queryLocalFile, uuid } = require('./utils');
const { store, entity } = require('./data');
const cors = require('cors');
const app = express();

const port = 7777;

app.use(cors());
app.use(express.json());

/** query graph data */
app.get('/api/query', async (req, res) => {
  const { name, type } = req.query;
  // console.log(name, type);
  const nodes = await queryLocalFile(`${name}.csv`);
  const edges = await queryLocalFile(`${name}_IsSimilar_${name}.csv`);
  res.send({
    success: true,
    data: {
      nodes,
      edges,
    },
  });
});

/** dataset */
app.get('/api/dataset/list', async (req, res) => {
  res.send({
    success: true,
    data: Object.keys(store.dataset).map(key => {
      return {
        id: key,
        ...store.dataset[key],
      };
    }),
  });
});
app.post('/api/dataset/create', async (req, res) => {
  const datasetId = uuid();
  store.dataset[datasetId] = {
    ...req.body,
    status: 'waiting embedding',
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
  const prev = store.dataset[datasetId];
  store.dataset[datasetId] = {
    ...prev,
    status: 'wating extract',
    schema: others,
  };
  res.send({
    success: true,
    data: datasetId,
  });
});
app.get('/api/dataset/embed', async (req, res) => {
  const { datasetId } = req.query;
  const prev = store.dataset[datasetId];
  res.send({
    success: true,
    data: (prev && prev.schema) || {},
  });
});

/** extract */
app.post('/api/dataset/extract', async (req, res) => {
  const { datasetId, ...others } = req.body;
  const prev = store.dataset[datasetId];
  store.dataset[datasetId] = {
    ...prev,
    status: 'start extract',
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
  const prev = store.dataset[datasetId];
  console.log('extract', prev);
  res.send({
    success: true,
    data: (prev && prev.extract) || {},
  });
});

app.listen(port);

console.log('Service listen on', `http://127.0.0.1:${port}`);
