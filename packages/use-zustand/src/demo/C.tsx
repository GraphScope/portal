import * as React from 'react';
import { useContext } from '../useContextImmer';
interface IAProps {
  children?: React.ReactNode;
  id: number;
}

const C: React.FunctionComponent<IAProps> = props => {
  const { children, id } = props;
  const { store, updateStore } = useContext();
  const { count } = store;

  console.log('render.....C', count[id]);
  const handleClick = () => {
    console.log('C handleClick');
    updateStore(draft => {
      draft.count[id] = Math.random();
      // draft.name = 'pxxxx' + Math.random();
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
      <p>count: {count[id]}</p>
      {children}
    </div>
  );
};

export default React.memo(C);
