import { createContext, useContext } from 'react';

export interface ISectionContext {
  collapsed: {
    leftSide: boolean;
    rightSide: boolean;
  };
  widthStyle: {
    leftSide: number;
    rightSide: number;
  };
  toggleLeftSide: () => void;
  toggleRightSide: () => void;
}
export const SectionContext = createContext<ISectionContext>({
  widthStyle: {
    leftSide: 350,
    rightSide: 350,
  },
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
