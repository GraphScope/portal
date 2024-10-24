import * as React from 'react';
import { useContext } from '../useContextImmer';

interface IAProps {
  children: React.ReactNode;
}

const B: React.FunctionComponent<IAProps> = props => {
  const { children } = props;
  const { store, updateStore } = useContext();
  const { name } = store;
  console.log('render.....B', name);
  return (
    <div
      style={{
        padding: 50,
        border: '1px solid blue',
      }}
    >
      B{children}
    </div>
  );
};

export default React.memo(B);
