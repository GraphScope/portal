export function isPointInRectangle(point, rect) {
  const { x: px, y: py } = point;
  const { x, y, w, h } = rect;
  // 检查点是否在长方形的x和y范围内
  return px >= x && px <= x + w && py >= y && py <= y + h;
}
export function getComboTextRect(combo) {
  const { x: gx, y: gy, r: gr, cluster: text } = combo;
  const fontSize = 10;
  const textX = gx; // 文本的 x 坐标（与圆心 x 坐标对齐）
  const textY = gy - gr - 8; // 文本的 y 坐标（在圆的上方）
  const w = Math.max(fontSize * String(text).length * 0.6, 50);

  const h = fontSize;
  return { x: textX - w / 2, y: textY - h / 2, w, h };
}

export function getOffset(el: Element) {
  const rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
}
