import { DEFAULT_EDGE_COLOR, DEFAULT_NODE_COLOR, DEFAULT_NODE_SIZE, DEFAULT_EDGE_WIDTH } from '../const';
import type { NodeStyle, EdgeStyle, NodeData, EdgeData } from '../types';

export const defaultEdgeStyle: EdgeStyle = {
  color: DEFAULT_EDGE_COLOR,
  size: DEFAULT_EDGE_WIDTH,
  caption: [],
  icon: '',
  options: {},
};
export const defaultNodeStyle: NodeStyle = {
  color: DEFAULT_NODE_COLOR,
  size: DEFAULT_NODE_SIZE,
  caption: [],
  icon: '',
  options: {
    textPosition: 'bottom',
    iconColor: '#fff',
    zoomLevel: [3, 15],
  },
};

export function handleNodeStyle(item: NodeData, runtimeStyle: Record<string, NodeStyle>): NodeStyle {
  const _style = runtimeStyle[item.id] || runtimeStyle[String(item.label)] || item.__style;
  return _style ? _style : defaultNodeStyle;
}
export function handleEdgeStyle(item: EdgeData, runtimeStyle: Record<string, EdgeStyle>): EdgeStyle {
  const _style = runtimeStyle[item.id] || runtimeStyle[String(item.label)] || item.__style;
  return _style ? _style : defaultEdgeStyle;
}
