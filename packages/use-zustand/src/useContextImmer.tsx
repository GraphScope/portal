import React from 'react';
import { create } from 'zustand';
import { produce } from 'immer';

export const IdContext = React.createContext<{ id: string }>({
  id: '',
});

export const GLOBAL_INITIAL_STORE_MAP = new Map();
export const GLOBAL_USE_STORE_MAP = new Map();

export const useStore = globalState =>
  create<IStore>(set => {
    return {
      ...globalState,
      updateStore: fn => {
        set(
          produce(draft => {
            const temp = {}; // 用于存储临时属性
            const proxy = new Proxy(draft, {
              set: (obj, prop, value) => {
                temp[prop] = value; // 暂存更新
                return true; // 允许设置
              },
              get: (obj, prop) => {
                return obj[prop]; // 获取当前值
              },
            });

            fn(proxy); // 允许用户以代理对象的方式操作

            // 应用代理中的更改到 draft
            for (const [key, value] of Object.entries(temp)) {
              draft[key] = value; // 将临时存储的属性更新回 draft
            }
          }),
        );
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
          return _useStore(store => store[prop]);
        } else {
          console.error(`prop ${prop.toString()} not exist`);
        }
      },
    },
  );

  const updateStore = _useStore(store => store.updateStore);

  return { store: proxy, updateStore };
};
