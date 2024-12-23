import { NodeStyle, NodeOptionStyle, NodeData } from '../types';
import { handleNodeStyle } from '../utils/handleStyle';
import { handleStatus, hexToRgba } from '../utils';
import { BASIC_NODE_R } from '../const';
import { drawText } from './draw';
import { icons } from '../custom-icons';

export const nodeCanvasObject =
  (node: NodeData, ctx: CanvasRenderingContext2D, globalScale: number) =>
  (nodeStyle: Record<string, NodeStyle>, nodeStatus: any) => {
    if (node.x === undefined || node.y === undefined) {
      return;
    }

    const { color, size, caption, icon, options } = handleNodeStyle(node, nodeStyle);
    const status = handleStatus(node, nodeStatus);
    const R = Math.sqrt(Math.max(0, size)) * BASIC_NODE_R;
    const { selected, hovering } = status;
    const {
      zoomLevel,
      iconColor,
      iconSize = `${R}px`,

      textColor = color,
      textPosition,
      textBackgroundColor,
      textSize = R * 0.5,
      selectColor,
    } = options as NodeOptionStyle;
    const texts = caption.map(c => {
      return node.properties && node.properties[c];
    });

    // draw holo shape
    if (selected || hovering) {
      ctx.beginPath();
      ctx.arc(node.x, node.y, R * 1.2, 0, 2 * Math.PI, false);
      if (selected) {
        ctx.fillStyle = selectColor;
        // ctx.lineWidth = R * 0.2;
        // ctx.strokeStyle = SELECTED_NODE_COLOR;
        ctx.fill();
        // ctx.stroke();
      }

      if (hovering) {
        ctx.fillStyle = hexToRgba(color, 0.5);
        ctx.fill();
      }
    }

    // draw keyshape
    ctx.beginPath();
    ctx.arc(node.x, node.y, R, 0, 2 * Math.PI, false);
    ctx.fillStyle = color; //hexToRgba(color, 0.2);
    ctx.fill();

    // draw icon
    if (icon && icon !== '' && globalScale > zoomLevel[0] && globalScale < zoomLevel[1]) {
      const unicodeIcon = icons[icon] || '';
      // 绘制图标
      ctx.font = `${iconSize} iconfont`;
      ctx.textAlign = 'center'; // 水平居中对齐
      ctx.textBaseline = 'middle'; // 垂直居中对齐
      ctx.fillStyle = iconColor; // 图标颜色
      ctx.fillText(unicodeIcon, node.x, node.y);
    }

    // draw label
    drawLabel({
      globalScale,
      ctx,
      R,
      textSize,
      texts,
      node,
      textColor,
      textPosition,
      zoomLevel,
      textBackgroundColor,
    });

    ctx.restore();
    return;
  };

function drawLabel(options: {
  globalScale: number;
  ctx: CanvasRenderingContext2D;
  node: any;
  R: number;
  textSize: number;
  texts: string[];
  textPosition: NodeOptionStyle['textPosition'];
  textColor: NodeOptionStyle['textColor'];
  zoomLevel: NodeOptionStyle['zoomLevel'];
  textBackgroundColor: NodeOptionStyle['textBackgroundColor'];
}) {
  let { globalScale, ctx, node, R, texts, textColor, textPosition, zoomLevel, textBackgroundColor, textSize } = options;

  if (texts.length === 0 || globalScale < zoomLevel[0]) {
    return;
  }
  if (globalScale >= zoomLevel[1]) {
    const fontSize = 16 / globalScale;
    ctx.font = `${fontSize}px Sans-Serif`;
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    drawText(ctx, {
      text: texts.join(' '),
      x: node.x,
      y: node.y + fontSize / 2,
      maxWidth: R * 2 * 0.8, //预留 20% pandding
      lineHeight: fontSize * 1.2,
    });
  }
  if (globalScale >= zoomLevel[0] && globalScale < zoomLevel[1]) {
    const fontSize = textSize;
    const lineHeight = fontSize * 1.2;
    let textX = node.x;
    let textY = node.y;
    if (textPosition === 'center') {
      textX = node.x;
      textY = node.y;
      const bckgDimensions = drawTextBackground({ ctx, texts, fontSize, textX, textY, textBackgroundColor });
      // @ts-ignore
      node.__bckgDimensions = bckgDimensions; // to re-use in nodePointerAreaPaint
    } else if (textPosition === 'top') {
      textX = node.x;
      textY = node.y - R - lineHeight / 2;
    } else if (textPosition === 'bottom') {
      textX = node.x;
      textY = node.y + R + lineHeight / 2;
    } else if (textPosition === 'left') {
      textX = node.x - R - lineHeight / 2;
    } else if (textPosition === 'right') {
      textX = node.x + R + lineHeight / 2;
    }

    ctx.font = `${fontSize}px Sans-Serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = textColor;
    texts.forEach((line, index) => {
      ctx.fillText(line, textX, textY + index * lineHeight);
    });
  }
}
function drawTextBackground(options: {
  ctx: CanvasRenderingContext2D;
  texts: string[];
  fontSize: number;
  textBackgroundColor: string;
  textX: number;
  textY: number;
}) {
  const { texts, fontSize, textX, textY, ctx, textBackgroundColor } = options;
  const lineHeight = fontSize * 1.2;
  let textWidth = 0;
  let textHeight = lineHeight * texts.length;
  texts.forEach((text, index) => {
    textWidth = Math.max(ctx.measureText(text).width, textWidth);
  });
  const bckgDimensions = [textWidth, textHeight].map(n => n + fontSize * 0.2); // some padding
  ctx.fillStyle = textBackgroundColor;
  //@ts-ignore
  ctx.fillRect(textX - bckgDimensions[0] / 2, textY - bckgDimensions[1] / 2, ...bckgDimensions);

  return bckgDimensions;
}

export const nodePointerAreaPaint =
  (node: NodeData, color: string, ctx: CanvasRenderingContext2D, globalScale: number) =>
  (nodeStyle: Record<string, NodeStyle>) => {
    if (node.x === undefined || node.y === undefined) {
      return;
    }
    ctx.fillStyle = color;
    const { x, y } = node;
    const { size } = handleNodeStyle(node, nodeStyle);
    ctx.beginPath();
    const R = Math.sqrt(Math.max(0, size)) * BASIC_NODE_R;
    ctx.arc(x, y, R, 0, 2 * Math.PI, false);
    ctx.fill();
  };
