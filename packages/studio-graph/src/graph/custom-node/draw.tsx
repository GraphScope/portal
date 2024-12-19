interface DrawTextOptions {
  text: string;
  x: number;
  y: number;
  maxWidth: number;
  lineHeight: number;
}

export function drawText(ctx: CanvasRenderingContext2D, options: DrawTextOptions): void {
  const { text = '', x, y, maxWidth, lineHeight } = options;
  const words = String(text).split(' ');
  let line = '';
  const lines: string[] = [];

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      lines.push(line.trim());
      line = words[n] + ' ';
    } else {
      line = testLine;
    }
  }
  lines.push(line.trim());

  const totalHeight = lines.length * lineHeight;
  const startY = y - totalHeight / 2;

  // if (totalHeight < maxWidth) {
  lines.forEach((line, index) => {
    ctx.fillText(line, x, startY + index * lineHeight);
  });
  // }
}
