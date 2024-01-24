import { proxy, useSnapshot } from "valtio";
import type { INTERNAL_Snapshot as Snapshot } from 'valtio';
type PropertyList ={
    id: string | number;
    name?: string;
    type?: string;
    token?: string;
    primaryKey?: boolean;
    disable?: boolean;
}

export type IStore<T> = T & {
    /** properties 选中key值 */
    selectedRows: never[];
    /** map from file 选中key值 */
    selectedMapRowKeys: any[];
    /** properties 列表值 */
    configList: PropertyList[];
    /** 映射列表值 */
    mapfromfileList: PropertyList[];
    /** properties全选key值 */
    proSelectKey: any[];
};
export const initialStore: IStore<{}> = {
    selectedRows: [],
    selectedMapRowKeys: [],
    configList: [],
    mapfromfileList: [],
    proSelectKey: [],
};

type ContextType<T> = {
    state: Snapshot<IStore<T>>;
  updateState: (fn: (draft: IStore<T>) => void) => void;
};

export function useImmer<T>(): ContextType<T> {
  const proxyStore = proxy(initialStore) as IStore<T>;
  const state = useSnapshot(proxyStore);
  return {
    state,
    updateState: (fn: (draft: IStore<T>) => void) => {
      return fn(proxyStore);
    },
  };
}