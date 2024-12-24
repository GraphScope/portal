import { red, gold, lime, cyan, blue, purple, magenta, orange } from '@ant-design/colors';
import { Utils } from '@graphscope/studio-components';
import type { NodeOptionStyle, EdgeOptionStyle, CommonStyle } from './types';
export const colors: string[] = [
  blue[4],
  orange[4],

  purple[4],
  lime[4],

  magenta[4],
  cyan[4],

  gold[8],
  red[6],

  '#f0f0f0',
  '#00000043', //'#f0f0f0',

  '#5e5e5e',
  '#000',
];

//  这里是 size 只是一个比率，因为还需要和内部的 BASIC_NODE_R 相乘
export const sizes: number[] = [0, 0.1, 0.5, 1, 2, 3, 4, 6, 8, 10, 20];
export const widths: number[] = [0, 0.1, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0];

/** nodes */
export const BASIC_NODE_R = 2;
/** edges */
export const DEFAULT_EDGE_WIDTH = widths[3]; //0.9

export const DEFAULT_NODE_COLOR = colors[0];
export const DEFAULT_NODE_SIZE = sizes[4];

export const NODE_TEXT_COLOR = 'rgba(255, 255, 255, 0.8)';

const {
  DEFAULT_EDGE_COLOR,
  SELECTED_EDGE_COLOR,
  SELECTED_EDGE_TEXT_COLOR,
  SELECTED_NODE_COLOR,
  HOVERING_NODE_COLOR,
  NODE_TEXT_BACKGROUND_COLOR,
} = getColor();
export {
  DEFAULT_EDGE_COLOR,
  SELECTED_EDGE_COLOR,
  SELECTED_EDGE_TEXT_COLOR,
  SELECTED_NODE_COLOR,
  HOVERING_NODE_COLOR,
  NODE_TEXT_BACKGROUND_COLOR,
};
/** 考虑主题 */
function getColor() {
  const isDark = Utils.storage.get('algorithm') === 'darkAlgorithm' || Utils.storage.get('theme') === 'dark';

  if (isDark) {
    return {
      DEFAULT_EDGE_COLOR: colors[10],
      SELECTED_NODE_COLOR: '#fff',
      HOVERING_NODE_COLOR: 'rgba(255,255,255,0.8)',
      SELECTED_EDGE_COLOR: '#fff',
      SELECTED_EDGE_TEXT_COLOR: '#000',
      NODE_TEXT_BACKGROUND_COLOR: 'rgba(0, 0, 0, 0.2)',
    };
  }
  return {
    SELECTED_NODE_COLOR: '#000',
    HOVERING_NODE_COLOR: 'rgba(0,0,0,0.8)',
    DEFAULT_EDGE_COLOR: colors[9],
    SELECTED_EDGE_COLOR: '#000',
    SELECTED_EDGE_TEXT_COLOR: '#fff',
    NODE_TEXT_BACKGROUND_COLOR: 'rgba(255, 255, 255, 0.8)',
  };
}

export const defaultNodeStyle: CommonStyle = {
  color: DEFAULT_NODE_COLOR,
  size: DEFAULT_NODE_SIZE,
  caption: [],
  icon: '',
};

export const defaultNodeOptionStyle: Partial<NodeOptionStyle> = {
  /** keyshape */
  selectColor: SELECTED_NODE_COLOR,
  /** icon */
  iconColor: '#fff',
  iconSize: undefined, // half size of keyshape
  /** label text */
  textSize: undefined, //根据节点半径
  textColor: undefined, // color of keyshape
  textPosition: 'bottom',
  textBackgroundColor: NODE_TEXT_BACKGROUND_COLOR,

  /** strategy */
  zoomLevel: [3, 15],
};

export const defaultEdgeStyle: CommonStyle = {
  color: DEFAULT_EDGE_COLOR,
  size: DEFAULT_EDGE_WIDTH,
  caption: [],
  icon: '',
};

export const defaultEdgeOptionStyle: Partial<EdgeOptionStyle> = {
  /** keyshape  */
  selectColor: SELECTED_EDGE_COLOR,
  /** arrow */
  arrowLength: undefined, // trible size of keyshape
  arrowPosition: 1,

  /** label  */
  textColor: undefined, //默认为边色
  textSize: undefined, // 默认为边宽的3倍
  textBackgroundColor: NODE_TEXT_BACKGROUND_COLOR,

  /** strategy */
  zoomLevel: [3, 15],
};
