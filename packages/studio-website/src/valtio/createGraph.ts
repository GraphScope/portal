import { proxy, useSnapshot } from "valtio";
import type { INTERNAL_Snapshot as Snapshot } from 'valtio';

export type IStore<T> = T & {
  graphName: string;
  // nav
  nav: 'save' | 'info' | 'gpt' | 'store_procedure';
  /** 单击选中的语句,如果是 fLow 模式，则滚动定位到这条语句 ，如果是 Tabs 模式，则直接展示*/
  activeId: string;
  /** 查询的语句 */
  statements: IStatement[];
  /** 展示的模式 */
  mode: 'flow' | 'tabs';
  nodeList: [];
  edgeList: [];
  option:[],
  isAlert:boolean;
};
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
  mode: 'tabs',
  nodeList: [],
  edgeList: [],
  option:[],
  isAlert:false
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