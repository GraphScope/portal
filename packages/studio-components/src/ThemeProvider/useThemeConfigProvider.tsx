import { createContext, useContext } from 'react';

export interface ThemeProviderType {
  components?: { [key: string]: { [key: string]: string | number } };
  token?: { [key: string]: string | number };
}
export interface IContainerContext extends ThemeProviderType {
  handleTheme: (value: ThemeProviderType) => void;
}
export const ContainerContext = createContext<IContainerContext>({
  components: {},
  token: {},
  handleTheme: ({}) => {},
});

export const ContainerProvider = ContainerContext.Provider;

export const useThemeContainer = () => {
  const context = useContext(ContainerContext);

  if (context === undefined || Object.keys(context).length === 0) {
    throw new Error(`useContext must be used within a ContainerProvider`);
  }
  return context;
};
