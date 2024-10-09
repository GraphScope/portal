import { create } from 'zustand';
import { Edge } from '../types/edge';
import { Subject } from 'rxjs';
import _ from 'lodash';

interface EdgeState {
  edges: Edge[];
  addEdge?: (edge: Edge) => void;
  deleteEdge?: (edgeKey: string) => void;
  clearEdge?: () => void;
  editEdge?: (edge: Edge) => void;
  replaceEdges?: (edges: Edge[]) => void;
  addVariableForEdge?: (edgeKey: string, variableName: string) => void;
}

const edgeSubject = new Subject<EdgeState>();

const updateEdges = (state: EdgeState, newEdges: Edge[]) => {
  edgeSubject.next({ ...state, edges: newEdges });
  return { edges: newEdges };
};

export const useEdgeStore = create<EdgeState>((set, get) => ({
  edges: [],

  addVariableForEdge: (edgeKey: string, variableName: string) =>
    set(state => {
      const currentEdge = state.edges.find(edge => edge.id === edgeKey);
      if (currentEdge?.variable) return state;
      const newEdges = state.edges.map(edge => {
        if (edge.id === edgeKey) {
          return { ...edge, variable: variableName };
        }
        return edge;
      });
      return updateEdges(state, newEdges);
    }),

  addEdge: edge => {
    set(state => {
      // 检查边是否已存在
      if (state.edges.some(e => e.id === edge.id)) {
        return state; // 如果已存在，则返回当前状态，不进行添加
      }
      return updateEdges(state, [...state.edges, edge]);
    });
  },

  deleteEdge: edgeKey => {
    set(state => {
      // 检查边是否存在
      if (!state.edges.some(e => e.id === edgeKey)) {
        return state; // 如果不存在，则返回当前状态，不进行删除
      }
      return updateEdges(
        state,
        state.edges.filter(edge => edge.id !== edgeKey),
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
      const index = state.edges.findIndex(e => e.id === edge.id);
      if (index === -1 || _.isEqual(state.edges[index], edge)) {
        return state; // 如果不存在或边没有变化，则不更新引用
      }
      const newEdges = [...state.edges];
      newEdges[index] = { ...newEdges[index], ...edge };
      return updateEdges(state, newEdges);
    });
  },
}));

export const edgeStore$ = edgeSubject.asObservable();
