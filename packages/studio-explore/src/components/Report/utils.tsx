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


export const flattenListofDict = (data) => {
  function extractKeys(obj) {
    let keys = []

    for (let key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        keys = keys.concat(extractKeys(obj[key]));
      } else {
        if (obj[key] !== null && typeof obj[key] !== 'undefined') {
          keys.push(key);
        }
      }
    }

    return keys;
  }
  function extractValues(obj) {
    let values = [];

    for (let key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        values = values.concat(extractValues(obj[key]));
      } else {
        if (obj[key] !== null && typeof obj[key] !== 'undefined') {
          values.push(obj[key]);
        }
      }
    }

    return values;
  }

  const flatten_keys = extractKeys(data[0]);
  const flatten_values = data.map(dict => extractValues(dict));

  return { flatten_keys,flatten_values }
}