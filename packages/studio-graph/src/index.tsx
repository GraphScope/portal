export { default as locales } from './locales';

export * from './components';
export * from './graph/types';

export { useContext, GraphProvider } from './graph/useContext';
export { getDataMap, getStyleConfig } from './graph/utils';
export { registerIcons } from './graph/custom-icons';

export type { INeighborQueryData, INeighborQueryItems } from './components/ContextMenu/NeighborQuery';
export { useApis } from './graph/hooks/useApis';

export type IServiceQueries<T extends { id: string; query: (...args: any[]) => Promise<any> }> = {
  [K in T['id']]?: T extends { id: K } ? T['query'] : never;
};
export interface IQueryStatement {
  id: 'queryStatement';
  query: (script: string) => Promise<any>;
}
