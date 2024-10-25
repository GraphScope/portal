import * as React from 'react';
import { useContext } from './useContext';
interface IAProps {
  children: React.ReactNode;
}
const A: React.FunctionComponent<IAProps> = props => {
  const { children } = props;
  const { store, updateStore } = useContext();
  const { name } = store;

  const handleClick = () => {
    console.log('A handleClick');
    updateStore(draft => {
      draft.name = 'pomelo.lcw';
    });
  };

  return (
    <div
      style={{
        padding: 50,
        border: '1px solid red',
      }}
    >
      <button onClick={handleClick}> click A </button>
      <p>{name}</p>
      {children}
    </div>
  );
};

export default A;
