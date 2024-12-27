import { EdgeStyle, EdgeData, EdgeOptionStyle } from '../types';
import { handleEdgeStyle } from '../utils/handleStyle';
import {
  HOVERING_NODE_COLOR,
  BASIC_NODE_R,
  SELECTED_NODE_COLOR,
  NODE_TEXT_COLOR,
  DEFAULT_EDGE_COLOR,
  DEFAULT_EDGE_WIDTH,
} from '../const';
import { handleStatus } from '../utils';

export const linkCanvasObject =
  (link: EdgeData, ctx: CanvasRenderingContext2D, globalScale: number) =>
  (edgeStyle: Record<string, EdgeStyle>, edgeStatus: any) => {
    const style = handleEdgeStyle(link, edgeStyle);
    const { selected } = handleStatus(link, edgeStatus);
    const { color, size, caption = [], options } = style;
    const {
      textColor = color,
      textSize = size * 1.5,
      textBackgroundColor,
      selectColor,
      zoomLevel,
    } = options as EdgeOptionStyle;

    if (globalScale < zoomLevel[0]) {
      return;
    }

    const label = caption
      .map(c => {
        return link.properties && link.properties[c];
      })
      .join(' ');

    if (!caption || caption.length === 0 || !label) {
      return;
    }

    const labelWidth = ctx.measureText(label).width * textSize * 0.6;

    const start = link.source;
    const end = link.target;
    // ignore unbound links
    if (typeof start !== 'object' || typeof end !== 'object') {
      return;
    }
    if (start.x === undefined || start.y === undefined || end.x === undefined || end.y === undefined) {
      return;
    }

    // Calculate label positioning
    const textPos = {
      x: start.x + (end.x - start.x) / 2, // calc middle point
      y: start.y + (end.y - start.y) / 2, // calc middle point
    };

    const relLink = { x: end.x - start.x, y: end.y - start.y };

    // const maxTextLength = Math.sqrt(Math.pow(relLink.x, 2) + Math.pow(relLink.y, 2)) - LABEL_NODE_MARGIN * 2;

    let textAngle = Math.atan2(relLink.y, relLink.x);
    // maintain label vertical orientation for legibility
    if (textAngle > Math.PI / 2) textAngle = -(Math.PI - textAngle);
    if (textAngle < -Math.PI / 2) textAngle = -(-Math.PI - textAngle);

    ctx.save();
    // estimate fontSize to fit in link length
    ctx.font = '1px Sans-Serif';

    ctx.font = `${textSize}px Sans-Serif`;

    const bckgDimensions: [number, number] = [
      labelWidth + textSize * 0.8, // some padding
      textSize + textSize * 0.4,
    ];

    // draw text label background rect
    ctx.translate(textPos.x, textPos.y);
    ctx.rotate(textAngle);

    ctx.fillStyle = selected ? selectColor : textBackgroundColor;
    ctx.fillRect(-bckgDimensions[0] / 2, -bckgDimensions[1] / 2, ...bckgDimensions);
    // draw text label
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = textColor;
    ctx.fillText(label, 0, 0);
    ctx.restore();
    return;
  };
