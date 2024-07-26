export const handleStatus = (item, runtimeStatus) => {
  const { id, label, __status } = item;
  /** 用户手动指定的样式，优先级第一 */
  const userStatus = runtimeStatus[id];
  if (userStatus) {
    return userStatus;
  }
  /** 按照label 划分群组的样式，优先级第二 */
  const groupStatus = runtimeStatus[label];
  if (groupStatus) {
    return groupStatus;
  }
  /** 后台数据初始化就添加的样式，优先级第三 */
  if (__status) {
    return __status;
  }
  return {};
};
