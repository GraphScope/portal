/**
 * @description: standard property graph
 */
export const initalData = {
  nodes: [
    {
      id: 'node-1',
      data: {
        label: 'person',
      },
      type: 'graph-node',
      position: { x: Math.random() * 500, y: Math.random() * 500 },
    },
    {
      type: 'graph-node',
      id: 'node-2',
      data: {
        label: 'software',
      },
      position: { x: Math.random() * 500, y: Math.random() * 500 },
    },
  ],
  edges: [
    {
      type: 'graph-edge',
      id: 'edge-1',
      label: 'created',
      source: 'node-1',
      target: 'node-2',
      data: {
        _offset: 30,
      },
    },
    {
      type: 'graph-edge',
      id: 'edge-2',
      label: 'like',
      source: 'node-1',
      target: 'node-2',
      data: {
        _offset: -30,
      },
    },

    // {
    //   id: 'edge-3',
    //   label: 'loop',
    //   source: 'node-1',
    //   target: 'node-1',
    //   properties: {},
    // },
    // {
    //   id: 'edge-4',
    //   label: 'xxxxx',
    //   source: 'node-2',
    //   target: 'node-1',
    //   properties: {},
    // },
  ],
};

export const process = data => {
  const { nodes, edges } = data;
  const relationship: { source; target }[] = [];
  /** 把边也当作一个实体去处理 */
  const entity = edges.map(item => {
    const { source, target, id, properties } = item;
    relationship.push({
      source: source,
      target: id,
    });
    relationship.push({
      source: id,
      target: target,
    });
    return {
      ...item,
      _fromEdge: true,
      id: item.id,
      data: properties,
    };
  });
  return {
    nodes: [...nodes, ...entity],
    edges: relationship,
  };
};

