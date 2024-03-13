let localStorage = window.localStorage;
export default {
  //设置值
  setItem(key: string, val: any) {
    try {
      if (!key) return;
      return localStorage.setItem(key, JSON.stringify(val));
    } catch (err) {}
  },
  //获取值
  getItem(key: string) {
    try {
      if (!key) return '';
      return JSON.parse(localStorage.getItem(key) || '');
    } catch (err) {
      return '';
    }
  },
  //删除对应值
  clearItem(key: string) {
    try {
      if (typeof key === 'undefined') return localStorage.clear();
      return localStorage.removeItem(key);
    } catch (err) {
      return false;
    }
  },
  //清除所有值
  clearAll() {
    localStorage.clear();
  },
};
