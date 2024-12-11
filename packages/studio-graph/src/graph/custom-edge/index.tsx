import { LinkObject } from 'force-graph';
import { EdgeStyle } from '../types';
import { handleStyle } from '../utils/handleStyle';
import { handleStatus } from '../utils/handleStatus';
import { HOVERING_NODE_COLOR, BASIC_NODE_R, SELECTED_NODE_COLOR, NODE_TEXT_COLOR } from '../const';

export const linkCanvasObject =
  (link: LinkObject, ctx: CanvasRenderingContext2D, globalScale: number) =>
  (edgeStyle: Record<string, EdgeStyle>, nodeStatus: any, disabled: boolean) => {
    if (disabled || globalScale < 3) {
      return;
    }

    const style = handleStyle<EdgeStyle>(link, edgeStyle, 'edge');
    const { color, size, caption, icon } = style;
    //@ts-ignore
    const label = link.properties && link.properties[caption];

    if (!caption || caption.length === 0 || !label) {
      return;
    }

    const MAX_FONT_SIZE = 2;
    const labelWidth = label.length * (MAX_FONT_SIZE / 2);
    const LABEL_NODE_MARGIN = 10; // graph.nodeRelSize() * 1.5;
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

    const maxTextLength = Math.sqrt(Math.pow(relLink.x, 2) + Math.pow(relLink.y, 2)) - LABEL_NODE_MARGIN * 2;

    let textAngle = Math.atan2(relLink.y, relLink.x);
    // maintain label vertical orientation for legibility
    if (textAngle > Math.PI / 2) textAngle = -(Math.PI - textAngle);
    if (textAngle < -Math.PI / 2) textAngle = -(-Math.PI - textAngle);

    ctx.save();
    // estimate fontSize to fit in link length
    ctx.font = '1px Sans-Serif';
    const fontSize = MAX_FONT_SIZE; //Math.min(MAX_FONT_SIZE, maxTextLength / labelWidth);
    ctx.font = `${fontSize}px Sans-Serif`;

    const bckgDimensions: [number, number] = [
      labelWidth + fontSize * 0.2, // some padding
      fontSize + fontSize * 0.2,
    ];

    // draw text label background rect
    ctx.translate(textPos.x, textPos.y);
    ctx.rotate(textAngle);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillRect(-bckgDimensions[0] / 2, -bckgDimensions[1] / 2, ...bckgDimensions);
    // draw text label
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'darkgrey';
    ctx.fillText(label, 0, 0);
    ctx.restore();
    return;
  };
