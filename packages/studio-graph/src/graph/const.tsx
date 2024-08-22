export const colors: string[] = [
  '#569480',
  '#1978fe',
  '#FFE081',
  '#C990C0',
  '#F79767',
  '#57C7E3',
  '#D9C8AE',
  '#8DCC93',
  '#ECB5C9',
  '#FFC454',
  '#DA7194',
  '#848484',
  '#000',
  '#f0f0f0',
];

//  这里是 size 只是一个比率，因为还需要和内部的 BASIC_NODE_R 相乘
export const sizes: number[] = [0, 0.1, 0.5, 1, 2, 3, 4, 6, 8, 10, 20];
export const widths: number[] = [0, 0.1, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0];

/** nodes */
export const BASIC_NODE_R = 2;
export const DEFAULT_NODE_COLOR = colors[6];
export const DEFAULT_NODE_SIZE = sizes[4];
export const SELECTED_NODE_COLOR = 'rgba(255,0,0,0.8)';
export const HOVERING_NODE_COLOR = 'rgba(255,0,0,0.3)';
export const NODE_TEXT_COLOR = 'rgba(255, 255, 255, 0.8)';

/** edges */
export const DEFAULT_EDGE_COLOR = '#f0f0f0'; // colors[colors.length - 1];
export const DEFAULT_EDGE_WIDTH = widths[3]; //0.9
export const SELECTED_EDGE_COLOR = 'rgba(255,0,0,0.8)';
