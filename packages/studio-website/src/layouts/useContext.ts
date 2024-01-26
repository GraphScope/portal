import { proxy, useSnapshot } from 'valtio';
import type { INTERNAL_Snapshot as Snapshot } from 'valtio';

export const initialStore = {
  /** 语言 */
  locale: 'en-US',
  /** 主题色 */
  primaryColor: '#1677ff',
  /** 收起导航 */
  collapse: false,
  /** 当前导航 */
  currentnNav: '',
};

export type IStore = typeof initialStore;

type ContextType = {
  store: Snapshot<IStore>;
  updateStore: (fn: (draft: IStore) => void) => void;
};

export function useContext(): ContextType {
  const proxyStore = proxy(initialStore) as IStore;
  const store = useSnapshot(proxyStore);
  return {
    store,
    updateStore: (fn: (draft: IStore) => void) => {
      return fn(proxyStore);
    },
  };
}
