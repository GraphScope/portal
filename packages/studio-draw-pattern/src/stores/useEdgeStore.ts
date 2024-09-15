import { create } from 'zustand';
import { Edge } from '../types/edge';
import { Subject } from 'rxjs';

interface EdgeState {
  edges: Edge[];
  addEdge?: (edge: Edge) => void;
  deleteEdge?: (edgeKey: string) => void;
  clearEdge?: () => void;
  editEdge?: (edge: Edge) => void;
  replaceEdges?: (edges: Edge[]) => void;
}

const edgeSubject = new Subject<EdgeState>();

const updateEdges = (state: EdgeState, newEdges: Edge[]) => {
  edgeSubject.next({ ...state, edges: newEdges });
  return { edges: newEdges };
};

export const useEdgeStore = create<EdgeState>((set, get) => ({
  edges: [],

  addEdge: edge => {
    set(state => {
      // 检查边是否已存在
      if (state.edges.some(e => e.edgeKey === edge.edgeKey)) {
        return state; // 如果已存在，则返回当前状态，不进行添加
      }
      return updateEdges(state, [...state.edges, edge]);
    });
  },

  deleteEdge: edgeKey => {
    set(state => {
      // 检查边是否存在
      if (!state.edges.some(e => e.edgeKey === edgeKey)) {
        return state; // 如果不存在，则返回当前状态，不进行删除
      }
      return updateEdges(
        state,
        state.edges.filter(edge => edge.edgeKey !== edgeKey),
      );
    });
  },

  clearEdge: () => {
    // console.log('路径进行清除');
    set(() => {
      edgeSubject.next({ edges: [] });
      return { edges: [] };
    });
  },

  replaceEdges: (edges: Edge[]) => {
    set(() => {
      edgeSubject.next({ edges });
      return { edges };
    });
  },

  editEdge: edge => {
    set(state => {
      // 检查边是否存在
      if (!state.edges.some(e => e.edgeKey === edge.edgeKey)) {
        return state; // 如果不存在，则返回当前状态，不进行编辑
      }
      return updateEdges(
        state,
        state.edges.map(e => (e.edgeKey === edge.edgeKey ? edge : e)),
      );
    });
  },
}));

export const edgeStore$ = edgeSubject.asObservable();
