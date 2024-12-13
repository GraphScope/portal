export const data = {
  nodes: [
    {
      id: 'id-1',
      properties: {
        name: 'first node',
        age: 18,
        cluster: 'c0',
      },
    },
    {
      id: 'id-2',
      properties: {
        cluster: 'c1',
      },
    },
  ],
  edges: [
    {
      source: 'id-1',
      target: 'id-2',
      id: 'e1',
      properties: {
        weight: 0.8,
      },
    },
  ],
};

export const schema = {
  nodes: [],
  edges: [],
};
