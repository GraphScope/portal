import { ISchemaEdge } from '@graphscope/studio-graph-editor/dist/types/edge';
import { ISchemaNode } from '@graphscope/studio-graph-editor/dist/types/node';
import { create } from 'zustand';

interface GraphState {
  graphNodes: ISchemaNode[];
  graphEdges: ISchemaEdge[];
  updateGraphNodes?: (nodes: ISchemaNode[]) => void;
  updateGraphEdges?: (edges: ISchemaEdge[]) => void;
}

export const useGraphStore = create<GraphState>()(set => ({
  graphNodes: [],
  graphEdges: [],
  updateGraphNodes: (nodes: ISchemaNode[]) => set(state => ({ graphNodes: nodes, graphEdges: state.graphEdges })),
  updateGraphEdges: (edges: ISchemaEdge[]) => set(state => ({ graphNodes: state.graphNodes, graphEdges: edges })),
}));
