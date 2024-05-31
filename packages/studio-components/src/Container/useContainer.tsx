import { createContext, useContext } from 'react';

export interface IContainerContext {
  width: number;
  collapsed: boolean;
  toggleSidebar: () => void;
}
export const ContainerContext = createContext<IContainerContext>({
  width: 1240,
  collapsed: false,
  toggleSidebar: () => {},
});

export const ContainerProvider = ContainerContext.Provider;

export const useContainer = () => {
  const context = useContext(ContainerContext);

  if (context === undefined || Object.keys(context).length === 0) {
    throw new Error(`useContext must be used within a ContainerProvider`);
  }
  return context;
};
