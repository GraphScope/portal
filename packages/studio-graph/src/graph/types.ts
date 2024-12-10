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
