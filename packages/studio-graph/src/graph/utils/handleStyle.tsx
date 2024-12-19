import { defaultEdgeOptionStyle, defaultEdgeStyle, defaultNodeOptionStyle, defaultNodeStyle } from '../const';
import type { NodeStyle, EdgeStyle, NodeData, EdgeData, EdgeOptionStyle, CommonStyle, NodeOptionStyle } from '../types';

export function handleNodeStyle(item: NodeData, runtimeStyle: Record<string, NodeStyle>): NodeStyle {
  const { options = {}, ...ohers } = runtimeStyle[item.id] || runtimeStyle[String(item.label)] || item.__style || {};
  return {
    ...defaultNodeStyle,
    ...ohers,
    options: {
      ...defaultNodeOptionStyle,
      ...options,
    },
  };
}
export function handleEdgeStyle(item: EdgeData, runtimeStyle: Record<string, EdgeStyle>): EdgeStyle {
  const { options = {}, ...ohers } = runtimeStyle[item.id] || runtimeStyle[String(item.label)] || item.__style || {};
  return {
    ...defaultEdgeStyle,
    ...ohers,
    options: {
      ...defaultEdgeOptionStyle,
      ...options,
    },
  };
}
