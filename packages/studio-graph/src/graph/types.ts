import type { ForceGraphInstance } from 'force-graph';
import type { ForceGraph3DInstance } from '3d-force-graph';
import type { Emitter as EEmitter } from 'mitt';

export type EventType = 'node:click' | 'node:contextmenu' | 'node:hover';
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

export interface GraphProps extends Pick<React.HTMLAttributes<HTMLDivElement>, 'id' | 'className' | 'style'> {
  render: '2D' | '3D';
  data: {
    nodes: any[];
    edges: any[];
  };
  nodeStyle: any;
  edgeStyle: any;
  /**
   * The options for the  graph instance.
   */
  options?: any;
  /**
   * Callback for when the graph is initialized, after new Graph().
   */
  onInit?: (graph: Graph, emitter: Emitter) => void;
  /**
   * Callback for when the graph is ready, after graph.render().
   */
  onReady?: (graph: any) => void;
  /**
   * Callback for when the graph is destroyed, after graph.destroy().
   */
  onDestroy?: () => void;
}
