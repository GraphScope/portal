import { proxy, useSnapshot } from 'valtio';
import type { INTERNAL_Snapshot as Snapshot } from 'valtio';
export type IalertInfo = {
  key: string;
  info: string;
  name: number;
  severity: string;
  status: string[];
};

export type IStore<T> = T & {
  /** 分段选择 'info' | 'rule' | 'recep' | 'status' */
  currentType: 'info' | 'rule' | 'recep' | 'status';
  /** 警告信息 table */
  alertInfo: IalertInfo[];
  isEditRecep: boolean;
  selectedRowKeys: string[];
  defaultFilteredValue: string;
};

export const initialStore: IStore<{}> = {
  /** 告警 currentType */
  currentType: 'info',
  alertInfo: [],
  isEditRecep: false,
  selectedRowKeys: [],
  defaultFilteredValue: 'All',
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
