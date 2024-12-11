export const handleStatus = (item, runtimeStatus) => {
  const { id, label, __status } = item;
  /** 用户手动指定的样式，优先级第一 */
  /** 按照label 划分群组的样式，优先级第二 */
  /** 后台数据初始化就添加的样式，优先级第三 */
  return runtimeStatus[id] || runtimeStatus[label] || __status || {};
};
