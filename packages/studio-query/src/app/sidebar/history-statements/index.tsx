import React, { useState } from 'react';
import { useContext } from '../../context';
import List from '../statement-list';
import { Typography, Flex } from 'antd';

const HistoryStatements = props => {
  const { deleteHistoryStatements } = props;
  const { store, updateStore } = useContext();
  const { historyStatements } = store;

  const handleClick = value => {
    const { id, script } = value;
    updateStore(draft => {
      draft.globalScript = script;
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
    <Flex vertical style={{ height: '100%', overflow: 'hidden' }}>
      <Typography.Title level={5} style={{ margin: '0px', flexBasis: '30px', padding: '12px' }}>
        History
      </Typography.Title>
      <List items={items} onClick={handleClick} onDelete={handleDelete} />
    </Flex>
  );
};

export default HistoryStatements;
