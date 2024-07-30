import { NodeObject } from 'force-graph';
import { StyleConfig } from '../hooks/typing';
import { handleStyle } from './handleStyle';
import { handleStatus } from './handleStatus';
import { HOVERING_NODE_COLOR, BASIC_NODE_R, SELECTED_NODE_COLOR, NODE_TEXT_COLOR } from './const';

export const nodeCanvasObject =
  (node: NodeObject, ctx: CanvasRenderingContext2D, globalScale: number) =>
  (nodeStyle: StyleConfig, nodeStatus: any) => {
    if (!node.x || !node.y) {
      return;
    }

    const style = handleStyle(node, nodeStyle);
    const status = handleStatus(node, nodeStatus);
    const { color, size, caption, captionStatus, icon } = style;
    const { selected, hovering } = status;
    //@ts-ignore
    const textLabel = node.properties && node.properties[caption];
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

    //text shape
    if (captionStatus !== 'hidden' && textLabel) {
      const fontSize = 12 / globalScale;
      ctx.font = `${fontSize}px Sans-Serif`;
      const textWidth = ctx.measureText(textLabel).width;
      //   const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); // some padding
      ctx.fillStyle = NODE_TEXT_COLOR;
      //@ts-ignore
      //   ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = color;
      ctx.fillText(textLabel, node.x, node.y + R + 2);
      //@ts-ignore
      //   node.__bckgDimensions = bckgDimensions; // to re-use in nodePointerAreaPaint
    }
    ctx.restore();
    return;
  };
