import type { GraphSchema, NodeStyle, EdgeStyle } from '../types';
import { Utils } from '@graphscope/studio-components';
import {
  colors,
  sizes,
  widths,
  DEFAULT_EDGE_COLOR,
  DEFAULT_NODE_COLOR,
  DEFAULT_EDGE_WIDTH,
  DEFAULT_NODE_SIZE,
} from '../const';
const { storage } = Utils;
export function getStyleConfig(schema: GraphSchema, graphId: string) {
  const localStyle = storage.get<{ nodeStyle: NodeStyle; edgeStyle: EdgeStyle }>(`GRAPH_${graphId}_STYLE`);
  if (localStyle) {
    return localStyle;
  }
  const defaultStyle = {
    nodeStyle: {},
    edgeStyle: {},
  };

  schema.nodes.forEach((item, index) => {
    const { label } = item;
    let caption: string[] = [];
    item.properties.forEach(p => {
      const { name } = p;
      if (name === 'name') {
        caption = ['name'];
      }
      if (name === 'title') {
        caption = ['title'];
      }
    });
    defaultStyle.nodeStyle[label] = {
      label: item.label,
      size: DEFAULT_NODE_SIZE,
      color: colors[index],
      caption,
      captionStatus: 'display',
    };
  });
  schema.edges.forEach((item, index) => {
    const { label } = item;
    let caption: string[] = [];
    item.properties.forEach(p => {
      const { name } = p;
      if (name === 'name') {
        caption = ['name'];
      }
      if (name === 'title') {
        caption = ['title'];
      }
    });

    defaultStyle.edgeStyle[label] = {
      label: item.label,
      size: DEFAULT_EDGE_WIDTH,
      color: DEFAULT_EDGE_COLOR,
      caption,
      captionStatus: 'display',
    };
  });

  return defaultStyle;
}
