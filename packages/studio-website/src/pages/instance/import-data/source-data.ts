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
        { key: uuidv4(), name: 'id', type: 'string', primaryKey: true, dataindex: 1 },
        { key: uuidv4(), name: 'pre', type: 'double', primaryKey: true, dataindex: 3 },
      ],
    },
    {
      key: uuidv4(),
      label: 'user1',
      datatype: 'Files',
      filelocation: '',
      isBind: false,
      properties: [{ key: uuidv4(), name: 'id', type: 'string', primaryKey: true, dataindex: 3 }],
    },
  ],
  edges: [
    {
      key: uuidv4(),
      label: 'edge',
      datatype: 'ODPS',
      filelocation: 'edges',
      source: 'user',
      target: 'user1',
      isBind: false,
      properties: [{ key: uuidv4(), name: 'id', type: 'str', primaryKey: true, dataindex: 5 }],
    },
  ],
};
