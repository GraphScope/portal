import React from "react";
import { create } from "zustand";

export const IdContext = React.createContext<{ id: string }>({
  id: "",
});

export const GLOBAL_INITIAL_STORE_MAP = new Map();
export const GLOBAL_USE_STORE_MAP = new Map();

export const useStore = (globaState) =>
  create<IStore>((set) => {
    return {
      ...globaState,
      updateStore: (fn) => {
        const target = {};
        const temp = {}; // 用于存储临时属性
        const proxy = new Proxy(target, {
          set: (obj, prop, value) => {
            temp[prop] = value; // 将属性暂存到临时对象
            return true; // 表示赋值成功
          },
        });

        fn(proxy);

        // 执行批量处理，将临时对象的属性应用到目标对象
        for (const [key, value] of Object.entries(temp)) {
          target[key] = value;
        }
        set(target);
      },
    };
  });

export function initStore<T>(ContextId: string, initialStore: T) {
  if (GLOBAL_INITIAL_STORE_MAP.has(ContextId)) {
    return;
  }
  GLOBAL_INITIAL_STORE_MAP.set(ContextId, initialStore);
  GLOBAL_USE_STORE_MAP.set(ContextId, useStore(initialStore));
}

export interface IStore {
  name: string;
  count: number;
  position: Array<{ x: number; y: number }>;
  updateStore: (fn: any) => void;
}

export const useContext = () => {
  const { id } = React.useContext(IdContext);

  const _useStore = GLOBAL_USE_STORE_MAP.get(id);
  const _store = GLOBAL_INITIAL_STORE_MAP.get(id);

  const proxy = new Proxy(
    { ..._store },
    {
      get: (obj, prop) => {
        if (prop in obj) {
          return _useStore((store) => store[prop]);
        } else {
          console.error(`prop ${prop.toString()} not exist`);
        }
      },
    }
  );

  const updateStore = _useStore((store) => store.updateStore);

  return { store: proxy, updateStore };
};
