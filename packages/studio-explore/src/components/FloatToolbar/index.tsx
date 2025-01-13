import * as React from 'react';
import { Toolbar, useContext } from '@graphscope/studio-graph';
interface IFloatToolbarProps {
  children: React.ReactNode;
}

const FloatToolbar: React.FunctionComponent<IFloatToolbarProps> = props => {
  const { children } = props;
  const { store } = useContext();
  const { selectNodes, selectEdges } = store;
  const isSelect = selectNodes.length > 0 || selectEdges.length > 0;

  const right = isSelect ? '296px' : '12px';
  return (
    <Toolbar
      style={{
        position: 'absolute',
        top: '20px',
        right: right,
        left: 'unset',
        zIndex: 999999,
        transition: 'all 0.3 ease',
      }}
    >
      {children}
    </Toolbar>
  );
};

export default FloatToolbar;
