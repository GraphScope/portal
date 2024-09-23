import { create } from 'zustand';
import { Node } from '../types/node';
import { Subject } from 'rxjs';
import _ from 'lodash';

interface NodeState {
  nodes: Node[];
  addNode?: (node: Node) => void;
  deleteNode?: (nodeKey: string) => void;
  clearNode?: () => void;
  editNode?: (node: Node) => void;
  replaceNodes?: (nodes: Node[]) => void;
  addVariableForNode?: (nodeKey: string, variableName: string) => void;
}

const nodesSubject = new Subject<NodeState>();

const updateNodes = (state: NodeState, newNodes: Node[]) => {
  nodesSubject.next({ ...state, nodes: newNodes });
  return { nodes: newNodes };
};

export const useNodeStore = create<NodeState>()(set => ({
  nodes: [],

  addNode: node =>
    set(state => {
      // 检查节点是否已存在
      if (state.nodes.some(n => n.id === node.id)) {
        return state; // 如果已存在，则返回当前状态，不进行添加
      }
      return updateNodes(state, [...state.nodes, node]);
    }),

  deleteNode: nodeKey =>
    set(state => {
      // 检查节点是否存在
      if (!state.nodes.some(n => n.id === nodeKey)) {
        return state; // 如果不存在，则返回当前状态，不进行删除
      }
      return updateNodes(
        state,
        state.nodes.filter(n => n.id !== nodeKey),
      );
    }),

  clearNode: () =>
    set(() => {
      nodesSubject.next({ nodes: [] });
      return { nodes: [] };
    }),

  replaceNodes: (nodes: Node[]) =>
    set(() => {
      nodesSubject.next({ nodes });
      return { nodes };
    }),

  addVariableForNode: (nodeKey: string, variableName: string) =>
    set(state => {
      const currentNode = state.nodes.find(node => node.id === nodeKey);
      if (currentNode?.variable) return state;
      const newNodes = state.nodes.map(node => {
        if (node.id === nodeKey) {
          return { ...node, variable: variableName };
        }
        return node;
      });
      return updateNodes(state, newNodes);
    }),

  editNode: node =>
    set(state => {
      const index = state.nodes.findIndex(n => n.id === node.id);
      if (index === -1 || _.isEqual(state.nodes[index], node)) {
        return state; // 如果不存在或节点没有变化，则不更新引用
      }
      const newNodes = [...state.nodes];
      newNodes[index] = { ...newNodes[index], ...node };
      return updateNodes(state, newNodes);
    }),
}));

export const nodeStore$ = nodesSubject.asObservable();
