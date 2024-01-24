import { proxy, useSnapshot } from "valtio";
import type { INTERNAL_Snapshot as Snapshot } from 'valtio';

export type IStore<T> = T & {
  caption:string;
};
export const initialStore: IStore<{}> = {
  caption: ''
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