export const paperData = {
  nodes: [
    {
      primary: 'id',
      label: 'Paper',
      id: '2e3a8d05-a1dd-457d-ad63-ffbdae8391b8',
      properties: [
        {
          name: 'id',
          type: 'DT_SIGNED_INT64',
          primaryKey: true,
          disable: true,
          id: '4d8458dd-fafc-4045-a40f-1f3f7929992f',
          token: '',
        },
        {
          name: 'conference',
          type: 'DT_STRING',
          primaryKey: false,
          disable: true,
          id: '1ce8a683-63d5-4cfc-b2c8-a9054a43d420',
          token: '',
        },
        {
          name: 'CCFRank',
          type: 'DT_STRING',
          primaryKey: false,
          disable: true,
          id: '2fbae511-ae4e-4788-bd71-2faf80766fc5',
          token: '',
        },
        {
          name: 'CCFField',
          type: 'DT_STRING',
          primaryKey: false,
          disable: true,
          id: '909ddf00-cc8d-48b3-9c3c-ffeacaad3557',
          token: '',
        },
        {
          name: 'year',
          type: 'DT_SIGNED_INT32',
          primaryKey: false,
          disable: true,
          id: 'ca394250-b46f-4bfa-b419-61943cd9cca0',
          token: '',
        },
        {
          name: 'paper',
          type: 'DT_STRING',
          primaryKey: false,
          disable: true,
          id: '7c976240-0305-4c3e-a9be-083eb7d8d861',
          token: '',
        },
      ],
    },
    {
      primary: 'id',
      label: 'Challenge',
      id: '3b635ef4-8a05-4d8d-a47b-47d804de6fff',
      properties: [
        {
          name: 'id',
          type: 'DT_SIGNED_INT64',
          primaryKey: true,
          disable: true,
          id: '9d9e99aa-9f26-40ad-b7d6-cbf81ce6e8b1',
          token: '',
        },
        {
          name: 'challenge',
          type: 'DT_STRING',
          primaryKey: false,
          disable: true,
          id: 'c8853bcd-b450-4182-9700-5dc121756c17',
          token: '',
        },
      ],
    },
    {
      primary: 'id',
      label: 'Topic',
      id: '8c7632ef-0405-4ede-b1c0-b6f0604a17ed',
      properties: [
        {
          name: 'id',
          type: 'DT_SIGNED_INT64',
          primaryKey: true,
          disable: true,
          id: '60d36804-5a16-4971-a94b-3bfc00f9e839',
          token: '',
        },
        {
          name: 'category',
          type: 'DT_STRING',
          primaryKey: false,
          disable: true,
          id: 'ef3793df-b316-406f-99ef-dac7f0f1780d',
          token: '',
        },
      ],
    },
    {
      primary: 'id',
      label: 'Task',
      id: '4e127d65-1ffb-4569-b1ed-c3f357677529',
      properties: [
        {
          name: 'id',
          type: 'DT_SIGNED_INT64',
          primaryKey: true,
          disable: true,
          id: '5ab31721-cd39-47ef-9add-a7e67b47137e',
          token: '',
        },
        {
          name: 'task',
          type: 'DT_STRING',
          primaryKey: false,
          disable: true,
          id: 'b42868f0-511e-4408-b9ba-ab64f3e9990d',
          token: '',
        },
      ],
    },
    {
      primary: 'id',
      label: 'Solution',
      id: 'f2221217-5ea0-4e9e-b4f0-60f1300aca59',
      properties: [
        {
          name: 'id',
          type: 'DT_SIGNED_INT64',
          primaryKey: true,
          disable: true,
          id: '0e988ee5-2eef-4f27-af4c-6b1d8b38c7a0',
          token: '',
        },
        {
          name: 'solution',
          type: 'DT_STRING',
          primaryKey: false,
          disable: true,
          id: '369bbfab-0473-4f80-9bd6-1f1c568db6c8',
          token: '',
        },
      ],
    },
    {
      primary: 'id',
      label: 'CCFField',
      id: '633d5b2c-c349-45d3-9ca1-ccb4d88d66ca',
      properties: [
        {
          name: 'id',
          type: 'DT_SIGNED_INT64',
          primaryKey: true,
          disable: true,
          id: 'dd5940c2-6573-4812-b4db-c50ba5d1c80f',
          token: '',
        },
        {
          name: 'field',
          type: 'DT_STRING',
          primaryKey: false,
          disable: true,
          id: '61eed642-0077-4003-8510-66ed42c33265',
          token: '',
        },
      ],
    },
  ],
  edges: [
    {
      label: 'WorkOn',
      relation: 'MANY_TO_ONE',
      id: '6da27b66-bd2e-498b-a908-460b536f8393',
      source: '2e3a8d05-a1dd-457d-ad63-ffbdae8391b8',
      target: '4e127d65-1ffb-4569-b1ed-c3f357677529',
      properties: [],
    },
    {
      label: 'Resolve',
      relation: 'MANY_TO_MANY',
      id: 'b1d208b3-2cfb-481d-a1f3-0b249cadfa37',
      source: '2e3a8d05-a1dd-457d-ad63-ffbdae8391b8',
      target: '3b635ef4-8a05-4d8d-a47b-47d804de6fff',
      properties: [],
    },
    {
      label: 'Target',
      relation: 'MANY_TO_MANY',
      id: 'e8121b1f-145a-4918-8a75-5a0659d0af49',
      source: '4e127d65-1ffb-4569-b1ed-c3f357677529',
      target: '3b635ef4-8a05-4d8d-a47b-47d804de6fff',
      properties: [
        {
          name: 'number',
          type: 'DT_SIGNED_INT32',
          disable: true,
          id: '593f17d4-5e2d-4ba4-b1c0-b5fe3b3b10e5',
          token: '',
        },
      ],
    },
    {
      label: 'Belong',
      relation: 'MANY_TO_ONE',
      id: 'ffc53d35-cd5d-4f21-ae04-aed92d0ec004',
      source: '4e127d65-1ffb-4569-b1ed-c3f357677529',
      target: '8c7632ef-0405-4ede-b1c0-b6f0604a17ed',
      properties: [],
    },
    {
      label: 'Use',
      relation: 'MANY_TO_MANY',
      id: 'cea4293e-878f-4b57-8e8f-abf97b77ffb2',
      source: '2e3a8d05-a1dd-457d-ad63-ffbdae8391b8',
      target: 'f2221217-5ea0-4e9e-b4f0-60f1300aca59',
      properties: [],
    },
    {
      label: 'ApplyOn',
      relation: 'MANY_TO_ONE',
      id: '16f200e8-f725-4bce-8d41-72755aac4199',
      source: 'f2221217-5ea0-4e9e-b4f0-60f1300aca59',
      target: '3b635ef4-8a05-4d8d-a47b-47d804de6fff',
      properties: [],
    },
    {
      label: 'HasField',
      relation: 'MANY_TO_MANY',
      id: 'a08867b8-b078-4528-99d1-0d9706ef3ee5',
      source: '2e3a8d05-a1dd-457d-ad63-ffbdae8391b8',
      target: '633d5b2c-c349-45d3-9ca1-ccb4d88d66ca',
      properties: [],
    },
    {
      label: 'Citation',
      relation: 'MANY_TO_MANY',
      id: '86259a9f-a407-42c2-9e97-2420266ea1d4',
      source: '2e3a8d05-a1dd-457d-ad63-ffbdae8391b8',
      target: '2e3a8d05-a1dd-457d-ad63-ffbdae8391b8',
      properties: [],
    },
  ],
};
