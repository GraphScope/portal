import { proxy, useSnapshot } from 'valtio';
import type { INTERNAL_Snapshot as Snapshot } from 'valtio';
import localStorage from '@/components/utils/localStorage';
const { getItem } = localStorage;
const themeColor = getItem('themeColor');
const primaryColor = getItem('primaryColor');
const corner = getItem('corner');
const locale = getItem('locale');
console.log(themeColor);

export const initialStore = {
  /** 语言 */
  locale: locale || 'en-US',
  /** 主题色 */
  primaryColor: primaryColor || '#1677ff',
  /** 收起导航 */
  collapse: false,
  /** 当前导航 */
  currentnNav: '',
  /** 主题模式 */
  mode: themeColor || 'defaultAlgorithm',
  inputNumber: corner || 6,
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
