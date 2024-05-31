/**
 * props.options.type
 */
export const defaultTypeOptions = [
  {
    label: 'DT_STRING',
    value: 'DT_STRING',
  },
  {
    label: 'DT_DOUBLE',
    value: 'DT_DOUBLE',
  },
  {
    label: 'DT_SIGNED_INT32',
    value: 'DT_SIGNED_INT32',
  },
  {
    label: 'DT_SIGNED_INT64',
    value: 'DT_SIGNED_INT64',
  },
];

export const defaultProperties = [
  {
    key: 'xxx-1',
    name: 'id',
    type: 'DT_STRING',
    primaryKey: true,

    index: 1,
    token: 'id',
  },
  {
    key: 'xxxx-2',

    name: 'name',
    type: 'DT_STRING',
    primaryKey: false,

    index: 2,
    token: 'xxx',
  },
];
export const typeColumn = [
  {
    label: 'string',
    value: 'string',
  },
  {
    label: 'number',
    value: 'number',
  },
];

export const mappingColumn = {
  options: [
    {
      label: 'id',
      value: '_id_',
    },
    {
      label: 'name',
      value: '_name_',
    },
  ],
  type: 'Select',
};
