import React from 'react';
interface ICreateGraph {
  children: React.ReactNode;
}
const { GS_ENGINE_TYPE } = window;
const InteractiveCase: React.FC<ICreateGraph> = props => {
  const { children } = props;
  if (GS_ENGINE_TYPE === 'interactive') {
    return <>{children}</>;
  }
  return <></>;
};

export default InteractiveCase;
