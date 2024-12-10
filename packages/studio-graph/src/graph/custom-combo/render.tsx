import type { ForceGraphInstance } from 'force-graph';
import type { ICombo } from './typing';
export function renderCombo(graph: ForceGraphInstance, combos: ICombo[]) {
  if (!graph || !graph.onRenderFramePost) {
    return;
  }
  graph.onRenderFramePost((ctx, globalScale) => {
    combos.forEach(group => {
      const { r, x, y, color, cluster } = group;
      // 绘制圆形边界
      ctx.beginPath();
      ctx.setLineDash([5, 5]);
      ctx.arc(x, y, r, 0, 2 * Math.PI, false);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.stroke();
      const fontSize = 10;

      // 设置文本
      const text = cluster;
      const textX = x; // 文本的 x 坐标（与圆心 x 坐标对齐）
      const textY = y - r - 8; // 文本的 y 坐标（在圆的上方）

      const w = Math.max(fontSize * String(text).length * 0.6, 50);
      const h = fontSize;
      ctx.strokeRect(textX - w / 2, textY - h / 2, w, h);

      ctx.font = `${fontSize}px Arial`;
      ctx.fillStyle = color;
      ctx.textAlign = 'center';
      ctx.fillText(text, textX, textY);
    });
  });
}
