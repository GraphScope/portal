import { DEFAULT_EDGE_COLOR, DEFAULT_NODE_COLOR, DEFAULT_NODE_SISE, DEFAULT_EDGE_WIDTH } from './const';
export const handleStyle = (item, runtimeStyle, type?: 'node' | 'edge') => {
  const { id, label, __style } = item;
  /** 运行时状态，用户手动指定的样式，优先级第一 */
  const userStyle = runtimeStyle[id];
  if (userStyle) {
    return userStyle;
  }
  /** 运行时状态，按照 label 划分群组的样式，优先级第二 */
  const groupStyle = runtimeStyle[label];
  if (groupStyle) {
    return groupStyle;
  }
  /** 后台数据初始化就添加的样式，优先级第三 */
  if (__style) {
    return __style;
  }
  if (type === 'edge') {
    return {
      color: DEFAULT_EDGE_COLOR,
      size: DEFAULT_EDGE_WIDTH,
    };
  }
  return {
    color: DEFAULT_NODE_COLOR,
    size: DEFAULT_NODE_SISE,
  };
};
