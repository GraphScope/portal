import { Utils } from '@graphscope/studio-components';
export const transformDataToSchema = data => {
  const { nodes = [], edges = [] } = data || {};
  const _nodes = nodes.map(item => {
    return {
      id: item.name,
      type: 'graph-node',
      data: {
        label: item.name,
        ...item,
      },
      position: {
        x: 0,
        y: 0,
      },
    };
  });
  const _edges = edges.map(item => {
    return {
      id: item.name || Utils.uuid(),
      type: 'graph-edge',
      source: item.source,
      target: item.target,
      data: {
        label: item.name,
        ...item,
      },
    };
  });
  return {
    nodes: _nodes,
    edges: _edges,
  };
};
