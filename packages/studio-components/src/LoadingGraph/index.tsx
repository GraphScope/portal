import React from 'react';
import './index.css';
type ILoadingGraphProps = {
  children: React.ReactNode;
};
const LoadingGraph: React.FC<ILoadingGraphProps> = props => {
  const { children } = props;
  return <div className="loading-icon">{children}</div>;
};
export default LoadingGraph;
