import { DEFAULT_EDGE_COLOR, DEFAULT_NODE_COLOR, DEFAULT_NODE_SIZE, DEFAULT_EDGE_WIDTH } from '../const';
import type { NodeStyle, EdgeStyle } from '../types';
export const defaultEdgeStyle = {
  color: DEFAULT_EDGE_COLOR,
  size: DEFAULT_EDGE_WIDTH,
  caption: [],
  icon: '',
  options: {
    arrowLength: 10,
    arrowPosition: 0.9,
  },
};
export const defaultNodeStyle = {
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
export const getNodeStyle = (node: NodeStyle) => {};
export function handleStyle<T>(item, runtimeStyle: Record<string, T>, type?: 'node' | 'edge'): T {
  const { id, label, __style } = item;
  let _style = runtimeStyle[id] || runtimeStyle[label] || __style;
  if (_style) {
    return _style;
  }
  if (type === 'edge') {
    return defaultEdgeStyle as T;
  }
  return defaultNodeStyle as T;
}
