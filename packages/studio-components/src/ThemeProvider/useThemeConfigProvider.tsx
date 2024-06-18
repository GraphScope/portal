import { Color } from 'antd/es/color-picker';
import { createContext, useContext } from 'react';

export interface ThemeProviderType {
  components?: { [key: string]: { [key: string]: string | number } };
  token?: { [key: string]: string | number };
}
export interface IContainerContext {
  handleTheme: (value: ThemeProviderType) => void;
}
export const ContainerContext = createContext<IContainerContext>({
  handleTheme: function (value: ThemeProviderType): void {
    throw new Error('Function not implemented.');
  },
});

export const ContainerProvider = ContainerContext.Provider;

export const useThemeContainer = () => {
  const context = useContext(ContainerContext);

  if (context === undefined || Object.keys(context).length === 0) {
    throw new Error(`useContext must be used within a ContainerProvider`);
  }
  return context;
};