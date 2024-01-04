import * as React from 'react';
import { useContext } from '../../context';
import List from './list';
interface ISavedStatementsProps {}

const SavedStatements: React.FunctionComponent<ISavedStatementsProps> = props => {
  const { store, updateStore } = useContext();
  const { savedStatements } = store;

  const items = savedStatements.map(item => {
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
  console.log(savedStatements);
  return (
    <div>
      <List items={items} onClick={handleClick} />
    </div>
  );
};

export default SavedStatements;
