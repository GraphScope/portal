import { v4 as uuidv4 } from 'uuid';
export const SOURCEDATA = {
  nodes: [
    {
      key: uuidv4(),
      label: 'user',
      datatype: 'ODPS',
      filelocation: 'nodes',
      isBind: true,
      // source 应该改为  dataIndex
      properties: [
        { key: uuidv4(), properties: 'id', type: 'str', primaryKey: true, columnIndex: 1 },
        { key: uuidv4(), properties: 'pre', type: 'double', primaryKey: true, columnIndex: 3 },
      ],
    },
    {
      key: uuidv4(),
      label: 'usertest',
      datatype: 'Files',
      filelocation: '',
      isBind: false,
      properties: [{ key: uuidv4(), properties: 'id', type: 'str', primaryKey: true, columnIndex: 3 }],
    },
  ],
  edges: [
    {
      key: uuidv4(),
      label: 'edge',
      datatype: 'ODPS',
      filelocation: 'edges',
      source: 'user',
      target: 'usertest',
      isBind: false,
      properties: [{ key: uuidv4(), properties: 'id', type: 'str', primaryKey: true, columnIndex: 5 }],
    },
  ],
};
