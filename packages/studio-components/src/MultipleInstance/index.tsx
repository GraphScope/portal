import React, { useMemo } from 'react';
import { IdContext } from './useMultipleInstance';
const MultipleInstance = props => {
  const { children } = props;
  const SDK_ID = useMemo(() => {
    if (!props.id) {
      const defaultId = `${Math.random().toString(36).substr(2)}`;
      console.info(
        `%c ⚠️: The id prop is missing in the component. A default SDK_ID: ${defaultId} is generated for managing multiple instances.`,
        'color:green',
      );
      return defaultId;
    }
    return props.id;
  }, []);

  return <IdContext.Provider value={{ id: SDK_ID }}>{children}</IdContext.Provider>;
};

export default MultipleInstance;
