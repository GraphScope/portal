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
  'rgba(0,0,0,0.15)',
];

//  这里是size的ratio
export const sizes: number[] = Array.from({
  length: 10,
}).map((_item, index) => {
  return 0.5 * index + 0.1;
});
export const widths: number[] = Array.from({
  length: 10,
}).map((_item, index) => {
  return 0.4 * index + 0.1;
});

/** nodes */
export const BASIC_NODE_R = 4;
export const DEFAULT_NODE_COLOR = colors[6];
export const DEFAULT_NODE_SISE = sizes[4]; //2.1
export const SELECTED_NODE_COLOR = 'rgba(255,0,0,0.8)';
export const HOVERING_NODE_COLOR = 'rgba(255,0,0,0.3)';
export const NODE_TEXT_COLOR = 'rgba(255, 255, 255, 0.8)';

/** edges */
export const DEFAULT_EDGE_COLOR = colors[colors.length - 1];
export const DEFAULT_EDGE_WIDTH = widths[2]; //0.9
export const SELECTED_EDGE_COLOR = 'rgba(255,0,0,0.8)';
