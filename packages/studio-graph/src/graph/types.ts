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
export type Graph = ForceGraphInstance | ForceGraph3DInstance | null;
export interface GraphContextProps {
  graph: Graph | null;
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
export interface GraphProps extends Pick<React.HTMLAttributes<HTMLDivElement>, 'id' | 'className' | 'style'> {
  render: '2D' | '3D';
  data: GraphData;
  nodeStyle: any;
  edgeStyle: any;
  nodeStatus: any;
  edgeStatus: any;
  /**
   * The options for the  graph instance.
   */
  options?: any;
  /**
   * Callback for when the graph is initialized, after new Graph().
   */
  onInit?: (graph: Graph, emitter: Emitter, params: any) => void;
  /**
   * Callback for when the graph is ready, after graph.render().
   */
  onReady?: (graph: any) => void;
  /**
   * Callback for when the graph is destroyed, after graph.destroy().
   */
  onDestroy?: () => void;
}
