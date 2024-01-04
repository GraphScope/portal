import * as React from 'react';
import { useContext } from '../../context';
import List from '../saved-statements/list';

interface IStoreProcedureProps {}

const StoreProcedure: React.FunctionComponent<IStoreProcedureProps> = props => {
  const { store, updateStore } = useContext();
  const { storeProcedures } = store;
  const items = storeProcedures.map(item => {
    return item;
  });
  const handleClick = value => {
    const { id } = value;
    updateStore(draft => {
      const queryIds = draft.statements.map(item => item.id);
      const HAS_QUERY = queryIds.indexOf(id) !== -1;
      draft.activeId = id;
      if (!HAS_QUERY) {
        draft.statements = [value, ...draft.statements];
      }
    });
  };
  const handleNav = () => {};
  return (
    <div>
      <List items={items} onClick={handleClick} />
    </div>
  );
};

export default StoreProcedure;
