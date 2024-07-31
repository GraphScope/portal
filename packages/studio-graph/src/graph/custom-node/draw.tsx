interface DrawTextOptions {
  text: string;
  x: number;
  y: number;
  maxWidth: number;
  lineHeight: number;
}

export function drawText(ctx: CanvasRenderingContext2D, options: DrawTextOptions): void {
  const { text, x, y, maxWidth, lineHeight } = options;
  const words = text.split(' ');
  let line = '';
  const lines: string[] = [];

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;

    if (testWidth > maxWidth && n > 0) {
      lines.push(line.trim());
      line = words[n] + ' ';
    } else {
      line = testLine;
    }
  }
  lines.push(line.trim());

  const totalHeight = lines.length * lineHeight;
  let startY = y - totalHeight / 2;
  lines.forEach((line, index) => {
    const textWidth = ctx.measureText(line).width;
    const startX = x - textWidth / 2;
    ctx.fillText(line, startX, startY + index * lineHeight);
  });
}
