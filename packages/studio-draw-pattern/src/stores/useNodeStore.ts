import { create } from 'zustand';
import { Node } from '../types/node';
import { Subject } from 'rxjs';

interface NodeState {
  nodes: Node[];
  addNode?: (node: Node) => void;
  deleteNode?: (nodeKey: string) => void;
  clearNode?: () => void;
  editNode?: (node: Node) => void;
}

const nodesSubject = new Subject<NodeState>();

const updateNodes = (state: NodeState, newNodes: Node[]) => {
  nodesSubject.next({ ...state, nodes: newNodes });
  return { nodes: newNodes };
};

export const useNodeStore = create<NodeState>()(set => ({
  nodes: [],

  addNode: node => set(state => updateNodes(state, [...state.nodes, node])),

  deleteNode: nodeKey =>
    set(state =>
      updateNodes(
        state,
        state.nodes.filter(n => n.nodeKey !== nodeKey),
      ),
    ),

  clearNode: () =>
    set(() => {
      nodesSubject.next({ nodes: [] });
      return { nodes: [] };
    }),

  editNode: node =>
    set(state =>
      updateNodes(
        state,
        state.nodes.map(n => (n.nodeKey === node.nodeKey ? node : n)),
      ),
    ),
}));

export const nodeStore$ = nodesSubject.asObservable();
