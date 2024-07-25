import type { ISchema, StyleConfig } from './typing';
import { useThemeContainer } from '@graphscope/studio-components';
import { Utils } from '@graphscope/studio-components';
import {
  colors,
  sizes,
  widths,
  DEFAULT_EDGE_COLOR,
  DEFAULT_NODE_COLOR,
  DEFAULT_EDGE_WIDTH,
  DEFAULT_NODE_SISE,
} from '../../graph/const';
const { storage } = Utils;
export function getStyleConfig(schema: ISchema, graphId: string) {
  const localStyle = storage.get<{ nodeStyle: StyleConfig; edgeStyle: StyleConfig }>(`GRAPH_${graphId}_STYLE`);
  if (localStyle) {
    return localStyle;
  }
  const defaultStyle = {
    nodeStyle: {},
    edgeStyle: {},
  };

  schema.nodes.forEach((item, index) => {
    const { label } = item;
    defaultStyle.nodeStyle[label] = {
      label: item.label,
      size: DEFAULT_NODE_SISE,
      color: colors[index],
      caption: Object.keys(item.properties || {})[0] || '',
      captionStatus: 'hidden',
    };
  });
  schema.edges.forEach((item, index) => {
    const { label } = item;
    defaultStyle.edgeStyle[label] = {
      label: item.label,
      size: DEFAULT_EDGE_WIDTH,
      color: DEFAULT_EDGE_COLOR,
      caption: Object.keys(item.properties || {})[0] || '',
      captionStatus: 'hidden',
    };
  });

  return defaultStyle;
}

export function getDataMap(data) {
  const dataMap = {};
  data.nodes.forEach(node => {
    const { id } = node;
    dataMap[id] = node;
  });
  data.edges.forEach(edge => {
    const { source, target, id } = edge;
    dataMap[id] = edge;
    const sourceNode = dataMap[source];
    const targetNode = dataMap[target];

    // 存储点的邻接点
    if (!sourceNode.neighbors) {
      sourceNode.neighbors = [];
    }
    if (!targetNode.neighbors) {
      targetNode.neighbors = [];
    }
    sourceNode.neighbors.push(target);
    targetNode.neighbors.push(source);
    // 存储点的连接边
    if (!sourceNode.links) {
      sourceNode.links = [];
    }
    if (!targetNode.links) {
      targetNode.links = [];
    }
    sourceNode.links.push(id);
    targetNode.links.push(id);
  });
  return dataMap;
}
