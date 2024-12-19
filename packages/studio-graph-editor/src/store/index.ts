// //TODO: use create store for Multiple Instance

// import { create, createStore } from 'zustand';
// import { defaultStore } from '../canvas/useContext';
// import { GraphProps, GraphState } from '../types/store';
// import { addEdge, applyEdgeChanges, applyNodeChanges } from 'reactflow';
// import { ISchemaNode } from '../types/node';
// import { ISchemaEdge } from '../types/edge';

// // export const createGraphStore = (initialProps?: Partial<GraphProps>) => {
// //   const DEFAULT_PROPS: GraphProps = {
// //     setting: defaultStore,
// //     nodes: [],
// //     edges: [],
// //   };

// export const useGraphStore = create<GraphState>((set, get) => ({
//   // ...DEFAULT_PROPS,
//   // ...initialProps,
//   setting: defaultStore,
//   nodes: [],
//   edges: [],
//   setSetting: setting =>
//     set({
//       setting: {
//         ...get().setting,
//         ...setting,
//       },
//     }),
//   onNodesChange: changes =>
//     set({
//       nodes: applyNodeChanges(changes, get().nodes),
//     }),
//   onEdgesChange: changes =>
//     set({
//       edges: applyEdgeChanges(changes, get().edges),
//     }),
//   onConnect: connection =>
//     set({
//       edges: addEdge(connection, get().edges),
//     }),
//   addNode: (node: ISchemaNode) =>
//     set({
//       nodes: [...get().nodes, node],
//     }),
//   addEdge: (edge: ISchemaEdge) =>
//     set({
//       edges: [...get().edges, edge],
//     }),
//   deleteEdge: (edgeId: string) =>
//     set({
//       edges: get().edges.filter(edge => edge.id !== edgeId),
//     }),
//   deleteNode: (nodeId: string) =>
//     set({
//       nodes: get().nodes.filter(node => node.id !== nodeId),
//     }),
//   setNodes: (nodes: ISchemaNode[]) =>
//     set({
//       nodes,
//     }),
//   setEdges: (edges: ISchemaEdge[]) =>
//     set({
//       edges,
//     }),
// }));
// };
