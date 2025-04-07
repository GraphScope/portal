import { createContext, useContext } from 'react';

type localeType = 'zh-CN' | 'en-US';
export interface IContainerContext {
  handleLocale: (value: localeType) => void;
  locale: localeType;
}
export const ContainerContext = createContext<IContainerContext>({
  handleLocale: ({}) => {},
  locale: 'en-US',
});

export const LocaleProvider = ContainerContext.Provider;

export const useLocaleProvider = () => {
  const context = useContext(ContainerContext);
  if (context === undefined || Object.keys(context).length === 0) {
    throw new Error(`useContext must be used within a LocaleProvider`);
  }
  return context;
};
