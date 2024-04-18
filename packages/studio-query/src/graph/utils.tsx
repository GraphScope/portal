import { GraphinData, Utils } from '@antv/graphin';
import { sizes, widths, colors } from '../properties-panel';
import type { ISchema, ConfigItem } from './typing';
export const storage = {
  get<T>(key: string): T | undefined {
    try {
      const values = localStorage.getItem(key);
      if (values) {
        return JSON.parse(values);
      }
    } catch (error) {
      console.error('Error while retrieving data from localStorage:', error);
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value, null, 2));
    } catch (error) {
      console.error('Error while storing data in localStorage:', error);
    }
  },
};

export function getConfig(schema: ISchema, id: string) {
  const localConfig = storage.get<ConfigItem[]>(id) || [];
  const config = localConfig.length ? localConfig : [...generateDefaultConfig(schema)];

  const configMap = config.reduce((map, item) => {
    map.set(item.label, item);
    return map;
  }, new Map<string, ConfigItem>());

  return configMap;
}

function generateDefaultConfig(schema: ISchema) {
  return [
    ...schema.nodes.map((item, index) => ({
      label: item.label,
      size: sizes[5],
      color: colors[index],
      caption: Object.keys(item.properties || {})[0] || 'id',
    })),
    ...schema.edges.map((item, index) => ({
      label: item.label,
      size: widths[1],
      color: colors[index],
      caption: Object.keys(item.properties || {})[0] || 'id',
    })),
  ];
}

export function calcOverview(schema, configMap: Map<string, ConfigItem>, data: GraphinData) {
  const nodekeyOccurrences = countOccurrencesByKey(data.nodes, 'label');
  const edgekeyOccurrences = countOccurrencesByKey(data.edges, 'label');

  const nodes = schema.nodes.map(item => {
    const { label } = item;
    const configItem = configMap.get(label);
    const count = nodekeyOccurrences[label] || 0;
    return {
      ...item,
      ...configItem,
      count,
    };
  });
  const edges = schema.edges.map(item => {
    const { label } = item;
    const configItem = configMap.get(label);
    const count = edgekeyOccurrences[label] || 0;
    return {
      ...item,
      ...configItem,
      count,
    };
  });
  return {
    count: {
      nodes: data.nodes.length,
      edges: data.edges.length,
    },
    schema: {
      nodes,
      edges,
    },
  };
}

/**
 * 根据指定的键值，统计数组中每个键值的出现次数，并返回包含统计结果的对象。
 *
 * @param {Array} arr - 要统计的数组。
 * @param {string} key - 用于统计的键值。
 * @returns {Object} 包含键值出现次数的对象。
 */
export function countOccurrencesByKey(arr, key) {
  return arr.reduce((acc, curr) => {
    const label = curr[key];
    const item = acc[label];
    if (item) {
      acc[label] = item + 1;
    } else {
      acc[label] = 1;
    }
    return acc;
  }, {});
}

export function processData(data: GraphinData, configMap: Map<string, ConfigItem>) {
  const nodesMap = new Map();
  const { nodes: Nodes, edges: Edges } = data;
  const nodes = Nodes.map(item => {
    const { id, label, properties } = item;
    const match = configMap.get(label) || {
      color: colors[1],
      size: sizes[1],
      caption: 'id',
    };
    const { color, size, caption } = match;
    const displayLabel = (properties && properties[caption]) || id;
    nodesMap.set(id, item);
    return {
      id: id,
      label,
      properties,
      style: {
        label: {
          value: displayLabel,
        },
        fontSize: 14,
        keyshape: {
          size: size,
          stroke: color,
          fillOpacity: 0.6,
          fill: color,
          lineWidth: 2,
        },
      },
    };
  });

  const edges = Edges.map(item => {
    const { id, label, source, target, properties } = item;
    const match = configMap.get(label) || {
      color: colors[1],
      size: widths[1],
      caption: 'id',
    };
    const { color, size, caption } = match;
    const displayLabel = (properties && properties[caption]) || id;
    return {
      id: id,
      source,
      target,
      label,
      properties,
      style: {
        keyshape: {
          stroke: color,
          lineWidth: size,
        },
        label: {
          value: displayLabel,
          fill: color,
          offset: [0, 0],
        },
      },
    };
  }).filter(item => {
    const { source, target } = item;
    if (nodesMap.get(source) && nodesMap.get(target)) {
      return true;
    }
    return false;
  });
  // //@ts-ignore
  const processEdges = Utils.processEdges(edges, { poly: 30, loop: 20 });
  /** TODO：这个地方是Graphin的BUG，一旦走了processEdge，Offset应该不做改变 */
  processEdges.forEach(item => {
    if (item.style?.label) {
      item.style.label.offset = [0, 0];
    }
  });

  return { nodes, edges: processEdges };
}
