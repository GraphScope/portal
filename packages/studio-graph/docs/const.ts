export const data = {
  nodes: [
    {
      id: 'id-1',
      properties: {
        name: 'first node',
        age: 18,
      },
    },
    {
      id: 'id-2',
      properties: {},
    },
  ],
  edges: [
    {
      source: 'id-1',
      target: 'id-2',
      id: 'e1',
      properties: {},
    },
  ],
};

export const schema = {
  nodes: [],
  edges: [],
};
