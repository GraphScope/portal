const entity = [
  {
    id: 'Challenge',
    value: 326,
    cost: '1 hours',
    clustered: false,
  },
  {
    id: 'Task',
    value: 136,
    cost: '2 hours',
    clustered: false,
  },
  {
    id: 'Paper',
    value: 142,
    cost: '3 hours',
    clustered: true,
  },
];
const dataset = [
  {
    fileType: 'pdf',
    value: 142,
    status: 'running',
    schema: {},
    extract: {},
    entity: entity,
  },
];

const store = {
  dataset: {},
  entity: [],
};

module.exports = { store, entity };
