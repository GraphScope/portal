export function hexToRgba(hex, opacity) {
  // 移除十六进制颜色值中的井号（#）
  hex = hex.replace('#', '');

  // 扩展短十六进制颜色代码
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }

  // 检查扩展后的十六进制颜色值是否是完整的6位
  if (hex.length !== 6) {
    return 'transparent';
  }

  // 将十六进制颜色值转换为rgb数组
  let r = parseInt(hex.slice(0, 2), 16);
  let g = parseInt(hex.slice(2, 4), 16);
  let b = parseInt(hex.slice(4, 6), 16);

  // 返回rgba格式的颜色值
  return 'rgba(' + r + ',' + g + ',' + b + ',' + opacity + ')';
}
