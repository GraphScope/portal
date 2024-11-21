export type { StyleConfig } from '../components/Prepare/typing';
export type { Emitter, Graph, GraphData, NodeData, EdgeData } from '../graph/types';
export type { ForceGraphInstance } from 'force-graph';
export type { ForceGraph3DInstance } from '3d-force-graph';
export type GraphSchema = {
  nodes: {
    id?: string;
    label: string;
    properties: {
      type: string;
      name: string;
    }[];
  }[];
  edges: {
    id?: string;
    label: string;
    properties: {
      type: string;
      name: string;
    }[];
    source: string;
    target: string;
  }[];
};
