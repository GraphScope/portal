import React from 'react';
import { useContext } from '../../context';
import List from '../statement-list';
import Section from '../section';

const HistoryStatements = props => {
  const { deleteHistoryStatements } = props;
  const { store, updateStore } = useContext();
  const { historyStatements } = store;

  const handleClick = value => {
    const { id, script } = value;
    updateStore(draft => {
      draft.globalScript = script;
      draft.autoRun = false;
    });
  };

  const handleDelete = async ids => {
    deleteHistoryStatements(ids);
    updateStore(draft => {
      draft.historyStatements = draft.historyStatements.filter(item => {
        return ids.indexOf(item.id) === -1;
      });
    });
  };
  const items = historyStatements.map(item => {
    return item;
  });
  return (
    <Section title="History">
      <List
        items={items}
        onClick={handleClick}
        onDelete={handleDelete}
        placeholder={
          <>
            No query history available
            <br />
          </>
        }
      />
    </Section>
  );
};

export default HistoryStatements;
