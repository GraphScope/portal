import type { ForceGraphInstance } from 'force-graph';
import type { ComboData } from '../types';

export function renderCombo(graph: ForceGraphInstance, combos: ComboData[]) {
  if (!graph || !graph.onRenderFramePost) {
    return;
  }
  graph.onRenderFramePost(ctx => {
    combos.forEach(combo => {
      //@ts-ignore
      const { x = 0, y = 0, r = 0, color = '#000', type = 'circle', label } = combo;
      if (type === 'circle') {
        const text = label;
        // 绘制圆形边界
        ctx.beginPath();
        ctx.setLineDash([5, 5]);
        ctx.arc(x, y, r, 0, 2 * Math.PI, false);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.stroke();
        const fontSize = 10;

        // 设置文本
        // const text = cluster;
        const textX = x; // 文本的 x 坐标（与圆心 x 坐标对齐）
        const textY = y - r - 8; // 文本的 y 坐标（在圆的上方）

        // const w = Math.max(fontSize * String(text).length * 0.6, 50);
        // const h = fontSize;
        // ctx.strokeRect(textX - w / 2, textY - h / 2, w, h);

        ctx.font = `${fontSize}px Arial`;
        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        ctx.fillText(text, textX, textY);
      }
    });
  });
}
