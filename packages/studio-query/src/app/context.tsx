import { proxy, useSnapshot } from 'valtio';
import type { INTERNAL_Snapshot as Snapshot } from 'valtio';

export interface IStatement {
  /** 语句ID */
  id: string;
  /** 语句名称 */
  name: string;
  /** 语句脚本 */
  script: string;
}

export type IStore<T> = T & {
  isReady: boolean;
  graphName: string;
  // nav collapse
  collapse: boolean;
  // active navbar
  activeNavbar: 'saved' | 'info' | 'gpt' | 'store_procedure';
  /** 单击选中的语句,如果是 fLow 模式，则滚动定位到这条语句 ，如果是 Tabs 模式，则直接展示*/
  activeId: string;
  /** 查询的语句 */
  statements: IStatement[];
  /** 展示的模式 */
  mode: 'flow' | 'tabs';
  /** 保存的语句 */
  savedStatements: IStatement[];
};

const initialStore: IStore<{}> = {
  /** isReady */
  isReady: false,

  graphName: 'movie',
  activeNavbar: 'saved',
  collapse: false,
  activeId: 'query-1',

  statements: [
    // {
    //   id: 'query-1',
    //   name: 'query-1',
    //   script: 'Match (n) return n limit 10',
    // },
    // {
    //   id: 'query-2',
    //   name: 'query-2',
    //   script: 'Match (n) return n limit 30',
    // },
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
