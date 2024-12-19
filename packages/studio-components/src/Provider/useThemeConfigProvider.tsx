import { createContext, useContext } from 'react';
import type { IColorStore } from './getThemeConfig';
export interface ThemeProviderType extends IColorStore {
  algorithm?: 'defaultAlgorithm' | 'darkAlgorithm';
  components?: { [key: string]: { [key: string]: string | number } };
  token?: { [key: string]: string | number };
  locale?: 'zh-CN' | 'en-US';
  isLight?: boolean;
}
export interface IContainerContext extends ThemeProviderType {
  handleThemeOrLocale: (value: ThemeProviderType) => void;
}
export const ContainerContext = createContext<IContainerContext>({
  components: {},
  token: {},
  handleThemeOrLocale: ({}) => {},
  locale: 'en-US',
  algorithm: 'defaultAlgorithm',
  isLight: false,
});

export const ContainerProvider = ContainerContext.Provider;

export const useStudioProvier = () => {
  const context = useContext(ContainerContext);

  if (context === undefined || Object.keys(context).length === 0) {
    throw new Error(`useContext must be used within a ContainerProvider`);
  }
  return context;
};
