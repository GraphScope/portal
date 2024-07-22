import React from 'react';
import type { GraphContextProps } from '../types';

export const GraphContext = React.createContext<GraphContextProps>({
  graph: null,
  isReady: false,
  emitter: null,
});

export const useGraph = () => {
  const context = React.useContext(GraphContext);
  if (context === undefined || Object.keys(context).length === 0) {
    throw new Error('useGraph must be used within a GraphProvider.');
  }
  return context;
};
