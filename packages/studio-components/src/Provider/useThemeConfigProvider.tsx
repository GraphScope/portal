import { createContext, useContext } from 'react';
import { IColorStore } from './useStore';
export interface ThemeProviderType extends IColorStore {
  algorithm?: 'defaultAlgorithm' | 'darkAlgorithm';
  components?: { [key: string]: { [key: string]: string | number } };
  token?: { [key: string]: string | number };
  messages?: { [key: string]: string };
  locale?: 'zh-CN' | 'en-US';
}
export interface IContainerContext extends ThemeProviderType {
  handleTheme: (value: ThemeProviderType) => void;
}
export const ContainerContext = createContext<IContainerContext>({
  components: {},
  token: {},
  handleTheme: ({}) => {},
  locale: 'en-US',
});

export const ContainerProvider = ContainerContext.Provider;

export const useThemeContainer = () => {
  const context = useContext(ContainerContext);

  if (context === undefined || Object.keys(context).length === 0) {
    throw new Error(`useContext must be used within a ContainerProvider`);
  }
  return context;
};
