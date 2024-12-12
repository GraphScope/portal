import { NodeStyle, NodeOptionStyle, NodeData } from '../types';
import { handleNodeStyle, defaultNodeStyle } from '../utils/handleStyle';
import { handleStatus } from '../utils/handleStatus';
import { HOVERING_NODE_COLOR, BASIC_NODE_R, SELECTED_NODE_COLOR, NODE_TEXT_COLOR } from '../const';
import { drawText } from './draw';
import { icons } from '../custom-icons';

export const nodeCanvasObject =
  (node: NodeData, ctx: CanvasRenderingContext2D, globalScale: number) =>
  (nodeStyle: Record<string, NodeStyle>, nodeStatus: any) => {
    if (node.x === undefined || node.y === undefined) {
      return;
    }
    const style = handleNodeStyle(node, nodeStyle);
    const status = handleStatus(node, nodeStatus);
    const { color, size, caption, icon } = style;
    const R = Math.sqrt(Math.max(0, size)) * BASIC_NODE_R + 1;

    const options = Object.assign(
      {},
      defaultNodeStyle.options,
      {
        iconSize: `${R}px`,
        textColor: color,
      },
      style.options,
    ) as NodeOptionStyle;

    const { selected, hovering } = status;
    const { zoomLevel, iconColor, iconSize, textColor, textPosition } = options;
    const texts = caption.map(c => {
      return node.properties && node.properties[c];
    });

    // draw holo shape
    if (selected || hovering) {
      ctx.beginPath();
      ctx.arc(node.x, node.y, R * 1.2, 0, 2 * Math.PI, false);
      ctx.fillStyle = SELECTED_NODE_COLOR;
      if (hovering) {
        ctx.fillStyle = HOVERING_NODE_COLOR;
      }
      ctx.fill();
    }

    // draw keyshape
    ctx.beginPath();
    ctx.arc(node.x, node.y, R, 0, 2 * Math.PI, false);
    ctx.fillStyle = color;
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
      texts,
      node,
      textColor: textColor,
      textPosition: textPosition,
      zoomLevel: zoomLevel,
    });

    ctx.restore();
    return;
  };

function drawLabel(options: {
  globalScale: number;
  ctx: CanvasRenderingContext2D;
  node: any;
  R: number;
  texts: string[];
  textPosition: NodeOptionStyle['textPosition'];
  textColor: NodeOptionStyle['textColor'];
  zoomLevel: NodeOptionStyle['zoomLevel'];
}) {
  let { globalScale, ctx, node, R, texts, textColor, textPosition, zoomLevel } = options;

  if (texts.length === 0 || globalScale < zoomLevel[0]) {
    return;
  }
  if (globalScale >= zoomLevel[1]) {
    const fontSize = 14 / globalScale;
    ctx.font = `${fontSize}px Sans-Serif`;
    ctx.fillStyle = NODE_TEXT_COLOR;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#fff';
    drawText(ctx, {
      text: texts.join(' '),
      x: node.x,
      y: node.y + fontSize / 2,
      maxWidth: R * 2 * 0.8, //预留 20% pandding
      lineHeight: fontSize * 1.2,
    });
  }
  if (globalScale >= zoomLevel[0] && globalScale < zoomLevel[1]) {
    const fontSize = 2; //14 / globalScale;
    const lineHeight = fontSize * 1.2;
    let textX = node.x;
    let textY = node.y;
    if (textPosition === 'center') {
      textX = node.x;
      textY = node.y;
      const bckgDimensions = drawTextBackground({ ctx, texts, fontSize, textX, textY });
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
  textX: number;
  textY: number;
}) {
  const { texts, fontSize, textX, textY, ctx } = options;
  const lineHeight = fontSize * 1.2;
  let textWidth = 0;
  let textHeight = lineHeight * texts.length;
  texts.forEach((text, index) => {
    textWidth = Math.max(ctx.measureText(text).width, textWidth);
  });
  const bckgDimensions = [textWidth, textHeight].map(n => n + fontSize * 0.2); // some padding
  ctx.fillStyle = NODE_TEXT_COLOR;
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
    const R = Math.sqrt(Math.max(0, size)) * BASIC_NODE_R + 1;
    ctx.arc(x, y, R, 0, 2 * Math.PI, false);
    ctx.fill();
  };
