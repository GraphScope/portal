import { create } from 'zustand';
import { Edge } from '../types/edge';
import { Subject } from 'rxjs';

interface EdgeState {
  edges: Edge[];
  addEdge?: (edge: Edge) => void;
  deleteEdge?: (edgeKey: string) => void;
  clearEdge?: () => void;
  editEdge?: (edge: Edge) => void;
}

const edgeSubject = new Subject<EdgeState>();

const updateEdges = (state: EdgeState, newEdges: Edge[]) => {
  edgeSubject.next({ ...state, edges: newEdges });
  return { edges: newEdges };
};

export const useEdgeStore = create<EdgeState>((set, get) => ({
  edges: [],

  addEdge: edge => {
    set(state => updateEdges(state, [...state.edges, edge]));
  },

  deleteEdge: edgeKey => {
    set(state =>
      updateEdges(
        state,
        state.edges.filter(edge => edge.edgeKey !== edgeKey),
      ),
    );
  },

  clearEdge: () => {
    set(() => {
      edgeSubject.next({ edges: [] });
      return { edges: [] };
    });
  },

  editEdge: edge => {
    set(state =>
      updateEdges(
        state,
        state.edges.map(e => (e.edgeKey === edge.edgeKey ? edge : e)),
      ),
    );
  },
}));

export const edgeStore$ = edgeSubject.asObservable();
