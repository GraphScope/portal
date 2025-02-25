import React from 'react';
import { useTheme } from './useTheme';
import { useIsMobile } from './useIsMobile';
const EnvContext = React.createContext({
  isMobile: false,
  isDark: false,
});

export const EnvProvider = props => {
  const isMobile = useIsMobile();
  const currentMode = useTheme();
  const isDark = currentMode === 'dark';
  console.log('currentMode', currentMode, 'isDark', isDark);

  return (
    <EnvContext.Provider
      value={{
        isMobile,
        isDark,
      }}
    >
      {props.children}
    </EnvContext.Provider>
  );
};
export const useEnv = () => {
  return React.useContext(EnvContext);
};
