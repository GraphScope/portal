import React from 'react';

export const IdContext = React.createContext<{ id: string }>({
  id: '',
});

export const StoreMap = new Map();

export const getProxyStoreById = (ContextId: string, initialStore: any) => {
  if (ContextId) {
    const prevStore = StoreMap.get(ContextId);
    if (!prevStore) {
      /** 考虑SDK多实例的场景 */
      StoreMap.set(ContextId, initialStore);
    }
  }

  return StoreMap.get(ContextId);
};

export const useMultipleInstance = initialStore => {
  const { id } = React.useContext(IdContext);
  const currentStore = getProxyStoreById(id, initialStore);
  return {
    id,
    currentStore,
  };
};
