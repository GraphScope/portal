import React, { useContext as useReactContext, useMemo } from 'react';
import { create } from 'zustand';

export const IdContext = React.createContext<{ id: string }>({
  id: '',
});

export const GLOBAL_INITIAL_STORE_MAP = new Map<string, any>();
export const GLOBAL_USE_STORE_MAP = new Map<string, any>();
//@ts-ignore
window.GLOBAL_USE_STORE_MAP = GLOBAL_USE_STORE_MAP;
//@ts-ignore
window.GLOBAL_INITIAL_STORE_MAP = GLOBAL_INITIAL_STORE_MAP;

export interface IStore<T = {}> {
  updateStore: (fn: (state: Partial<T>) => void) => void;
}

export function useStore<T = {}>(globaState: T) {
  return create<IStore<T>>(function (set, get) {
    return {
      ...globaState,
      updateStore: function (fn: (state: Partial<T>) => void) {
        const target: Partial<T> = {};
        const temp: Partial<T> = {};

        const proxy = new Proxy(target, {
          set: function (obj, prop: string | symbol, value: any) {
            if (typeof prop === 'string') {
              temp[prop as keyof T] = value; // 将属性暂存到临时对象
            }
            return true;
          },
          get: function (obj, prop: string | symbol) {
            return get()[prop];
          },
        });

        fn(proxy);

        // 执行批量处理，将临时对象的属性应用到目标对象
        for (const [key, value] of Object.entries(temp)) {
          target[key as keyof T] = value as any;
        }
        set(target);
      },
    };
  });
}

export function initStore<T = {}>(ContextId: string, initialStore: T) {
  if (GLOBAL_INITIAL_STORE_MAP.has(ContextId)) {
    return;
  }
  GLOBAL_INITIAL_STORE_MAP.set(ContextId, initialStore);
  GLOBAL_USE_STORE_MAP.set(ContextId, useStore(initialStore));
}

export function useContext<T = any>(contextId?: string) {
  let { id } = useReactContext(IdContext);
  if (contextId) {
    /**
     * 考虑到下面的特殊情况
     *
     * <StoreProvider id='app-1' store={app-store-1}>
     *      <A />
     *      <C />
     *      <StoreProvider id='app-2' store={app-store-2}>
     *          <B />
     *          <C />
     *      </StoreProvider>
     * </StoreProvider>
     *
     * 使用 A/B/C 三个组件在内部通过 useReactContext(IdContext) 获取上下文ID的时候，按照就近原则
     * A/C 的 ContextID 为 app-1
     * B/C 的 ContextID 为 app-2
     *
     * 组件 C 可能因为在两个不同的环境中使用，从而导致获取的上下文ID 不一致
     * 因此使用一个可传递的参数 ContextId 来解决
     *
     * <C id='app-1' /> 内部使用 const { store } =  useContext(props.id)
     *
     */
    id = contextId;
  }

  const _useStore = GLOBAL_USE_STORE_MAP.get(id) as (selector: (state: IStore<T>) => any) => any;
  const _store = GLOBAL_INITIAL_STORE_MAP.get(id) as Partial<IStore<T>>;

  const proxy = new Proxy(
    { ..._store },
    {
      get: function (obj, prop: string | symbol) {
        if (prop in obj) {
          return _useStore(store => store[prop as keyof IStore<T>]);
        } else {
          console.error(`prop ${prop.toString()} not exist`);
          return undefined;
        }
      },
    },
  );

  const updateStore = _useStore(store => store.updateStore);

  return { store: proxy, updateStore, id } as {
    store: T;
    updateStore: (fn: (state: T) => void) => void;
    id: string;
  };
}

export interface IStoreProviderProps<T> {
  children: React.ReactNode;
  store: T;
  id?: string;
}
function StoreProvider<T = {}>(props: IStoreProviderProps<T>) {
  const { children, store, id } = props;
  const SDK_ID = useMemo(() => {
    if (!id) {
      const defaultId = `${Math.random().toString(36).substr(2)}`;
      // console.info(
      //   `%c ⚠️: The id prop is missing in the component. A default SDK_ID: ${defaultId} is generated for managing multiple instances.`,
      //   'color:green',
      // );
      return defaultId;
    }

    return id;
  }, []);

  initStore<T>(SDK_ID, store);

  return <IdContext.Provider value={{ id: SDK_ID }}>{children}</IdContext.Provider>;
}

export default StoreProvider;
