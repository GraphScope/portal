import { proxy, useSnapshot } from 'valtio';
import type { INTERNAL_Snapshot as Snapshot } from 'valtio';
export type PropertyType = {
  key: string | number;
  label: string;
  /** 数据源类型 */
  datatype?: string;
  /** 文件位置 */
  filelocation?: string;
  /** 起始节点 */
  source?: string;
  target?: string;
  /** 是否绑定 isBind */
  isBind: boolean;
  properties?: {
    key: string;
    name: string;
    type: string;
    primaryKey: boolean;
    dataindex: number | string;
  }[];
};

export type IStore<T> = T & {
  currentType: string;
  sourceList: {
    nodes: PropertyType[];
    edges: PropertyType[];
  };
  isReady: boolean;
};

export const initialStore: IStore<{}> = {
  /** 数据源 currentType */
  currentType: 'node',
  // schema 需要通过 fetch(/graph/schema) 接口得到，同时需要增加 iSReady，增加骨架图，提高体验
  sourceList: {
    nodes: [],
    edges: [],
  },
  isReady: false,
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
