import { ISchemaEdge } from '@graphscope/studio-graph-editor';
import { ISchemaNode } from '@graphscope/studio-graph-editor';
import _ from 'lodash';
import { create } from 'zustand';

interface GraphState {
  graphNodes: ISchemaNode[];
  graphEdges: ISchemaEdge[];
  updateGraphNode: (node: ISchemaNode) => void;
  updateGraphEdge: (edge: ISchemaEdge) => void;
  clearGraphStore: () => void;
}

export const useGraphStore = create<GraphState>()(set => ({
  graphNodes: [],
  graphEdges: [],

  // 更新图表节点
  updateGraphNode: (node: ISchemaNode) =>
    set(state => {
      console.log('updateGraphNode', node);
      const currentGraphNode = state.graphNodes.find(graphNode => graphNode.id === node.id);
      const isEqual = _.isEqual(currentGraphNode, node);
      return isEqual ? state : { graphNodes: [...state.graphNodes, node], graphEdges: state.graphEdges };
    }),

  // 更新图表路径
  updateGraphEdge: (edge: ISchemaEdge) =>
    set(state => {
      console.log('updateGraphEdge', edge);
      const currentGraphEdge = state.graphEdges.find(graphEdge => graphEdge.id === edge.id);
      const isEqual = _.isEqual(currentGraphEdge, edge);
      return isEqual ? state : { graphNodes: state.graphNodes, graphEdges: [...state.graphEdges, edge] };
    }),

  // 每次选择模板时，要将上次的模板数据清除
  clearGraphStore: () =>
    set({
      graphNodes: [],
      graphEdges: [],
    }),
}));
