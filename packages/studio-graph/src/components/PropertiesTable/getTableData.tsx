import type { NodeData } from '../../graph/types';
export const getTable = (data: NodeData[]) => {
  const columns = new Map();
  columns.set('id', {
    title: 'id',
    dataIndex: 'id',
    key: 'id',
  });
  columns.set('label', {
    title: 'label',
    dataIndex: 'label',
    key: 'label',
  });
  const dataSource = data.map(item => {
    const { id, properties = {}, label } = item;
    Object.keys(properties).forEach(key => {
      columns.set(key, {
        title: key,
        dataIndex: key,
        key,
      });
    });
    return {
      key: id,
      id,
      label,
      ...properties,
    };
  });

  return {
    dataSource,
    columns: Array.from(columns.values()),
  };
};
