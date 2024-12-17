import { red, gold, lime, cyan, blue, purple, magenta, orange } from '@ant-design/colors';
import { Utils } from '@graphscope/studio-components';
export const colors: string[] = [
  blue[4],
  orange[4],

  purple[4],
  lime[4],

  magenta[4],
  cyan[4],

  gold[8],
  red[6],

  '#000',
  '#f0f0f0',

  // '#569480',
  // '#F79767',
  // '#1978fe',
  // '#C990C0',
  // '#57C7E3',
  // '#D9C8AE',
  // '#FFE081',
  // '#8DCC93',
  // '#ECB5C9',
  // '#FFC454',
  // '#DA7194',
  // '#848484',
  // '#000',
  // '#f0f0f0',
];

//  这里是 size 只是一个比率，因为还需要和内部的 BASIC_NODE_R 相乘
export const sizes: number[] = [0, 0.1, 0.5, 1, 2, 3, 4, 6, 8, 10, 20];
export const widths: number[] = [0, 0.1, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0];

/** nodes */
export const BASIC_NODE_R = 4;
export const DEFAULT_NODE_COLOR = colors[6];
export const DEFAULT_NODE_SIZE = sizes[4];

export const NODE_TEXT_COLOR = 'rgba(255, 255, 255, 0.8)';

/** edges */

export const DEFAULT_EDGE_WIDTH = widths[3]; //0.9

const { DEFAULT_EDGE_COLOR, SELECTED_EDGE_COLOR, SELECTED_NODE_COLOR, HOVERING_NODE_COLOR } = getColor();
export { DEFAULT_EDGE_COLOR, SELECTED_EDGE_COLOR, SELECTED_NODE_COLOR, HOVERING_NODE_COLOR };
/** 考虑主题 */
function getColor() {
  const isDark = Utils.storage.get('algorithm') === 'darkAlgorithm' || Utils.storage.get('theme') === 'dark';

  if (isDark) {
    return {
      SELECTED_NODE_COLOR: '#fff',
      HOVERING_NODE_COLOR: 'rgba(255,255,255,0.8)',
      DEFAULT_EDGE_COLOR: '#5e5e5e',
      SELECTED_EDGE_COLOR: '#fff',
    };
  }
  return {
    SELECTED_NODE_COLOR: '#000',
    HOVERING_NODE_COLOR: 'rgba(0,0,0,0.8)',
    DEFAULT_EDGE_COLOR: '#f0f0f0',
    SELECTED_EDGE_COLOR: '#000',
  };
}
