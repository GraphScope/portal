import { IStore } from './typing';
import { proxy, useSnapshot } from 'valtio';
import type { INTERNAL_Snapshot as Snapshot } from 'valtio';

const initialStore: IStore<{}> = {
  graphName: 'movie',
  nav: 'save',
  activeId: 'query-1',
  statements: [
    {
      id: 'query-1',
      name: 'query-1',
      script: 'Match (n) return n limit 10',
    },
    {
      id: 'query-2',
      name: 'query-2',
      script: 'Match (n) return n limit 30',
    },
  ],
  savedStatements: [
    {
      id: 'my-query-1 ',
      name: 'my-query-1',
      script: 'Match (n) return n limit 100',
    },
    {
      id: 'my-query-2',
      name: 'my-query-2',
      script: 'Match (n) return n limit 300',
    },
  ],
  mode: 'tabs',
};

type ContextType<T> = {
  store: Snapshot<IStore<T>>;
  updateStore: (fn: (draft: IStore<T>) => void) => void;
};

export function useContext<T>(): ContextType<T> {
  const proxyStore = proxy(initialStore) as IStore<T>;
  const store = useSnapshot(proxyStore);
  return {
    store,
    updateStore: (fn: (draft: IStore<T>) => void) => {
      return fn(proxyStore);
    },
  };
}
