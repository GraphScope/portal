const express = require('express');
const path = require('path');
const csv = require('csv-parser');
const fs = require('fs');
const { queryLocalFile, uuid } = require('./utils');
const { store } = require('./data');
const cors = require('cors');
const app = express();

const port = 7777;

app.use(cors());
app.use(express.json());

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

app.get('/api/dataset/list', async (req, res) => {
  res.send({
    success: true,
    data: store,
  });
});
app.post('/api/dataset/create', async (req, res) => {
  console.log('req.body', req.body);
  const datasetId = uuid();
  store.dataset[datasetId] = {
    ...req.body,
    status: 'await embedding',
    schema: {},
    extract: {},
    entity: [],
  };
  res.send({
    success: true,
    data: datasetId,
  });
});

app.listen(port);

console.log('Service listen on', `http://127.0.0.1:${port}`);
