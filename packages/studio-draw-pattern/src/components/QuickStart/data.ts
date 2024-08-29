export const defaultNodes = [
  {
    id: '1eac0e63-2417-4083-b700-a103808c32b2',
    position: { x: 426, y: 430 },
    type: 'graph-node',
    data: {
      label: 'Vertex_1',
      properties: [
        {
          name: 'AGE',
          key: 'AGE',
          type: 'int',
        },
      ],
    },
    width: 100,
    height: 100,
  },
  {
    id: 'da4fec57-ef12-42b0-b09f-900969a2fbe8',
    position: { x: 200, y: 100 },
    type: 'graph-node',
    data: {
      label: 'Vertex_2',
      properties: [
        {
          name: 'AGE',
          key: 'AGE',
          type: 'int',
        },
        {
          name: 'NAME',
          key: 'NAME',
          type: 'string',
        },
      ],
    },
    width: 100,
    height: 100,
  },
];

export const defaultEdges = [
  {
    id: '9cd5dd38-fd69-4b48-90ea-ef504683df7f',
    source: '1eac0e63-2417-4083-b700-a103808c32b2',
    target: 'da4fec57-ef12-42b0-b09f-900969a2fbe8',
    type: 'graph-edge',
    data: { label: 'Edge_1', _extra: { count: 1, index: 0, isLoop: false } },
  },
];
