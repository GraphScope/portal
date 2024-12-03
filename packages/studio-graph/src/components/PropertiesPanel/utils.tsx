import type { GraphData } from '../../index';
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

const getDataByProperties = properties => {
  const columns: any[] = [
    {
      title: 'name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'value',
      dataIndex: 'value',
      key: 'value',
    },
  ];
  const dataSource = Object.entries(properties).map(item => {
    const [key, value] = item;
    return {
      key,
      name: key,
      value: value,
    };
  });

  return {
    dataSource,
    columns,
  };
};
