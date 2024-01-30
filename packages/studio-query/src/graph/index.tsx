import React, { useEffect, useState } from 'react';
import Graphin, { GraphinData, Utils } from '@antv/graphin';
import Panel from './panel';
import { GlobalToken, theme } from 'antd';
const { useToken } = theme;

interface GraphViewProps {
  data: GraphinData;
  schema: any;
}

export interface ConfigItem {
  /** 类型 */
  label: string;
  /** 数量统计 */
  count?: number;
  /** 颜色 */
  color: string;
  /** 大小 */
  size: number;
  /** 文本映射字段 */
  caption: string;
}

const config = {
  nodes: [
    {
      label: 'person',
      color: '#F7A128',
      size: 40,
      caption: 'name',
    },
    {
      label: 'software',
      color: '#40C054',
      size: 60,
      caption: 'name',
    },
  ],
  edges: [
    {
      label: 'created',
      color: '#8DCADD',
      size: 1,
      caption: 'weight',
    },
  ],
};

function getConfig() {
  const configMap = new Map<string, ConfigItem>();
  config.nodes.forEach(item => {
    configMap.set(item.label, item);
  });
  config.edges.forEach(item => {
    configMap.set(item.label, item);
  });
  return configMap;
}

const GraphView: React.FunctionComponent<GraphViewProps> = props => {
  const { data, schema } = props;
  const [state, updateState] = useState(() => {
    const configMap = getConfig();
    return {
      configMap,
    };
  });

  const { configMap } = state;

  const newData = processData(data, configMap);
  const overview = calcOverview(schema, configMap, data);
  const onChange = params => {
    console.log('params', params);
    const { label } = params;
    configMap.set(label, params);
    updateState(preState => {
      return {
        ...preState,
        configMap,
      };
    });
  };
  return (
    <Graphin
      data={newData}
      layout={{ type: 'force' }}
      style={{ height: '480px', minHeight: '480px', background: '#f8fcfe' }}
    >
      {/** @ts-ignore */}
      <Panel overview={overview} onChange={onChange}></Panel>
    </Graphin>
  );
};

export default GraphView;

function calcOverview(schema, configMap: Map<string, ConfigItem>, data: GraphinData) {
  const nodekeyOccurrences = countOccurrencesByKey(data.nodes, 'label');
  const edgekeyOccurrences = countOccurrencesByKey(data.edges, 'label');
  console.log(nodekeyOccurrences, edgekeyOccurrences);
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
function countOccurrencesByKey(arr, key) {
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

function processData(data: GraphinData, configMap: Map<string, ConfigItem>) {
  const nodesMap = new Map();
  const { nodes: Nodes, edges: Edges } = data;
  const nodes = Nodes.map(item => {
    const { id, label, properties } = item;
    const match = configMap.get(label)!;
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
          fillOpacity: 1,
          fill: color,
        },
      },
    };
  });

  const edges = Edges.map(item => {
    const { id, label, source, target, properties } = item;
    const match = configMap.get(label)!;
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
