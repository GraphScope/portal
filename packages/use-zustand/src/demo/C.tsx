import * as React from 'react';

import { useContext } from './useContext';
interface IAProps {
  children?: React.ReactNode;
}

const C: React.FunctionComponent<IAProps> = props => {
  const { children } = props;
  const { store, updateStore } = useContext();
  const { count } = store;

  console.log('render.....C', count);
  const handleClick = () => {
    console.log('C handleClick');
    updateStore(draft => {
      draft.name = '12';
      draft.count = Math.random();
      draft.name = 'pxxxx' + Math.random();
    });
  };

  return (
    <div
      style={{
        padding: 50,
        border: '1px solid green',
      }}
    >
      <button onClick={handleClick}>click C</button>
      <p>count: {count}</p>
      {children}
    </div>
  );
};

export default C;
