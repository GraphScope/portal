import { NodeObject } from 'force-graph';
import { StyleConfig } from '../../hooks/typing';
import { handleStyle } from '../handleStyle';
import { handleStatus } from '../handleStatus';
import { HOVERING_NODE_COLOR, BASIC_NODE_R, SELECTED_NODE_COLOR, NODE_TEXT_COLOR } from '../const';
import { drawText } from './draw';
export const nodeCanvasObject =
  (node: NodeObject, ctx: CanvasRenderingContext2D, globalScale: number) =>
  (nodeStyle: StyleConfig, nodeStatus: any) => {
    if (node.x === undefined || node.y === undefined) {
      return;
    }

    const style = handleStyle(node, nodeStyle);
    const status = handleStatus(node, nodeStatus);
    const { color, size, caption, captionStatus, icon } = style;

    const { selected, hovering } = status;

    const texts = caption.map(c => {
      //@ts-ignore
      return node.properties && node.properties[c];
    });

    //@ts-ignore
    // console.log('caption', caption, textLabel, node.properties);

    const R = Math.sqrt(Math.max(0, size)) * BASIC_NODE_R + 1;

    // halo shape
    if (selected || hovering) {
      //add ring just for highlighted nodes

      ctx.beginPath();
      ctx.arc(node.x, node.y, R * 1.2, 0, 2 * Math.PI, false);
      ctx.fillStyle = SELECTED_NODE_COLOR;
      if (hovering) {
        ctx.fillStyle = HOVERING_NODE_COLOR;
      }
      ctx.fill();
    }

    // circle keyshape
    ctx.beginPath();
    ctx.arc(node.x, node.y, R, 0, 2 * Math.PI, false);
    ctx.fillStyle = color;
    ctx.fill();

    // icon shape

    if (icon) {
      //@TODO
    }

    // if (captionStatus === 'display' && textLabel) {
    //   const fontSize = Math.min(0.5 * globalScale, 14 / globalScale);
    //   if (globalScale > 3 && globalScale < 15) {
    //     ctx.font = `${fontSize}px Sans-Serif`;
    //     const textWidth = ctx.measureText(textLabel).width;
    //     const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); // some padding
    //     ctx.fillStyle = NODE_TEXT_COLOR;
    //     //@ts-ignore
    //     ctx.fillRect(node.x - bckgDimensions[0] / 2, 1.2 * R + node.y - bckgDimensions[1] / 2, ...bckgDimensions);
    //     ctx.textAlign = 'center';
    //     ctx.textBaseline = 'middle';
    //     ctx.fillStyle = color;
    //     ctx.fillText(textLabel, node.x, node.y + 1.2 * R);
    //     // @ts-ignore
    //     node.__bckgDimensions = bckgDimensions; // to re-use in nodePointerAreaPaint
    //   }
    //   if (globalScale >= 15) {
    //     const fontSize = 16 / globalScale;
    //     ctx.font = `${fontSize}px Sans-Serif`;
    //     ctx.fillStyle = NODE_TEXT_COLOR;
    //     ctx.textAlign = 'center';
    //     ctx.textBaseline = 'middle';
    //     ctx.fillStyle = '#fff';
    //     drawText(ctx, {
    //       text: textLabel,
    //       x: node.x,
    //       y: node.y + fontSize / 2,
    //       maxWidth: R * 2 * 0.8, //预留 20% pandding
    //       lineHeight: fontSize * 1.2,
    //     });
    //   }
    // }

    if (captionStatus === 'display' && texts.length > 0) {
      if (globalScale > 2) {
        const fontSize = 2; //14 / globalScale;
        ctx.font = `${fontSize}px Sans-Serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = color;
        const lineHeight = fontSize * 1.2;
        texts.forEach((line, index) => {
          ctx.fillText(line, node.x || 0, (node.y || 0) + R + (0.5 + index) * lineHeight);
        });
      }
    }
    ctx.restore();
    return;
  };
