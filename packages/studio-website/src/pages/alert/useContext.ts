import { proxy, useSnapshot } from 'valtio';
import type { INTERNAL_Snapshot as Snapshot } from 'valtio';
export type IalertInfo = {
  key: string;
  info: string;
  name: number;
  severity: string;
  status: string[];
};

export type IAlertRecep = {
  key?: string;
  message: string;
  receiver_id: string;
  webhook_url: string;
  at_user_ids: string[];
  is_at_all: boolean;
  enable: boolean;
  type: string;
};

export type IStore<T> = T & {
  /** 分段选择 'info' | 'rule' | 'recep' | 'status' */
  currentType: 'info' | 'rule' | 'recep' | 'status';
  /** 警告信息 table */
  alertInfo: IalertInfo[];
  /** 警告信息严重性选项 */
  severityTypeOptions: { value: string; text: string }[];
  /** 警告信息类型选项  */
  metricTypeOptions: { value: string; text: string }[];
  /** 警告接收 table */
  alertRecep: IAlertRecep[];
  isEditRecep: boolean;
  selectedRowKeys: string[];
  defaultFilteredValue: string;
  isReady: boolean;
};

export const initialStore: IStore<{}> = {
  /** 告警 currentType */
  currentType: 'info',
  alertInfo: [],
  alertRecep: [],
  isEditRecep: false,
  selectedRowKeys: [],
  severityTypeOptions: [],
  metricTypeOptions: [],
  defaultFilteredValue: 'All',
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
