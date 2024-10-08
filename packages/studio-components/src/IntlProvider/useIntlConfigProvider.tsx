import { createContext, useContext } from 'react';

export interface ThemeProviderType {
  locale?: 'zh-CN' | 'en-US';
}
export interface IContainerContext extends ThemeProviderType {
  handleLocale: (value: ThemeProviderType) => void;
}
export const IntlContainerContext = createContext<IContainerContext>({
  handleLocale: ({}) => {},
  locale: 'en-US',
});

export const IntlContainerProvider = IntlContainerContext.Provider;

export const useIntlContainer = () => {
  const context = useContext(IntlContainerContext);

  if (context === undefined || Object.keys(context).length === 0) {
    throw new Error(`useContext must be used within a ContainerProvider`);
  }
  return context;
};
