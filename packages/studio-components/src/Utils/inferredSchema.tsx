/**
 * 递归提取属性
 * @param {object} data - 要提取属性的对象
 * @param {string} [prefix] - 用于嵌套对象属性的前缀
 * @returns {Array} - 提取后的属性数组
 */
export const extractProperties = (data, prefix = '') => {
  const properties: { name: string; type: string }[] = [];
  for (const key in data) {
    if (!data.hasOwnProperty(key)) continue;
    const value = data[key];
    const prefixedKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      properties.push(...extractProperties(value, prefixedKey));
    } else {
      properties.push({ name: prefixedKey, type: getType(value) });
    }
  }
  return properties;
};
/**
 * 获取值的类型
 * @param {any} value - 要获取类型的值
 * @returns {string} - 值的类型
 */
export const getType = value => {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  if (value instanceof Date) return 'date';
  if (!isNaN(value) && typeof value !== 'boolean') return 'number';
  if (typeof value === 'string' && isValidDate(value)) return 'date';
  return typeof value;
};
/**
 * 检查字符串是否为有效日期
 * @param {string} dateStr - 要检查的字符串
 * @returns {boolean} - 是否为有效日期
 */
export const isValidDate = dateStr => {
  const date = Date.parse(dateStr);
  return !isNaN(date) && new Date(dateStr).toISOString() === dateStr;
};
