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


export const getAllAttributesByName = (data, attrName) => {
  function extractAttr(obj, attrName) {
    for (let key in obj) {
      if (key === attrName && obj[key] !== null && typeof obj[key] !== 'undefined') {
        return obj[key];
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        const id = extractAttr(obj[key], attrName);
        if (id !== null) {
          return id;
        }
      }
    }
    return null; // 如果什么都没找到，返回 null
  }

  const all_attrs = data.map(dict => extractAttr(dict, attrName));
  return all_attrs;
}


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

export const getStrSizeInKB = (str) => {
  const byteLength = new TextEncoder().encode(str).length;
  const sizeInKB = byteLength / 1024;

  return sizeInKB;
}

export const sampleHalf = (array) => {
  const halfLength = Math.floor(array.length / 2);

  // 克隆数组以避免修改原数组
  const shuffled = array.slice();

  // Fisher-Yates 洗牌算法
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // 返回洗牌后的前半部分元素
  return shuffled.slice(0, halfLength);
}