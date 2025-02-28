import * as React from 'react';
import { Toolbar, useContext } from '@graphscope/studio-graph';
interface IFloatToolbarProps {
  children: React.ReactNode;
  position?: 'top' | 'bottom';
}

const FloatContainer: React.FunctionComponent<IFloatToolbarProps> = props => {
  const { children, position = 'top' } = props;
  const { store } = useContext();
  const { selectNodes, selectEdges } = store;
  const isSelect = selectNodes.length > 0 || selectEdges.length > 0;

  return (
    <div
      style={{
        position: 'absolute',
        [position]: position === 'top' ? '20px' : '12px',
        right: isSelect ? '296px' : '12px',
        left: 'unset',
        zIndex: 9,
        transition: 'all 0.3 ease',
      }}
    >
      {children}
    </div>
  );
};

export default FloatContainer;
