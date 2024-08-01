import { DEFAULT_EDGE_COLOR, DEFAULT_NODE_COLOR, DEFAULT_NODE_SIZE, DEFAULT_EDGE_WIDTH } from './const';

const defaultEdgeStyle = {
  color: DEFAULT_EDGE_COLOR,
  size: DEFAULT_EDGE_WIDTH,
};
const defaultNodeStyle = {
  color: DEFAULT_NODE_COLOR,
  size: DEFAULT_NODE_SIZE,
};

export const handleStyle = (item, runtimeStyle, type?: 'node' | 'edge') => {
  const { id, label, __style } = item;
  let _style = runtimeStyle[id] || runtimeStyle[label] || __style;
  if (_style) {
    return _style;
  }
  if (type === 'edge') {
    return defaultEdgeStyle;
  }
  return defaultNodeStyle;
};
