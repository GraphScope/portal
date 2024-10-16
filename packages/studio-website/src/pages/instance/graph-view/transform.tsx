import { Utils } from '@graphscope/studio-components';
export const transformDataToSchema = data => {
  const { nodes = [], edges = [] } = data || {};
  console.log('data', data);
  const _nodes = nodes.map(item => {
    return {
      type: 'graph-node',
      ...item,
    };
  });
  const _edges = edges.map(item => {
    return {
      type: 'graph-edge',
      ...item,
    };
  });
  return {
    nodes: _nodes,
    edges: _edges,
  };
};
