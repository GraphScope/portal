import { proxy, useSnapshot } from 'valtio';
import type { INTERNAL_Snapshot as Snapshot } from 'valtio';
import type { TransformedNode, TransformedEdge } from '@/components/utils/schema';
export interface Extra {
  /** 数据源类型 */
  datatype: string;
  /** 文件位置 */
  filelocation: string;
  /** 是否绑定 isBind */
  isBind: boolean;
}
export type BindingNode = TransformedNode & Extra;
export type BindingEdge = TransformedEdge & Extra;

export type IStore<T> = T & {
  graphName: string;
  currentType: string;
  nodes: BindingNode[];
  edges: BindingEdge[];
  isReady: boolean;
};

export const initialStore: IStore<{}> = {
  /** 图名字 */
  graphName: '',
  /** 数据源 currentType */
  currentType: 'node',
  /** 节点 */
  nodes: [],
  /** 边 */
  edges: [],
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
