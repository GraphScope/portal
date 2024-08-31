import { ISchemaEdge } from '@graphscope/studio-graph-editor/dist/types/edge';
import { ISchemaNode } from '@graphscope/studio-graph-editor/dist/types/node';
import _ from 'lodash';
import { create } from 'zustand';

interface GraphState {
  graphNodes: ISchemaNode[];
  graphEdges: ISchemaEdge[];
  updateGraphNode: (node: ISchemaNode) => void;
  updateGraphEdge: (edge: ISchemaEdge) => void;
}

export const useGraphStore = create<GraphState>()(set => ({
  graphNodes: [],
  graphEdges: [],
  updateGraphNode: (node: ISchemaNode) =>
    set(state => {
      console.log('updateGraphNode', node);
      const currentGraphNode = state.graphNodes.find(graphNode => graphNode.id === node.id);
      const isEqual = _.isEqual(currentGraphNode, node);
      return isEqual ? state : { graphNodes: [...state.graphNodes, node], graphEdges: state.graphEdges };
    }),
  updateGraphEdge: (edge: ISchemaEdge) =>
    set(state => {
      console.log('updateGraphEdge', edge);
      const currentGraphEdge = state.graphEdges.find(graphEdge => graphEdge.id === edge.id);
      const isEqual = _.isEqual(currentGraphEdge, edge);
      return isEqual ? state : { graphNodes: state.graphNodes, graphEdges: [...state.graphEdges, edge] };
    }),
}));
