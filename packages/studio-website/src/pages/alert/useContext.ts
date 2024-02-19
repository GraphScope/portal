import { proxy, useSnapshot } from 'valtio';
import type { INTERNAL_Snapshot as Snapshot } from 'valtio';
export type IalertInfo = {
  key: string;
  info: string;
  name: number;
  severity: string;
  status: string[];
};
export type IAlertRule = {
  key: string;
  info: string;
  name: number;
  severity: string;
  status: string[];
};
export type IAlertRecep = {
  key: string;
  webhookUrl: string;
  id: number;
  isAll: string;
  status: string[];
};

export type IStore<T> = T & {
  /** 分段选择 'info' | 'rule' | 'recep' | 'status' */
  currentType: 'info' | 'rule' | 'recep' | 'status';
  /** 警告信息 table */
  alertInfo: IalertInfo[];
  /** 警告规则 table */
  alertRule: IAlertRule[];
  /** 警告接收 table */
  alertRecep: IAlertRecep[];
  isEditRecep: boolean;
  selectedRowKeys: string[];
};

export const initialStore: IStore<{}> = {
  /** 告警 currentType */
  currentType: 'info',
  alertInfo: [],
  alertRule: [],
  alertRecep: [],
  isEditRecep: false,
  selectedRowKeys: [],
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
