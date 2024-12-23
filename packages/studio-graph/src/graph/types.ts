import type { ForceGraphInstance, NodeObject, LinkObject } from 'force-graph';
import type { ForceGraph3DInstance } from '3d-force-graph';
import type { Emitter as EEmitter } from 'mitt';
export type { NodeObject, LinkObject };

export type EventType =
  | 'node:click'
  | 'node:contextmenu'
  | 'node:hover'
  | 'canvas:click'
  | 'edge:click'
  | 'combo:click';

export type Emitter = EEmitter<Record<EventType, unknown>>;
export type Graph = ForceGraphInstance | ForceGraph3DInstance;

export interface NodeData extends NodeObject {
  id: string;
  label?: string;
  properties?: {
    [key: string]: any;
  };
  __style?: NodeStyle;
  __status?: NodeStatus;
}

export interface EdgeData {
  id: string;
  source: string | NodeData;
  target: string | NodeData;
  label?: string;
  __style?: NodeStyle;
  __status?: NodeStatus;
  properties?: {
    [key: string]: any;
  };
}

export interface ComboData {
  id: string;
  label: string;
  children: string[];
  x?: number;
  y?: number;
  r?: number;
  color?: string;
  shape?: 'circle' | 'rect';
}

export interface GraphData {
  nodes: NodeData[];
  edges: EdgeData[];
}

export type LayoutType = 'force' | 'force-combo' | 'force-dagre' | 'dagre' | 'preset' | 'circle-pack';

export interface Layout {
  type: LayoutType;
  options: Record<string, any>;
}

export interface CommonStyle {
  /** 颜色 */
  color: string;
  /** 大小 */
  size: number;
  /** 文本映射字段 */
  caption: string[];
  /** 是否显示文字 */
  icon: string;
}

export interface NodeOptionStyle {
  /** keyshape */
  selectColor: string;
  /** icon */
  iconColor: string;
  iconSize: string;
  /** label text */
  textSize: number;
  textColor: string;
  textPosition: 'top' | 'bottom' | 'left' | 'right' | 'center';
  textBackgroundColor: string;

  /** strategy */
  zoomLevel: number[];
}
export interface EdgeOptionStyle {
  /** keyshape */
  selectColor: string;
  /** arrow */
  arrowLength: number;
  arrowPosition: number;
  /** label  */
  textColor: string;
  textSize: number;
  textBackgroundColor: string;

  /** strategy */
  zoomLevel: number[];
}
export interface NodeStatus {
  /** 是否选中节点 */
  selected?: boolean;
  /** 是否悬停 */
  hovering?: boolean;
}

export interface EdgeStatus {
  /** 是否选中边 */
  selected?: boolean;
  /** 是否悬停 */
  hovering?: boolean;
}

export interface NodeStyle extends CommonStyle {
  options: Partial<NodeOptionStyle>;
}

export interface EdgeStyle extends CommonStyle {
  options: Partial<EdgeOptionStyle>;
}

export type { ForceGraphInstance } from 'force-graph';
export type { ForceGraph3DInstance } from '3d-force-graph';
export type GraphSchema = {
  nodes: {
    id?: string;
    label: string;
    properties: {
      type: string;
      name: string;
      primaryKey?: boolean;
    }[];
  }[];
  edges: {
    id?: string;
    label: string;
    properties: {
      type: string;
      name: string;
      primaryKey?: boolean;
    }[];
    source: string;
    target: string;
  }[];
};
export type DataMap = Map<
  string,
  {
    label: string;
    properties: Record<string, any>;
    neighbors: string[];
    links: string[];
    source: Record<string, any>;
    target: Record<string, any>;
    inNeighbors: string[];
    outNeighbors: string[];
    inEdges: string[];
    outEdges: string[];
    // [key: string]: any;
  }
>;
