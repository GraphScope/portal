/**
 *
 * @param schema partical graph schema
 * @param data graph data
 */
export const filterDataByParticalSchema = (schema, data) => {
  const node_labels = schema.nodes.map(item => {
    return item.label;
  });
  console.log('node_labels', node_labels);
  const edge_labels = schema.edges.map(item => {
    return item.label;
  });
  console.log('edge_labels', edge_labels);

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
      const { id, label, properties = {}, source, target } = item;
      const match = schema.edges.find(c => c.label === label) || { properties: [] };
      return {
        id,
        label,
        source,
        target,
        properties: (match.properties || []).reduce((acc, curr) => {
          return {
            ...acc,
            [curr.name]: properties[curr.name],
          };
        }, {}),
      };
    });
  console.log(nodes, edges);
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
};

export const getStrSizeInKB = str => {
  const byteLength = new TextEncoder().encode(str).length;
  const sizeInKB = byteLength / 1024;

  return sizeInKB;
};

export const sampleHalf = array => {
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
};

export const getCategories = (output, categories) => {
  const category_children_map = {};
  for (const key in output) {
    const value = output[key];
    if (!category_children_map[value]) {
      category_children_map[value] = [key];
    } else {
      category_children_map[value].push(key);
    }
  }
  return categories.map(category => {
    return {
      ...category,
      children: category_children_map[category.category_id],
    };
  });
};

export const getInducedSubgraph = (nodes, edges, target_nodes) => {
  const filter_edges = edges.filter(edge => {
    return edge.source in target_nodes || edge.target in target_nodes;
  });
  console.log(filter_edges);
  const connectedNodeIds = new Set();
  filter_edges.forEach(edge => {
    connectedNodeIds.add(edge.source.id);
    connectedNodeIds.add(edge.target.id);
  });
  const filtered_nodes = nodes.filter(node => connectedNodeIds.has(node.id));

  return { filtered_nodes, filter_edges };
}

import { Utils } from '@graphscope/studio-components';
export const getPrompt = obj => {
  const locale = (Utils.storage.get('locale') as string) || 'en-US';
  return obj[locale];
};
