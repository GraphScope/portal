import React, { useMemo } from 'react';
import { IdContext, initStore } from './useContext';
export { useContext } from './useContext';
const StoreProvider = props => {
  const { children, store, id } = props;
  const SDK_ID = useMemo(() => {
    if (!id) {
      const defaultId = `${Math.random().toString(36).substr(2)}`;
      console.info(
        `%c ⚠️: The id prop is missing in the component. A default SDK_ID: ${defaultId} is generated for managing multiple instances.`,
        'color:green',
      );
      return defaultId;
    }

    return id;
  }, []);
  initStore(SDK_ID, store);
  console.log('StoreProvider', SDK_ID, store);

  return <IdContext.Provider value={{ id: SDK_ID }}>{children}</IdContext.Provider>;
};

export default StoreProvider;
