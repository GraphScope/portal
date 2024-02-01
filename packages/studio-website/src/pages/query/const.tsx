export const SCHEMA_DATA = {
  nodes: [
    {
      label: 'person',
      properties: [
        {
          name: 'name',
          type: 'string',
        },
        {
          name: 'age',
          type: 'number',
        },
      ],
      primary: 'name',
    },
    {
      label: 'software',
      properties: [
        {
          name: 'lang',
          type: 'string',
        },
        {
          name: 'name',
          type: 'string',
        },
      ],
      primary: 'name',
    },
  ],
  edges: [
    {
      label: 'created',
      properties: [
        {
          name: 'weight',
          type: 'number',
        },
      ],
      primary: 'weight',
      constraints: [['person', 'software']],
    },
  ],
};

export const FUNTIONS = [
  {
    name: 'customAddA',
    type: '自定义',
    signatures: [],
    desc: '这是用来AddA',
  },
  {
    name: 'customAddB',
    type: '自定义',
    signatures: [],
    desc: '这是用来AddB',
  },
  {
    name: 'customAddC',
    type: '自定义',
    signatures: [],
    desc: '这是用来AddC',
  },
];
