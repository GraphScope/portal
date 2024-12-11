import type { ForceGraphInstance } from 'force-graph';
import type { ForceGraph3DInstance } from '3d-force-graph';
import type { Emitter as EEmitter } from 'mitt';

export type EventType =
  | 'node:click'
  | 'node:contextmenu'
  | 'node:hover'
  | 'canvas:click'
  | 'edge:click'
  | 'combo:click';

export type Emitter = EEmitter<Record<EventType, unknown>>;
export type Graph = ForceGraphInstance | ForceGraph3DInstance;
export interface GraphContextProps {
  graph: Graph;
  /**
   * Whether the graph is ready.
   */
  isReady: boolean;
  emitter: Emitter | null;
}

export interface NodeData {
  id: string;
  label: string;
  properties?: {
    [key: string]: any;
  };
  __style?: {
    color: string;
    size: string;
    caption: string;
  };
  __status?: {
    selected: boolean;
    hovering: boolean;
  };
}
export interface EdgeData extends NodeData {
  source: string;
  target: string;
}
export interface GraphData {
  nodes: NodeData[];
  edges: EdgeData[];
}
export interface Layout {
  type: string;
  options: Record<string, any>;
}

export interface StyleConfig {
  /** 颜色 */
  color: string;
  /** 大小 */
  size: number;
  /** 文本映射字段 */
  caption: string[];
  /** 是否显示文字 */
  icon: string;
}

export interface NodeStyleOptions {
  iconColor: string;
  iconSize: string;
  textColor: string;
  textPosition: 'top' | 'bottom' | 'left' | 'right' | 'center';
  zoomLevel: number[];
}
export interface EdgeStyleOptions {
  arrow: boolean;
  arrowLength: number;
  arrowPosition: number;
}
export interface StatusConfig {
  /** 是否选中 */
  selected?: boolean;
  /** 是否悬停 */
  hovering?: boolean;
}

export interface NodeStyle extends StyleConfig {
  options: NodeStyleOptions;
}

export interface EdgeStyle extends StyleConfig {
  options: EdgeStyleOptions;
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
