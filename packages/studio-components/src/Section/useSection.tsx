import { createContext, useContext } from 'react';

export interface ISectionContext {
  collapsed: {
    leftSide: boolean;
    rightSide: boolean;
  };

  toggleLeftSide: (value?: boolean) => void;
  toggleRightSide: (value?: boolean) => void;
}
export const SectionContext = createContext<ISectionContext>({
  collapsed: {
    leftSide: true,
    rightSide: true,
  },
  toggleRightSide: () => {},
  toggleLeftSide: () => {},
});

export const SectionProvider = SectionContext.Provider;

export const useSection = () => {
  const context = useContext(SectionContext);

  if (context === undefined || Object.keys(context).length === 0) {
    throw new Error(`useContext must be used within a SectionProvider`);
  }
  return context;
};
