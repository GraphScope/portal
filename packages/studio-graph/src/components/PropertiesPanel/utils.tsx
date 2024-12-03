import type { GraphData, NodeData } from '../../index';
export const getSelectData = (data: GraphData, { nodeStatus, edgeStatus }) => {
  let type: 'node' | 'edge' = 'node';

  const selectNodes = data.nodes.filter(item => {
    const match = nodeStatus[item.id];
    if (match && match.selected) {
      return match;
    }
  });

  if (selectNodes.length !== 0) {
    return {
      type,
      data: selectNodes,
    };
  }
  const selectEdges = data.edges.filter(item => {
    const match = edgeStatus[item.id];
    if (match && match.selected) {
      return match;
    }
  });

  if (selectEdges.length !== 0) {
    type = 'edge';
    return {
      type,
      data: selectEdges,
    };
  }
  return {
    type,
    data: [],
  };
};

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
