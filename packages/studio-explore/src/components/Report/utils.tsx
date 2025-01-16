/**
 *
 * @param schema partical graph schema
 * @param data graph data
 */
export const filterDataByParticalSchema = (schema, data) => {
  const node_labels = schema.nodes.map(item => {
    return item.label;
  });
  const edge_labels = schema.edges.map(item => {
    return item.label;
  });

  const nodes = data.nodes
    .filter(node => {
      const { label } = node;
      return node_labels.includes(label || '');
    })
    .map(item => {
      const { id, label, properties = {} } = item;
      const match = schema.nodes.find(node => node.label === label) || { properties: [] };
      return {
        id,
        label,
        properties: (match.properties || []).reduce((acc, curr) => {
          return {
            ...acc,
            [curr.name]: properties[curr.name],
          };
        }, {}),
      };
    });
  const edges = data.edges
    .filter(item => {
      const { label } = item;
      return edge_labels.includes(label || '');
    })
    .map(item => {
      const { id, label, properties = {} } = item;
      const match = schema.edges.find(c => c.label === label) || { properties: [] };
      return {
        id,
        label,
        properties: (match.properties || []).reduce((acc, curr) => {
          return {
            ...acc,
            [curr.name]: properties[curr.name],
          };
        }, {}),
      };
    });
  return { nodes, edges };
};
