export const defaultNodes = [
  {
    id: '1eac0e63-2417-4083-b700-a103808c32b2',
    position: { x: 426, y: 430 },
    type: 'graph-node',
    data: { label: 'Vertex_1' },
    width: 100,
    height: 100,
  },
  {
    id: 'da4fec57-ef12-42b0-b09f-900969a2fbe8',
    position: { x: 200, y: 100 },
    type: 'graph-node',
    data: { label: 'Vertex_2' },
    width: 100,
    height: 100,
  },
];

export const defaultEdges = [
  {
    id: 'c2aabfa0-0d71-46ff-8300-82c7bdf2c53e',
    source: '70121067-3296-46a8-9624-b3b6a5db8558',
    target: '9ca0b0bc-c33e-479b-af3a-fa6562461132',
    type: 'graph-edge',
    data: {
      label: 'Edge_1',
      _extra: { count: 3, index: 0, type: 'poly', isPoly: true, isLoop: false, offset: 0, isRevert: false },
    },
  },
  {
    id: '98917512-3b4f-4d5d-8f01-c59602a4ef63',
    source: '70121067-3296-46a8-9624-b3b6a5db8558',
    target: '9ca0b0bc-c33e-479b-af3a-fa6562461132',
    type: 'graph-edge',
    data: {
      label: 'Edge_3',
      _extra: { count: 3, index: 1, type: 'poly', isPoly: true, isLoop: false, offset: -30, isRevert: false },
    },
  },
  {
    id: '2bee1a26-bc7b-435f-9094-6177b2f1ff98',
    source: '70121067-3296-46a8-9624-b3b6a5db8558',
    target: '9ca0b0bc-c33e-479b-af3a-fa6562461132',
    type: 'graph-edge',
    data: {
      label: 'Edge_4',
      _extra: { count: 3, index: 2, type: 'poly', isPoly: true, isLoop: false, offset: 30, isRevert: false },
    },
  },
];
